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
      activeCharacterGroupSet: {},
      currentSentencePosition: 0,
      isInputIncorrect: false
    };
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({sentences: data});
        this.setActiveSentence();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleInputCheck: function(input) {
    var correctInput = this.state.activeCharacterGroupSet.romaji;
    var correctInputSubstring = correctInput.substring(0, input.length)
    var isInputIncorrect;

    if (input != correctInputSubstring) {
      isInputIncorrect = true;
    } else {
      isInputIncorrect = false;
    }

    this.setState({isInputIncorrect: isInputIncorrect});
  },
  kanaToRomaji: function(kana) {
    // add little tsu + character cases to table
    // add other correct romaji entries (values to be arrays)
    // add katakana equivalent
    var kanaTable = {
      あ: 'a',
      い: 'i',
      う: 'u',
      え: 'e',
      お: 'o',
      ゔぁ: 'va',
      ゔぃ: 'vi',
      ゔ: 'vu',
      ゔぇ: 've',
      ゔぉ: 'vo',
      か: 'ka',
      き: 'ki',
      きゃ: 'kya',
      きぃ: 'kyi',
      きゅ: 'kyu',
      く: 'ku',
      け: 'ke',
      こ: 'ko',
      が: 'ga',
      ぎ: 'gi',
      ぐ: 'gu',
      げ: 'ge',
      ご: 'go',
      ぎゃ: 'gya',
      ぎぃ: 'gyi',
      ぎゅ: 'gyu',
      ぎぇ: 'gye',
      ぎょ: 'gyo',
      さ: 'sa',
      す: 'su',
      せ: 'se',
      そ: 'so',
      ざ: 'za',
      ず: 'zu',
      ぜ: 'ze',
      ぞ: 'zo',
      し: 'shi',
      しゃ: 'sha',
      しゅ: 'shu',
      しょ: 'sho',
      じ: 'ji',
      じゃ: 'ja',
      じゅ: 'ju',
      じょ: 'jo',
      た: 'ta',
      ち: 'chi',
      ちゃ: 'cha',
      ちゅ: 'chu',
      ちょ: 'cho',
      つ: 'tsu',
      て: 'te',
      と: 'to',
      だ: 'da',
      ぢ: 'di',
      づ: 'du',
      で: 'de',
      ど: 'do',
      な: 'na',
      に: 'ni',
      にゃ: 'nya',
      にゅ: 'nyu',
      にょ: 'nyo',
      ぬ: 'nu',
      ね: 'ne',
      の: 'no',
      は: 'ha',
      ひ: 'hi',
      ふ: 'fu',
      へ: 'he',
      ほ: 'ho',
      ひゃ: 'hya',
      ひゅ: 'hyu',
      ひょ: 'hyo',
      ふぁ: 'fa',
      ふぃ: 'fi',
      ふぇ: 'fe',
      ふぉ: 'fo',
      ば: 'ba',
      び: 'bi',
      ぶ: 'bu',
      べ: 'be',
      ぼ: 'bo',
      びゃ: 'bya',
      びゅ: 'byu',
      びょ: 'byo',
      ぱ: 'pa',
      ぴ: 'pi',
      ぷ: 'pu',
      ぺ: 'pe',
      ぽ: 'po',
      ぴゃ: 'pya',
      ぴゅ: 'pyu',
      ぴょ: 'pyo',
      ま: 'ma',
      み: 'mi',
      む: 'mu',
      め: 'me',
      も: 'mo',
      みゃ: 'mya',
      みゅ: 'myu',
      みょ: 'myo',
      や: 'ya',
      ゆ: 'yu',
      よ: 'yo',
      ら: 'ra',
      り: 'ri',
      る: 'ru',
      れ: 're',
      ろ: 'ro',
      りゃ: 'rya',
      りゅ: 'ryu',
      りょ: 'ryo',
      わ: 'wa',
      を: 'wo',
      ん: 'n',
      ゐ: 'wi',
      ゑ: 'we',
      きぇ: 'kye',
      きょ: 'kyo',
      じぃ: 'jyi',
      じぇ: 'jye',
      ちぃ: 'cyi',
      ちぇ: 'che',
      ひぃ: 'hyi',
      ひぇ: 'hye',
      びぃ: 'byi',
      びぇ: 'bye',
      ぴぃ: 'pyi',
      ぴぇ: 'pye',
      みぇ: 'mye',
      みぃ: 'myi',
      りぃ: 'ryi',
      りぇ: 'rye',
      にぃ: 'nyi',
      にぇ: 'nye',
      しぃ: 'syi',
      しぇ: 'she',
      いぇ: 'ye',
      うぁ: 'wha',
      うぉ: 'who',
      うぃ: 'wi',
      うぇ: 'we',
      ゔゃ: 'vya',
      ゔゅ: 'vyu',
      ゔょ: 'vyo',
      すぁ: 'swa',
      すぃ: 'swi',
      すぅ: 'swu',
      すぇ: 'swe',
      すぉ: 'swo',
      くゃ: 'qya',
      くゅ: 'qyu',
      くょ: 'qyo',
      くぁ: 'qwa',
      くぃ: 'qwi',
      くぅ: 'qwu',
      くぇ: 'qwe',
      くぉ: 'qwo',
      ぐぁ: 'gwa',
      ぐぃ: 'gwi',
      ぐぅ: 'gwu',
      ぐぇ: 'gwe',
      ぐぉ: 'gwo',
      つぁ: 'tsa',
      つぃ: 'tsi',
      つぇ: 'tse',
      つぉ: 'tso',
      てゃ: 'tha',
      てぃ: 'thi',
      てゅ: 'thu',
      てぇ: 'the',
      てょ: 'tho',
      とぁ: 'twa',
      とぃ: 'twi',
      とぅ: 'twu',
      とぇ: 'twe',
      とぉ: 'two',
      ぢゃ: 'dya',
      ぢぃ: 'dyi',
      ぢゅ: 'dyu',
      ぢぇ: 'dye',
      ぢょ: 'dyo',
      でゃ: 'dha',
      でぃ: 'dhi',
      でゅ: 'dhu',
      でぇ: 'dhe',
      でょ: 'dho',
      どぁ: 'dwa',
      どぃ: 'dwi',
      どぅ: 'dwu',
      どぇ: 'dwe',
      どぉ: 'dwo',
      ふぅ: 'fwu',
      ふゃ: 'fya',
      ふゅ: 'fyu',
      ふょ: 'fyo'
    }
    return kanaTable[kana]
  },
  selectRandomSentence: function() {
    var sentences = this.state.sentences;
    return sentences[Math.floor(Math.random()*sentences.length)];
  },
  setActiveCharacterGroup: function(position) {
    var activeCharacterGroup = this.state.activeSentenceCharacterGroups[position];
    var activeCharacterGroupRomaji = this.kanaToRomaji(activeCharacterGroup);
    var activeCharacterGroupSet = {
      kana: activeCharacterGroup,
      romaji: activeCharacterGroupRomaji
    }

    this.setState({
      activeCharacterGroupSet: activeCharacterGroupSet,
      setCurrentSentencePosition: position
    });
  },
  setActiveSentence: function() {
    var _this = this;
    var randomSentence = this.selectRandomSentence();
    var randomSentenceKana = randomSentence.kana;
    // var randomSentenceCharacterGroups = randomSentence.kana.split('');
    var randomSentenceCharacterGroups = [];

    while (randomSentenceKana.length > 0) {
      var potentialGroup = randomSentenceKana.substring(0,2);
      var potentialGroupRomaji = _this.kanaToRomaji(potentialGroup);

      if (potentialGroupRomaji) {
        randomSentenceCharacterGroups.push(potentialGroup);
        randomSentenceKana = randomSentenceKana.slice(2);
      } else {
        randomSentenceCharacterGroups.push(randomSentenceKana.substring(0,1));
        randomSentenceKana = randomSentenceKana.slice(1);
      }
    }
    console.log(randomSentenceKana);
    this.setState({
      activeSentence: randomSentence,
      activeSentenceCharacterGroups: randomSentenceCharacterGroups
    });

    this.setActiveCharacterGroup(0);
  },
  render: function() {
    return (
      <div className="app-box">
        <VisualFeedback characterGroups={this.state.activeSentenceCharacterGroups} inputIncorrect={this.state.isInputIncorrect} currentSentencePosition={this.state.currentSentencePosition} />
        <UserInput onInputCheck={this.handleInputCheck} inputIncorrect={this.state.isInputIncorrect} />
        <SentenceInformation sentence={this.state.activeSentence} />
      </div>
    );
  }
});

