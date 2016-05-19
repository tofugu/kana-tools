var wrapper = document.getElementById('content')

var AppBox = React.createClass({
  getInitialState: function() {
    return {
      sentences: [],
      activeSentence: {
        "id": null,
        "bun": '',
        "kana": '',
        "eng": ''
      }
    };
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({sentences: data});
        this.setState({activeSentence: this.selectRandomSentence()})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  selectRandomSentence: function() {
    var sentences = this.state.sentences;
    return sentences[Math.floor(Math.random()*sentences.length)];
  },
  render: function() {
    return (
      <div className="app-box">
        <VisualFeedback sentence={this.state.activeSentence} />
        <SentenceInformation sentence={this.state.activeSentence} />
      </div>
    );
  }
});

var VisualFeedback = React.createClass({
  render: function() {
    var characterGroupNodes = this.props.sentence.kana.split('').map(function(characterGroup) {
      return (
        <li>{characterGroup}</li>
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

var UserInput;

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

ReactDOM.render(
  <AppBox url={wrapper.dataset.url} />,
  wrapper
);