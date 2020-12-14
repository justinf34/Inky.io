import React from "react";
import "../styles/GameLobbyPage.css";
import { Form, InputGroup, Col, Button } from "react-bootstrap";
import constants from "../Utils/Constants";
import Modal from "react-bootstrap/Modal";
import { withRouter, Link, Redirect } from "react-router-dom";

//takes in prop isHost: bool
class GameLobbyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numRounds: this.props.settings.rounds,
      drawingTime: this.props.settings.draw_time,
      customWords: "", //TODO: Need handle this in the backend
      roomLink: this.props.match.params.lobbyID,
      numRoundsOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      drawingTimeOptions: [
        30,
        45,
        60,
        75,
        90,
        100,
        115,
        130,
        145,
        160,
        175,
        190,
        200,
        215,
        230,
      ],
      roomLinkValue: "hover to see lobby link",
      modalShow: false,
    };
    this.handleNumRoundsChange = this.handleNumRoundsChange.bind(this);
    this.handleDrawingTimeChange = this.handleDrawingTimeChange.bind(this);
    this.handleCustomWordChange = this.handleCustomWordChange.bind(this);
    this.handleCopyClicked = this.handleCopyClicked.bind(this);
    this.startGame = this.startGame.bind(this);
    this.kickPlayerClicked = this.kickPlayerClicked.bind(this);
    this.kick = this.kick.bind(this);
  }

  componentDidMount() {
    // Listen to changes in game settings
    this.props.socket.on("setting-change", (setting) => {
      this.setState({
        numRounds: setting.rounds,
        drawingTime: setting.draw_time,
      });
    });
    this.props.socket.on("kick", (playerId) => {
      this.kick();
    });
  }
  kick() {
    this.setState({
      modalShow: true,
    });
  }

  componentWillUnmount() {
    // unsubscribe to setting change subscription
    this.props.socket.off("setting-change");
  }

  handleNumRoundsChange(e) {
    const { match } = this.props;
    this.props.socket.emit("setting-change", match.params.lobbyID, {
      rounds: e.target.value,
      draw_time: this.state.drawingTime,
    });

    this.setState({
      numRounds: e.target.value,
    });
  }

  handleDrawingTimeChange(e) {
    const { match } = this.props;
    this.props.socket.emit("setting-change", match.params.lobbyID, {
      rounds: this.state.numRounds,
      draw_time: e.target.value,
    });

    this.setState({
      drawingTime: e.target.value,
    });
  }

  handleCustomWordChange(e) {
    this.setState({
      customWords: e.target.value,
    });
  }

  handleCopyClicked() {
    // not supported on all broswers
    navigator.clipboard.writeText(this.state.roomLink);
  }

  startGame() {
    const { match } = this.props;
    if (this.state.customWords.length) {
      const customWords = this.state.customWords.split(",");
      this.props.socket.emit("add-words", match.params.lobbyID, customWords);
    }
    this.props.socket.emit(
      "lobby-state-change",
      match.params.lobbyID,
      constants.IN_GAME
    );
  }

  renderSelectOptions(options) {
    return options.map((value, index) => {
      return <option key={index}>{value}</option>;
    });
  }

  countPlayers() {
    let count = 0;
    this.props.players.forEach((player) => {
      if (!player.disconnected) count++;
    });
    return count;
  }
  kickPlayerClicked(event) {
    const playerID = event.target.parentNode.id;
    const lobby_id = this.props.match.params.lobbyID;
    this.props.socket.emit("kickPlayer", lobby_id, playerID);
  }

  render() {
    // let roomLinkValue = 'hover to see lobby link';
    return (
      <div className="game-lobby-page">
        <div className="game-lobby-content">
          <div className="settings">
            <h3 style={{ textAlign: "center", paddingBottom: "1em" }}>
              Settings
            </h3>
            <Form className="settings-form">
              <Form.Group as={Form.Row}>
                <Form.Label column sm={5}>
                  Number of Rounds
                </Form.Label>
                <Col sm={7}>
                  <Form.Control
                    as="select"
                    disabled={!this.props.isHost}
                    value={this.state.numRounds}
                    onChange={this.handleNumRoundsChange}
                  >
                    {this.renderSelectOptions(this.state.numRoundsOptions)}
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Form.Row}>
                <Form.Label column sm={5}>
                  Drawing Time
                </Form.Label>
                <Col sm={7}>
                  <InputGroup>
                    <Form.Control
                      as="select"
                      disabled={!this.props.isHost}
                      value={this.state.drawingTime}
                      onChange={this.handleDrawingTimeChange}
                    >
                      {this.renderSelectOptions(this.state.drawingTimeOptions)}
                    </Form.Control>
                    <InputGroup.Append>
                      <InputGroup.Text>seconds</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Form.Group>
              <Form.Group as={Form.Row}>
                <Form.Label column sm={5}>
                  Customs Words
                </Form.Label>
                {/* TODO: file handling - remove file, add words from file to text area separated with commas */}
                <Form.File style={{ padding: "15px 0px" }}>
                  <Form.File.Input />
                </Form.File>
                <Form.Control
                  as="textarea"
                  disabled={!this.props.isHost}
                  readOnly={!this.props.isHost}
                  placeholder="Leave blank to only use default words. Separate words with commas."
                  value={this.state.customWords}
                  onChange={this.handleCustomWordChange}
                />
              </Form.Group>
              <InputGroup
                onMouseOver={() => {
                  this.setState({ roomLinkValue: this.state.roomLink });
                }}
                onMouseOut={() => {
                  this.setState({ roomLinkValue: "hover to see lobby link" });
                }}
              >
                <Form.Control
                  disabled
                  readOnly
                  value={this.state.roomLinkValue}
                  ref={(el) => {
                    this.roomLinkText = el;
                  }}
                />
                <InputGroup.Append>
                  <Button dvariant="info" onClick={this.handleCopyClicked}>
                    Copy
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
            <div className="button-group">
              <Link to="/" className="leave-lobby-btn">
                <Button variant="outline-secondary">Leave Lobby</Button>
              </Link>
              <Button
                className="start-game-btn"
                variant="success"
                // disabled={this.countPlayers() < 2}
                disabled={!this.props.isHost}
                onClick={this.startGame}
              >
                Start Game
              </Button>
            </div>
          </div>
          <div className="players">
            <h3 style={{ textAlign: "center", paddingBottom: "1em" }}>
              Players
            </h3>
            <div className="player-grid">
              {this.props.players.map((player, index) => {
                if (
                  player.state === constants.DISCONNECTED ||
                  player.state === constants.KICKED
                ) {
                  return "";
                }
                return (
                  <div key={index} className="player-container" id={player.id}>
                    {this.props.isHost ? (
                      player.id !== this.props.hostId ? (
                        <Button
                          variant="danger"
                          onClick={this.kickPlayerClicked}
                          className="kickButton"
                        >
                          X
                        </Button>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}

                    <img
                      className="player-pfp"
                      src={
                        player.profileKey &&
                        (player.profileKey > 0 && player.profileKey <= 10)
                          ? `https://pokeres.bastionbot.org/images/pokemon/${player.profileKey}.png`
                          : "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png"
                      }
                      alt="pfp"
                    ></img>
                    <div>{player.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <Modal show={this.state.modalShow}>
            <Modal.Header>Kicked</Modal.Header>
            <Modal.Body>You have been kicked from this room.</Modal.Body>

            <Modal.Footer>
              <Button onClick={() => this.props.history.push("/")}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withRouter(GameLobbyPage);