var VisualFeedback = React.createClass({
  render: function() {
    var inputIncorrect = this.props.inputIncorrect;
    var currentSentencePosition = this.props.currentSentencePosition;
    var characterGroupNodes = this.props.characterGroups.map(function(characterGroup, index) {
      var listItem;

      if (index < currentSentencePosition) {
        listItem = <li className="correct" data-position={index}>{characterGroup}</li>
      } else if (index == currentSentencePosition) {
        if (inputIncorrect) {
          listItem = <li className="incorrect" data-position={index}>{characterGroup}</li>;
        } else {
          listItem = <li data-position={index}>{characterGroup}</li>;
        }
      } else {
        listItem = <li data-position={index}>{characterGroup}</li>;
      }

      return (
        listItem
      );
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
  handleUserInputChange: function(e) {
    this.setState({userInput: e.target.value});
    this.props.onInputCheck(e.target.value);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var input = this.state.userInput.trim();
    // May not be required
  },
  render: function () {
    var userInputClass;
    if (this.props.inputIncorrect) {
      userInputClass = 'user-input incorrect'
    } else {
      userInputClass = 'user-input'
    };
    return (
      <div className={userInputClass}>
        <h2 className="mini invert muted">Type out the sentence in romaji</h2>
        <input
          type="text"
          name="user-input"
          value={this.state.userInput}
          onChange={this.handleUserInputChange}
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          autofocus
        />
      </div>
    );
  }
});


var SentenceInformation = React.createClass({
  render: function() {
    return (
      <div className="additional-sentence-information">
        <h2 className="mini muted">Advance kana sentence &amp; translation</h2>
        <dl>
          <dt className="real-word-sentence">{this.props.sentence.bun}</dt>
          <dd className="english-sentence-translation">{this.props.sentence.eng}</dd>
        </dl>
      </div>
    );
  }
});

var ErrorHistory;

var wrapper = document.getElementById('content')
ReactDOM.render(
  <AppBox url={wrapper.dataset.url} />,
  wrapper
);