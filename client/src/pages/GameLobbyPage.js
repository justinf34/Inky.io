import React from "react";
import "../styles/GameLobbyPage.css";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

//takes in prop isHost: bool
class GameLobbyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numRounds: 3,
      drawingTime: 100,
      customWords: [],
      roomLink: "placeholder",
      numRoundsOptions: [2, 3, 4, 5, 6, 7, 8, 9, 10],
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
      players: [{ username: "abc" }],
      roomLinkValue: "hover to see lobby link",
    };
    this.handleNumRoundsChange = this.handleNumRoundsChange.bind(this);
    this.handleDrawingTimeChange = this.handleDrawingTimeChange.bind(this);
    this.handleCustomWordChange = this.handleCustomWordChange.bind(this);
    this.handleCopyClicked = this.handleCopyClicked.bind(this);
  }

  componentDidMount() {
    // TODO: get game from db or create instance of game in db with user as host if not game not found?
  }

  handleNumRoundsChange(e) {
    this.setState({
      numRounds: e.target.value,
    });
  }

  handleDrawingTimeChange(e) {
    this.setState({
      drawingTime: e.target.value,
    });
  }

  handleCustomWordChange(e) {
    this.setState({
      customWords: e.target.value.split(","),
    });
  }

  handleCopyClicked() {
    // not supported on all broswers
    navigator.clipboard.writeText(this.state.roomLink);
  }

  renderSelectOptions(options) {
    return options.map((value, index) => {
      return <option key={index}>{value}</option>;
    });
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
            <Form>
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
                  placeholder="Leave blank to use default words. Separate words with commas. Min 3 words"
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
                  <Button variant="info" onClick={this.handleCopyClicked}>
                    Copy
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </div>
          <div className="players">
            <h3 style={{ textAlign: "center", paddingBottom: "1em" }}>
              Players
            </h3>
            {this.state.players.map((player, index) => {
              return (
                <div key={index} className="player-container">
                  <img
                    className="player-pfp"
                    src="https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png"
                    alt="pfp"
                  ></img>
                  <div>{player.username}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default GameLobbyPage;
