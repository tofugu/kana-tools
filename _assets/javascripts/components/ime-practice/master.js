var AppBox = React.createClass({
  getInitialState: function() {
    return {
      sentences: [],
      activeSentence: {
        "id": null,
        "bun": '',
        "kana": '',
        "eng": ''
      },
      activeSentenceCharacterGroups: [],
      activeCharacterGroup: {},
      currentSentencePosition: 0,
      isInputIncorrect: false,
      errorHistory: []
    };
  },
  componentDidMount: function() {
    var errorHistory = JSON.parse(localStorage.getItem('imePractice#errorHistory')) || [];
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({sentences: data, errorHistory: errorHistory});
        this.setActiveSentence();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidUpdate: function() {
    localStorage.setItem('imePractice#errorHistory', JSON.stringify(this.state.errorHistory));
  },
  handleClearErrorHistory: function(input) {
    this.setState({errorHistory: []});
  },
  handleInputCheck: function(input) {
    var correctInputs = this.state.activeCharacterGroup.romajis;
    var correctInputsSet = new Set(correctInputs);

    // Check if the user input completely matches with the current character group acceptable romaji
    if (correctInputsSet.has(input)) {
      return this.handleInputComplete();
    }

    // Continue if user input does not complete match current character group of accetable romaji

    // If the user input doesn't completely match, check if it is a substring match
    // If not, send an incorrect input flag
    var correctInputsSubstrings = correctInputs.map(function(romaji) {
      return romaji.substring(0, input.length);
    });
    var correctInputsSubstringsSet = new Set(correctInputsSubstrings);
    var isInputIncorrect;

    if (correctInputsSubstringsSet.has(input)) {
      isInputIncorrect = false;
    } else {
      isInputIncorrect = true;
    }
    this.setState({isInputIncorrect: isInputIncorrect});

    if (isInputIncorrect) {
      // Add incorrect input to error history
      var errorHistory = this.state.errorHistory;
      var errorHistoryFirstElement = errorHistory[0];
      var activeSentence = this.state.activeSentence;
      var currentSentencePosition = this.state.currentSentencePosition;

      // Checks if top element matches the current sentence. If so then add the current sentence position.
      // If not, then create a new hash object.
      if (errorHistoryFirstElement && errorHistoryFirstElement.id == activeSentence.id) {
        if (errorHistoryFirstElement.positions.indexOf(currentSentencePosition) == -1) {
          errorHistoryFirstElement.positions.push(currentSentencePosition);
          errorHistory.shift();
          errorHistory.unshift(errorHistoryFirstElement);
          this.setState({errorHistory: errorHistory});
        }
      } else {
        errorHistoryFirstElement = { id: activeSentence.id, positions: [currentSentencePosition] }
        errorHistory.unshift(errorHistoryFirstElement);
        this.setState({errorHistory: errorHistory});
      }
    }

    return { inputComplete: false };
  },
  handleInputComplete: function() {
    var newPosition = this.state.currentSentencePosition + 1;
    var isSentenceComplete = false;

    if (this.state.activeSentenceCharacterGroups.length < newPosition + 1) {
      isSentenceComplete = true;
    } else {
      this.setActiveCharacterGroup(newPosition, this.state.activeSentenceCharacterGroups);
    }
    return { inputComplete: true, sentenceComplete: isSentenceComplete };
  },
  handleSentenceComplete: function() {
    // Set new, random active sentence
    this.setActiveSentence();
  },
  kanaToRomaji: function(kana) {
    // add katakana equivalent
    var kanaTable = {
      あ: ['a'],
      い: ['i'],
      う: ['u'],
      え: ['e'],
      お: ['o'],
      ゔぁ: ['va'],
      ゔぃ: ['vi'],
      ゔ: ['vu'],
      ゔぇ: ['ve'],
      ゔぉ: ['vo'],
      か: ['ka'],
      き: ['ki'],
      きゃ: ['kya'],
      きぃ: ['kyi'],
      きゅ: ['kyu'],
      く: ['ku'],
      け: ['ke'],
      こ: ['ko'],
      が: ['ga'],
      ぎ: ['gi'],
      ぐ: ['gu'],
      げ: ['ge'],
      ご: ['go'],
      ぎゃ: ['gya'],
      ぎぃ: ['gyi'],
      ぎゅ: ['gyu'],
      ぎぇ: ['gye'],
      ぎょ: ['gyo'],
      さ: ['sa'],
      す: ['su'],
      せ: ['se'],
      そ: ['so'],
      ざ: ['za'],
      ず: ['zu'],
      ぜ: ['ze'],
      ぞ: ['zo'],
      し: ['shi', 'si'],
      しゃ: ['sha', 'sya'],
      しゅ: ['shu', 'syu'],
      しょ: ['sho', 'syo'],
      じ: ['ji', 'zi'],
      じゃ: ['ja', 'jya'],
      じゅ: ['ju', 'jyu'],
      じょ: ['jo', 'jyo'],
      た: ['ta'],
      ち: ['chi', 'ti'],
      ちゃ: ['cha', 'cya'],
      ちゅ: ['chu', 'cyu'],
      ちょ: ['cho', 'cyo'],
      つ: ['tsu', 'tu'],
      て: ['te'],
      と: ['to'],
      だ: ['da'],
      ぢ: ['di'],
      づ: ['du'],
      で: ['de'],
      ど: ['do'],
      な: ['na'],
      に: ['ni'],
      にゃ: ['nya'],
      にゅ: ['nyu'],
      にょ: ['nyo'],
      ぬ: ['nu'],
      ね: ['ne'],
      の: ['no'],
      は: ['ha'],
      ひ: ['hi'],
      ふ: ['fu'],
      へ: ['he'],
      ほ: ['ho'],
      ひゃ: ['hya'],
      ひゅ: ['hyu'],
      ひょ: ['hyo'],
      ふぁ: ['fa'],
      ふぃ: ['fi'],
      ふぇ: ['fe'],
      ふぉ: ['fo'],
      ば: ['ba'],
      び: ['bi'],
      ぶ: ['bu'],
      べ: ['be'],
      ぼ: ['bo'],
      びゃ: ['bya'],
      びゅ: ['byu'],
      びょ: ['byo'],
      ぱ: ['pa'],
      ぴ: ['pi'],
      ぷ: ['pu'],
      ぺ: ['pe'],
      ぽ: ['po'],
      ぴゃ: ['pya'],
      ぴゅ: ['pyu'],
      ぴょ: ['pyo'],
      ま: ['ma'],
      み: ['mi'],
      む: ['mu'],
      め: ['me'],
      も: ['mo'],
      みゃ: ['mya'],
      みゅ: ['myu'],
      みょ: ['myo'],
      や: ['ya'],
      ゆ: ['yu'],
      よ: ['yo'],
      ら: ['ra'],
      り: ['ri'],
      る: ['ru'],
      れ: ['re'],
      ろ: ['ro'],
      りゃ: ['rya'],
      りゅ: ['ryu'],
      りょ: ['ryo'],
      わ: ['wa'],
      を: ['wo'],
      ん: ['nn', 'n ', "n'"],
      ゐ: ['wi'],
      ゑ: ['we'],
      きぇ: ['kye'],
      きょ: ['kyo'],
      じぃ: ['jyi'],
      じぇ: ['jye'],
      ちぃ: ['cyi'],
      ちぇ: ['che'],
      ひぃ: ['hyi'],
      ひぇ: ['hye'],
      びぃ: ['byi'],
      びぇ: ['bye'],
      ぴぃ: ['pyi'],
      ぴぇ: ['pye'],
      みぇ: ['mye'],
      みぃ: ['myi'],
      りぃ: ['ryi'],
      りぇ: ['rye'],
      にぃ: ['nyi'],
      にぇ: ['nye'],
      しぃ: ['syi'],
      しぇ: ['she'],
      いぇ: ['ye'],
      うぁ: ['wha'],
      うぉ: ['who'],
      うぃ: ['wi'],
      うぇ: ['we'],
      ゔゃ: ['vya'],
      ゔゅ: ['vyu'],
      ゔょ: ['vyo'],
      すぁ: ['swa'],
      すぃ: ['swi'],
      すぅ: ['swu'],
      すぇ: ['swe'],
      すぉ: ['swo'],
      くゃ: ['qya'],
      くゅ: ['qyu'],
      くょ: ['qyo'],
      くぁ: ['qwa'],
      くぃ: ['qwi'],
      くぅ: ['qwu'],
      くぇ: ['qwe'],
      くぉ: ['qwo'],
      ぐぁ: ['gwa'],
      ぐぃ: ['gwi'],
      ぐぅ: ['gwu'],
      ぐぇ: ['gwe'],
      ぐぉ: ['gwo'],
      つぁ: ['tsa'],
      つぃ: ['tsi'],
      つぇ: ['tse'],
      つぉ: ['tso'],
      てゃ: ['tha'],
      てぃ: ['thi'],
      てゅ: ['thu'],
      てぇ: ['the'],
      てょ: ['tho'],
      とぁ: ['twa'],
      とぃ: ['twi'],
      とぅ: ['twu'],
      とぇ: ['twe'],
      とぉ: ['two'],
      ぢゃ: ['dya'],
      ぢぃ: ['dyi'],
      ぢゅ: ['dyu'],
      ぢぇ: ['dye'],
      ぢょ: ['dyo'],
      でゃ: ['dha'],
      でぃ: ['dhi'],
      でゅ: ['dhu'],
      でぇ: ['dhe'],
      でょ: ['dho'],
      どぁ: ['dwa'],
      どぃ: ['dwi'],
      どぅ: ['dwu'],
      どぇ: ['dwe'],
      どぉ: ['dwo'],
      ふぅ: ['fwu'],
      ふゃ: ['fya'],
      ふゅ: ['fyu'],
      ふょ: ['fyo'],
      っか: ['kka'],
      っき: ['kki'],
      っきゃ: ['kkya'],
      っきぃ: ['kkyi'],
      っきゅ: ['kkyu'],
      っく: ['kku'],
      っけ: ['kke'],
      っこ: ['kko'],
      っが: ['gga'],
      っぎ: ['ggi'],
      っぐ: ['ggu'],
      っげ: ['gge'],
      っご: ['ggo'],
      っぎゃ: ['ggya'],
      っぎぃ: ['ggyi'],
      っぎゅ: ['ggyu'],
      っぎぇ: ['ggye'],
      っぎょ: ['ggyo'],
      っさ: ['ssa'],
      っす: ['ssu'],
      っせ: ['sse'],
      っそ: ['sso'],
      っざ: ['zza'],
      っず: ['zzu'],
      っぜ: ['zze'],
      っぞ: ['zzo'],
      っし: ['sshi', 'ssi'],
      っしゃ: ['ssha', 'ssya'],
      っしゅ: ['sshu', 'ssyu'],
      っしょ: ['ssho', 'ssyo'],
      っじ: ['jji', 'zzi'],
      っじゃ: ['jja', 'jjya'],
      っじゅ: ['jju', 'jjyu'],
      っじょ: ['jjo', 'jjyo'],
      った: ['tta'],
      っち: ['cchi', 'tti'],
      っちゃ: ['ccha', 'ccya'],
      っちゅ: ['cchu', 'ccyu'],
      っちょ: ['ccho', 'ccyo'],
      っつ: ['ttsu', 'ttu'],
      って: ['tte'],
      っと: ['tto'],
      っだ: ['dda'],
      っぢ: ['ddi'],
      っづ: ['ddu'],
      っで: ['dde'],
      っど: ['ddo'],
      っな: ['nna'],
      っに: ['nni'],
      っにゃ: ['nnya'],
      っにゅ: ['nnyu'],
      っにょ: ['nnyo'],
      っぬ: ['nnu'],
      っね: ['nne'],
      っの: ['nno'],
      っは: ['hha'],
      っひ: ['hhi'],
      っふ: ['ffu'],
      っへ: ['hhe'],
      っほ: ['hho'],
      っひゃ: ['hhya'],
      っひゅ: ['hhyu'],
      っひょ: ['hhyo'],
      っふぁ: ['ffa'],
      っふぃ: ['ffi'],
      っふぇ: ['ffe'],
      っふぉ: ['ffo'],
      っば: ['bba'],
      っび: ['bbi'],
      っぶ: ['bbu'],
      っべ: ['bbe'],
      っぼ: ['bbo'],
      っびゃ: ['bbya'],
      っびゅ: ['bbyu'],
      っびょ: ['bbyo'],
      っぱ: ['ppa'],
      っぴ: ['ppi'],
      っぷ: ['ppu'],
      っぺ: ['ppe'],
      っぽ: ['ppo'],
      っぴゃ: ['ppya'],
      っぴゅ: ['ppyu'],
      っぴょ: ['ppyo'],
      っま: ['mma'],
      っみ: ['mmi'],
      っむ: ['mmu'],
      っめ: ['mme'],
      っも: ['mmo'],
      っみゃ: ['mmya'],
      っみゅ: ['mmyu'],
      っみょ: ['mmyo'],
      っや: ['yya'],
      っゆ: ['yyu'],
      っよ: ['yyo'],
      っら: ['rra'],
      っり: ['rri'],
      っる: ['rru'],
      っれ: ['rre'],
      っろ: ['rro'],
      っりゃ: ['rrya'],
      っりゅ: ['rryu'],
      っりょ: ['rryo'],
      っわ: ['wwa'],
      っん: ['xtsunn', 'xtsun ', "xtsun'"],
      っゐ: ['wwi'],
      っゑ: ['wwe'],
      っきぇ: ['kkye'],
      っきょ: ['kkyo'],
      っじぃ: ['jjyi'],
      っじぇ: ['jjye'],
      っちぃ: ['ccyi'],
      っちぇ: ['cche'],
      っひぃ: ['hhyi'],
      っひぇ: ['hhye'],
      っびぃ: ['bbyi'],
      っびぇ: ['bbye'],
      っぴぃ: ['ppyi'],
      っぴぇ: ['ppye'],
      っみぇ: ['mmye'],
      っみぃ: ['mmyi'],
      っりぃ: ['rryi'],
      っりぇ: ['rrye'],
      っにぃ: ['nnyi'],
      っにぇ: ['nnye'],
      っしぃ: ['ssyi'],
      っしぇ: ['sshe'],
      っいぇ: ['yye'],
      っうぁ: ['wwha'],
      っうぉ: ['wwho'],
      っうぃ: ['wwi'],
      っうぇ: ['wwe'],
      っゔゃ: ['vvya'],
      っゔゅ: ['vvyu'],
      っゔょ: ['vvyo'],
      っすぁ: ['sswa'],
      っすぃ: ['sswi'],
      っすぅ: ['sswu'],
      っすぇ: ['sswe'],
      っすぉ: ['sswo'],
      っくゃ: ['qqya'],
      っくゅ: ['qqyu'],
      っくょ: ['qqyo'],
      っくぁ: ['qqwa'],
      っくぃ: ['qqwi'],
      っくぅ: ['qqwu'],
      っくぇ: ['qqwe'],
      っくぉ: ['qqwo'],
      っぐぁ: ['ggwa'],
      っぐぃ: ['ggwi'],
      っぐぅ: ['ggwu'],
      っぐぇ: ['ggwe'],
      っぐぉ: ['ggwo'],
      っつぁ: ['ttsa'],
      っつぃ: ['ttsi'],
      っつぇ: ['ttse'],
      っつぉ: ['ttso'],
      ってゃ: ['ttha'],
      ってぃ: ['tthi'],
      ってゅ: ['tthu'],
      ってぇ: ['tthe'],
      ってょ: ['ttho'],
      っとぁ: ['ttwa'],
      っとぃ: ['ttwi'],
      っとぅ: ['ttwu'],
      っとぇ: ['ttwe'],
      っとぉ: ['ttwo'],
      っぢゃ: ['ddya'],
      っぢぃ: ['ddyi'],
      っぢゅ: ['ddyu'],
      っぢぇ: ['ddye'],
      っぢょ: ['ddyo'],
      っでゃ: ['ddha'],
      っでぃ: ['ddhi'],
      っでゅ: ['ddhu'],
      っでぇ: ['ddhe'],
      っでょ: ['ddho'],
      っどぁ: ['ddwa'],
      っどぃ: ['ddwi'],
      っどぅ: ['ddwu'],
      っどぇ: ['ddwe'],
      っどぉ: ['ddwo'],
      っふぅ: ['ffwu'],
      っふゃ: ['ffya'],
      っふゅ: ['ffyu'],
      っふょ: ['ffyo'],
      ア: ["A"],
      イ: ["I"],
      ウ: ["U"],
      エ: ["E"],
      オ: ["O"],
      ゔァ: ["VA"],
      ゔィ: ["VI"],
      ゔ: ["VU"],
      ゔェ: ["VE"],
      ゔォ: ["VO"],
      カ: ["KA"],
      キ: ["KI"],
      キャ: ["KYA"],
      キィ: ["KYI"],
      キュ: ["KYU"],
      ク: ["KU"],
      ケ: ["KE"],
      コ: ["KO"],
      ガ: ["GA"],
      ギ: ["GI"],
      グ: ["GU"],
      ゲ: ["GE"],
      ゴ: ["GO"],
      ギャ: ["GYA"],
      ギィ: ["GYI"],
      ギュ: ["GYU"],
      ギェ: ["GYE"],
      ギョ: ["GYO"],
      サ: ["SA"],
      ス: ["SU"],
      セ: ["SE"],
      ソ: ["SO"],
      ザ: ["ZA"],
      ズ: ["ZU"],
      ゼ: ["ZE"],
      ゾ: ["ZO"],
      シ: ["SHI", "SI"],
      シャ: ["SHA"],
      シュ: ["SHU"],
      ショ: ["SHO"],
      ジ: ["JI", "ZI"],
      ジャ: ["JA", "JYA"],
      ジュ: ["JU", "JYU"],
      ジョ: ["JO", "JYO"],
      タ: ["TA"],
      チ: ["CHI", "TI"],
      チャ: ["CHA", "CYA"],
      チュ: ["CHU", "CYU"],
      チョ: ["CHO", "CYO"],
      ツ: ["TSU", "TU"],
      テ: ["TE"],
      ト: ["TO"],
      ダ: ["DA"],
      ヂ: ["DI"],
      ヅ: ["DU"],
      デ: ["DE"],
      ド: ["DO"],
      ナ: ["NA"],
      ニ: ["NI"],
      ニャ: ["NYA"],
      ニュ: ["NYU"],
      ニョ: ["NYO"],
      ヌ: ["NU"],
      ネ: ["NE"],
      ノ: ["NO"],
      ハ: ["HA"],
      ヒ: ["HI"],
      フ: ["FU"],
      ヘ: ["HE"],
      ホ: ["HO"],
      ヒャ: ["HYA"],
      ヒュ: ["HYU"],
      ヒョ: ["HYO"],
      ファ: ["FA"],
      フィ: ["FI"],
      フェ: ["FE"],
      フォ: ["FO"],
      バ: ["BA"],
      ビ: ["BI"],
      ブ: ["BU"],
      ベ: ["BE"],
      ボ: ["BO"],
      ビャ: ["BYA"],
      ビュ: ["BYU"],
      ビョ: ["BYO"],
      パ: ["PA"],
      ピ: ["PI"],
      プ: ["PU"],
      ペ: ["PE"],
      ポ: ["PO"],
      ピャ: ["PYA"],
      ピュ: ["PYU"],
      ピョ: ["PYO"],
      マ: ["MA"],
      ミ: ["MI"],
      ム: ["MU"],
      メ: ["ME"],
      モ: ["MO"],
      ミャ: ["MYA"],
      ミュ: ["MYU"],
      ミョ: ["MYO"],
      ヤ: ["YA"],
      ユ: ["YU"],
      ヨ: ["YO"],
      ラ: ["RA"],
      リ: ["RI"],
      ル: ["RU"],
      レ: ["RE"],
      ロ: ["RO"],
      リャ: ["RYA"],
      リュ: ["RYU"],
      リョ: ["RYO"],
      ワ: ["WA"],
      ヲ: ["WO"],
      ン: ["NN", "N ", "N'"],
      ヰ: ["WI"],
      ヱ: ["WE"],
      キェ: ["KYE"],
      キョ: ["KYO"],
      ジィ: ["JYI"],
      ジェ: ["JYE"],
      チィ: ["CYI"],
      チェ: ["CHE"],
      ヒィ: ["HYI"],
      ヒェ: ["HYE"],
      ビィ: ["BYI"],
      ビェ: ["BYE"],
      ピィ: ["PYI"],
      ピェ: ["PYE"],
      ミェ: ["MYE"],
      ミィ: ["MYI"],
      リィ: ["RYI"],
      リェ: ["RYE"],
      ニィ: ["NYI"],
      ニェ: ["NYE"],
      シィ: ["SYI"],
      シェ: ["SHE"],
      イェ: ["YE"],
      ウァ: ["WHA"],
      ウォ: ["WHO"],
      ウィ: ["WI"],
      ウェ: ["WE"],
      ゔャ: ["VYA"],
      ゔュ: ["VYU"],
      ゔョ: ["VYO"],
      スァ: ["SWA"],
      スィ: ["SWI"],
      スゥ: ["SWU"],
      スェ: ["SWE"],
      スォ: ["SWO"],
      クャ: ["QYA"],
      クュ: ["QYU"],
      クョ: ["QYO"],
      クァ: ["QWA"],
      クィ: ["QWI"],
      クゥ: ["QWU"],
      クェ: ["QWE"],
      クォ: ["QWO"],
      グァ: ["GWA"],
      グィ: ["GWI"],
      グゥ: ["GWU"],
      グェ: ["GWE"],
      グォ: ["GWO"],
      ツァ: ["TSA"],
      ツィ: ["TSI"],
      ツェ: ["TSE"],
      ツォ: ["TSO"],
      テャ: ["THA"],
      ティ: ["THI"],
      テュ: ["THU"],
      テェ: ["THE"],
      テョ: ["THO"],
      トァ: ["TWA"],
      トィ: ["TWI"],
      トゥ: ["TWU"],
      トェ: ["TWE"],
      トォ: ["TWO"],
      ヂャ: ["DYA"],
      ヂィ: ["DYI"],
      ヂュ: ["DYU"],
      ヂェ: ["DYE"],
      ヂョ: ["DYO"],
      デャ: ["DHA"],
      ディ: ["DHI"],
      デュ: ["DHU"],
      デェ: ["DHE"],
      デョ: ["DHO"],
      ドァ: ["DWA"],
      ドィ: ["DWI"],
      ドゥ: ["DWU"],
      ドェ: ["DWE"],
      ドォ: ["DWO"],
      フゥ: ["FWU"],
      フャ: ["FYA"],
      フュ: ["FYU"],
      フョ: ["FYO"],
      ッカ: ["KKA"],
      ッキ: ["KKI"],
      ッキャ: ["KKYA"],
      ッキィ: ["KKYI"],
      ッキュ: ["KKYU"],
      ック: ["KKU"],
      ッケ: ["KKE"],
      ッコ: ["KKO"],
      ッガ: ["GGA"],
      ッギ: ["GGI"],
      ッグ: ["GGU"],
      ッゲ: ["GGE"],
      ッゴ: ["GGO"],
      ッギャ: ["GGYA"],
      ッギィ: ["GGYI"],
      ッギュ: ["GGYU"],
      ッギェ: ["GGYE"],
      ッギョ: ["GGYO"],
      ッサ: ["SSA"],
      ッス: ["SSU"],
      ッセ: ["SSE"],
      ッソ: ["SSO"],
      ッザ: ["ZZA"],
      ッズ: ["ZZU"],
      ッゼ: ["ZZE"],
      ッゾ: ["ZZO"],
      ッシ: ["SSHI", "SSI"],
      ッシャ: ["SSHA", "SSYA"],
      ッシュ: ["SSHU", "SSYU"],
      ッショ: ["SSHO", "SSYO"],
      ッジ: ["JJI", "ZZI"],
      ッジャ: ["JJA", "JJYA"],
      ッジュ: ["JJU", "JJYU"],
      ッジョ: ["JJO", "JJYO"],
      ッタ: ["TTA"],
      ッチ: ["CCHI", "TTI"],
      ッチャ: ["CCHA"],
      ッチュ: ["CCHU"],
      ッチョ: ["CCHO"],
      ッツ: ["TTSU", "TTU"],
      ッテ: ["TTE"],
      ット: ["TTO"],
      ッダ: ["DDA"],
      ッヂ: ["DDI"],
      ッヅ: ["DDU"],
      ッデ: ["DDE"],
      ッド: ["DDO"],
      ッナ: ["NNA"],
      ッニ: ["NNI"],
      ッニャ: ["NNYA"],
      ッニュ: ["NNYU"],
      ッニョ: ["NNYO"],
      ッヌ: ["NNU"],
      ッネ: ["NNE"],
      ッノ: ["NNO"],
      ッハ: ["HHA"],
      ッヒ: ["HHI"],
      ッフ: ["FFU"],
      ッヘ: ["HHE"],
      ッホ: ["HHO"],
      ッヒャ: ["HHYA"],
      ッヒュ: ["HHYU"],
      ッヒョ: ["HHYO"],
      ッファ: ["FFA"],
      ッフィ: ["FFI"],
      ッフェ: ["FFE"],
      ッフォ: ["FFO"],
      ッバ: ["BBA"],
      ッビ: ["BBI"],
      ッブ: ["BBU"],
      ッベ: ["BBE"],
      ッボ: ["BBO"],
      ッビャ: ["BBYA"],
      ッビュ: ["BBYU"],
      ッビョ: ["BBYO"],
      ッパ: ["PPA"],
      ッピ: ["PPI"],
      ップ: ["PPU"],
      ッペ: ["PPE"],
      ッポ: ["PPO"],
      ッピャ: ["PPYA"],
      ッピュ: ["PPYU"],
      ッピョ: ["PPYO"],
      ッマ: ["MMA"],
      ッミ: ["MMI"],
      ッム: ["MMU"],
      ッメ: ["MME"],
      ッモ: ["MMO"],
      ッミャ: ["MMYA"],
      ッミュ: ["MMYU"],
      ッミョ: ["MMYO"],
      ッヤ: ["YYA"],
      ッユ: ["YYU"],
      ッヨ: ["YYO"],
      ッラ: ["RRA"],
      ッリ: ["RRI"],
      ッル: ["RRU"],
      ッレ: ["RRE"],
      ッロ: ["RRO"],
      ッリャ: ["RRYA"],
      ッリュ: ["RRYU"],
      ッリョ: ["RRYO"],
      ッワ: ["WWA"],
      ッン: ["XTSUNN", "XTSUN "],
      ッヰ: ["WWI"],
      ッヱ: ["WWE"],
      ッキェ: ["KKYE"],
      ッキョ: ["KKYO"],
      ッジィ: ["JJYI"],
      ッジェ: ["JJYE"],
      ッチィ: ["CCYI"],
      ッチェ: ["CCHE"],
      ッヒィ: ["HHYI"],
      ッヒェ: ["HHYE"],
      ッビィ: ["BBYI"],
      ッビェ: ["BBYE"],
      ッピィ: ["PPYI"],
      ッピェ: ["PPYE"],
      ッミェ: ["MMYE"],
      ッミィ: ["MMYI"],
      ッリィ: ["RRYI"],
      ッリェ: ["RRYE"],
      ッニィ: ["NNYI"],
      ッニェ: ["NNYE"],
      ッシィ: ["SSYI"],
      ッシェ: ["SSHE"],
      ッイェ: ["YYE"],
      ッウァ: ["WWHA"],
      ッウォ: ["WWHO"],
      ッウィ: ["WWI"],
      ッウェ: ["WWE"],
      ッゔャ: ["VVYA"],
      ッゔュ: ["VVYU"],
      ッゔョ: ["VVYO"],
      ッスァ: ["SSWA"],
      ッスィ: ["SSWI"],
      ッスゥ: ["SSWU"],
      ッスェ: ["SSWE"],
      ッスォ: ["SSWO"],
      ックャ: ["QQYA"],
      ックュ: ["QQYU"],
      ックョ: ["QQYO"],
      ックァ: ["QQWA"],
      ックィ: ["QQWI"],
      ックゥ: ["QQWU"],
      ックェ: ["QQWE"],
      ックォ: ["QQWO"],
      ッグァ: ["GGWA"],
      ッグィ: ["GGWI"],
      ッグゥ: ["GGWU"],
      ッグェ: ["GGWE"],
      ッグォ: ["GGWO"],
      ッツァ: ["TTSA"],
      ッツィ: ["TTSI"],
      ッツェ: ["TTSE"],
      ッツォ: ["TTSO"],
      ッテャ: ["TTHA"],
      ッティ: ["TTHI"],
      ッテュ: ["TTHU"],
      ッテェ: ["TTHE"],
      ッテョ: ["TTHO"],
      ットァ: ["TTWA"],
      ットィ: ["TTWI"],
      ットゥ: ["TTWU"],
      ットェ: ["TTWE"],
      ットォ: ["TTWO"],
      ッヂャ: ["DDYA"],
      ッヂィ: ["DDYI"],
      ッヂュ: ["DDYU"],
      ッヂェ: ["DDYE"],
      ッヂョ: ["DDYO"],
      ッデャ: ["DDHA"],
      ッディ: ["DDHI"],
      ッデュ: ["DDHU"],
      ッデェ: ["DDHE"],
      ッデョ: ["DDHO"],
      ッドァ: ["DDWA"],
      ッドィ: ["DDWI"],
      ッドゥ: ["DDWU"],
      ッドェ: ["DDWE"],
      ッドォ: ["DDWO"],
      ッフゥ: ["FFWU"],
      ッフャ: ["FFYA"],
      ッフュ: ["FFYU"],
      ッフョ: ["FFYO"],
      'ー': ['-'],
      '、': [','],
      '。': ['.'],
      '！': ['!'],
      '・': ['/'],
      '？': ['?']
    }
    return kanaTable[kana]
  },
  selectRandomSentence: function() {
    var sentences = this.state.sentences;
    return sentences[Math.floor(Math.random()*sentences.length)];
  },
  setActiveCharacterGroup: function(position, sentenceCharacterGroups) {
    var activeCharacterGroup = sentenceCharacterGroups[position];
    var activeCharacterGroupRomajis = this.kanaToRomaji(activeCharacterGroup);
    var activeCharacterGroupInfo = {
      kana: activeCharacterGroup,
      romajis: activeCharacterGroupRomajis
    }

    this.setState({
      activeCharacterGroup: activeCharacterGroupInfo,
      currentSentencePosition: position,
      isInputIncorrect: false
    });
  },
  setActiveSentence: function() {
    var randomSentence = this.selectRandomSentence();
    var randomSentenceCharacterGroups;

    randomSentenceCharacterGroups = this.separateSentenceInfoCharacterGroups(randomSentence.kana);

    this.setState({
      activeSentence: randomSentence,
      activeSentenceCharacterGroups: randomSentenceCharacterGroups
    });

    this.setActiveCharacterGroup(0, randomSentenceCharacterGroups);
  },
  separateSentenceInfoCharacterGroups: function(sentence) {
    var _this = this;
    var sentenceCharacterGroups = [];

    while (sentence.length > 0) {
      var potentialGroupThreeChar = sentence.substring(0,3);
      var potentialGroupTwoChar = sentence.substring(0,2);
      var potentialGroupRomajiThreeChar = _this.kanaToRomaji(potentialGroupThreeChar);
      var potentialGroupRomajiTwoChar = _this.kanaToRomaji(potentialGroupTwoChar);

      if (potentialGroupRomajiThreeChar) {
        sentenceCharacterGroups.push(potentialGroupThreeChar);
        sentence = sentence.slice(3);
      } else if (potentialGroupRomajiTwoChar) {
        sentenceCharacterGroups.push(potentialGroupTwoChar);
        sentence = sentence.slice(2);
      } else {
        sentenceCharacterGroups.push(sentence.substring(0,1));
        sentence = sentence.slice(1);
      }
    }

    return sentenceCharacterGroups;
  },
  render: function() {
    return (
      <div className="app-box">
        <VisualFeedback characterGroups={this.state.activeSentenceCharacterGroups} inputIncorrect={this.state.isInputIncorrect} currentSentencePosition={this.state.currentSentencePosition} handleKanaToRomaji={this.kanaToRomaji} />
        <UserInput characterGroups={this.state.activeSentenceCharacterGroups} currentSentencePosition={this.state.currentSentencePosition} onInputCheck={this.handleInputCheck} onSentenceComplete={this.handleSentenceComplete} inputIncorrect={this.state.isInputIncorrect} />
        <SentenceInformation sentence={this.state.activeSentence} />
        <ErrorHistory errorHistory={this.state.errorHistory} sentences={this.state.sentences} handleSentenceIntoCharacterGroups={this.separateSentenceInfoCharacterGroups} handleKanaToRomaji={this.kanaToRomaji} handleClearErrorHistory={this.handleClearErrorHistory} />
      </div>
    );
  }
});

var VisualFeedback = React.createClass({
  render: function() {
    var _this = this;
    var inputIncorrect = this.props.inputIncorrect;
    var currentSentencePosition = this.props.currentSentencePosition;
    var characterGroupNodes = this.props.characterGroups.map(function(characterGroup, index) {
      var listItem;
      var romajiOptions = _this.props.handleKanaToRomaji(characterGroup).map(function(character) { return character.replace(' ', '{space}') }).join(', ');

      if (index < currentSentencePosition) {
        listItem = <li className="correct" data-position={index} data-romajis={romajiOptions}>{characterGroup}</li>
      } else if (index == currentSentencePosition) {
        if (inputIncorrect) {
          listItem = <li className="incorrect" data-position={index} data-romajis={romajiOptions}>{characterGroup}</li>;
        } else {
          listItem = <li data-position={index} data-romajis={romajiOptions}>{characterGroup}</li>;
        }
      } else {
        listItem = <li data-position={index} data-romajis={romajiOptions}>{characterGroup}</li>;
      }

      return (listItem);
    });
    return (
      <div className="basic-kana-sentence">
        <h2 className="mini muted">Basic kana sentence</h2>
        <ul lang="ja" className="sentence">
          {characterGroupNodes}
        </ul>
      </div>
    );
  }
});

var UserInput = React.createClass({
  getInitialState: function() {
    return { userInput: '' };
  },
  handleFocusInput: function(e) {
    document.getElementById('user-text-input').focus();
  },
  handleUserInputChange: function(e) {
    this.setState({userInput: e.target.value});
    var inputCheck = this.props.onInputCheck(e.target.value);
    e.target.style.width = e.target.value.length + 'em';
    if (inputCheck.inputComplete) {
      e.target.style.width = '0';
      this.setState({userInput: ''});
    }

    if (inputCheck.sentenceComplete) {
      e.target.style.width = '0';
      this.props.onSentenceComplete();
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var input = this.state.userInput.trim();
    // May not be required
  },
  render: function () {
    var userInputClass;
    var currentSentencePosition = this.props.currentSentencePosition;

    if (this.props.inputIncorrect) {
      userInputClass = 'user-input incorrect'
    } else {
      userInputClass = 'user-input'
    };

    var characterGroupNodes = this.props.characterGroups.map(function(characterGroup, index) {
      var listItem = <li data-position={index}>{characterGroup}</li>;
      return (listItem);
    }).slice(0,currentSentencePosition);

    return (
      <div className={userInputClass} onClick={this.handleFocusInput}>
        <h2 className="mini invert muted">Type out the sentence in romaji</h2>
        <ul lang="ja" className="sentence">
          {characterGroupNodes}
          <li>
            <input
              id="user-text-input"
              type="text"
              name="user-input"
              value={this.state.userInput}
              maxLength="4"
              onChange={this.handleUserInputChange}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellcheck="false"
              autoFocus={true}
            />
          </li>
        </ul>
      </div>
    );
  }
});


var SentenceInformation = React.createClass({
  render: function() {
    return (
      <div className="additional-sentence-information">
        <h2 className="mini invert muted">Advance kana sentence &amp; translation</h2>
        <dl>
          <dt className="real-word-sentence">{this.props.sentence.bun}</dt>
          <dd className="english-sentence-translation">{this.props.sentence.eng}</dd>
        </dl>
      </div>
    );
  }
});

var ErrorHistory = React.createClass({
  render: function() {
    var _this = this;
    var errorHistory = this.props.errorHistory;
    var sentencesNodes = this.props.errorHistory.map(function(sentenceErrorInfo, index) {
      var cardItem;
      var characterGroupsNodes;
      var sentence;
      var characterGroups;
      var characterGroupsErrorNodes;

      sentence = $.grep(_this.props.sentences, function(s){ return s.id == sentenceErrorInfo.id; })[0];
      characterGroups = _this.props.handleSentenceIntoCharacterGroups(sentence.kana);

      characterGroupsNodes = characterGroups.map(function(characterGroup, index) {
        var listItem;

        if (sentenceErrorInfo.positions.indexOf(index) == -1) {
          listItem = <li data-position={index}>{characterGroup}</li>
        } else {
          listItem = <li className="incorrect" data-position={index}>{characterGroup}</li>;
        }

        return (listItem);
      });

      characterGroupsErrorNodes = sentenceErrorInfo.positions.map(function(position) {
        var characterGroup = characterGroups[position];
        var characterGroupRomajis = _this.props.handleKanaToRomaji(characterGroup);
        var listItem;
        var romajiNodes;

        romajiNodes = characterGroupRomajis.map(function(romaji) {
          return (<li>{romaji.replace(' ', '{space}')}</li>);
        });

        listItem = <li className="list-group-item">
          <ul className="kana-error">
            <li lang="ja">{characterGroups[position]}</li>
            {romajiNodes}
          </ul>
        </li>

        return listItem;
      });

      cardItem = <div className="card">
        <div className="card-block">
          <ul lang="ja" className="sentence">
            {characterGroupsNodes}
          </ul>
        </div>
        <ul className="list-group list-group-flush errors">
          {characterGroupsErrorNodes}
        </ul>
      </div>

      return cardItem;
    });
    return (
      <div className="error-history">
        <h2 className="mini muted">Error history</h2>
        <div className="clear-error-history">
          <button type="button" className="btn btn-primary btn-sm" onClick={this.props.handleClearErrorHistory}>Clear</button>
        </div>
        {sentencesNodes}
      </div>
    );
  }
});

var wrapper = document.getElementById('content')
ReactDOM.render(
  <AppBox url={wrapper.dataset.url} />,
  wrapper
);