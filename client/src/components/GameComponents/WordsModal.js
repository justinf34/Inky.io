import React from "react";
import { Button, ButtonGroup, Modal } from "react-bootstrap";
import './WordsModal.css';

// takes in prop isArtist, artistName, words
export default class WordsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  handleClick(e) {
    console.log(this.props.artistName + "chose" + e.value);
  }

  render() {
    return (
      <Modal
        show={this.state.show}
        backdrop='static'
        keyboard={false}
        onHide={() => this.setState({ show: false })}
      >
        <Modal.Header className="words-modal">
          <Modal.Title>
            {this.props.isArtist
              ? "Pick a Word"
              : this.props.artistName + " is picking a word"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="words-modal">
            <Button variant="info">{this.props.words[0]}</Button>
            <Button variant="info">{this.props.words[1]}</Button>
            <Button variant="info">{this.props.words[2]}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
