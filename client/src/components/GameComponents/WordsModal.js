import React from "react";
import { Button, Card } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import "./WordsModal.css";

// takes in prop isArtist, artistName, words
class WordsModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(word) {
    const { match } = this.props;
    console.log(`${word} to ${match.params.lobbyID} `);
    this.props.socket.emit("turn-start", match.params.lobbyID, word);
  }

  render() {
    return (
      <div
        className="words-modal"
        style={{
          display: this.props.show ? "block" : "none",
        }}
      >
        <Card>
          <Card.Header>
            <Card.Title>
              {this.props.isArtist
                ? "Pick a Word"
                : this.props.artistName + " is picking a word"}
            </Card.Title>
          </Card.Header>
          <Card.Footer>
            {this.props.isArtist ? (
              <>
                <Button
                  className="word-btn"
                  variant="outline-dark"
                  onClick={() => this.handleClick(this.props.words[0])}
                >
                  {this.props.words[0]}
                </Button>
                <Button
                  className="word-btn"
                  variant="outline-dark"
                  onClick={() => this.handleClick(this.props.words[1])}
                >
                  {this.props.words[1]}
                </Button>
                <Button
                  className="word-btn"
                  variant="outline-dark"
                  onClick={() => this.handleClick(this.props.words[2])}
                >
                  {this.props.words[2]}
                </Button>
              </>
            ) : (
              <p>The round will start when a word is chosen!</p>
            )}
          </Card.Footer>
        </Card>
      </div>
    );
  }
}

export default withRouter(WordsModal);
