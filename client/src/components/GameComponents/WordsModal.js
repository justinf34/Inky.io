import React from "react";
import { Button, Card } from "react-bootstrap";
import "./WordsModal.css";

// takes in prop isArtist, artistName, words
export default class WordsModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(word) {
    console.log(this.props.artistName + " chose " + word);
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
