import React from "react";
import LoginPage from "./LoginPage";
import "../styles/HomePage.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Toast from "react-bootstrap/Toast";
import NavBar from "../components/NavBar";

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameCode: "",
      showRoomNotFound: false,
      user: {},
      error: null,
      authenticated: false,
    };
    this.handleGameCodeChange = this.handleGameCodeChange.bind(this);
    this.handleJoinGameClicked = this.handleJoinGameClicked.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8888/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then((responseJson) => {
        this.setState({
          authenticated: true,
          user: responseJson.user,
        });
      })
      .catch((error) => {
        this.setState({
          authenticated: false,
          error: "Failed to authenticate user",
        });
      });
  }

  handleLogoutClick() {
    window.open("http://localhost:8888/auth/logout", "_self");
    this.setState({
      authenticated: false,
    });
  }

  handleMatchHistoryClicked() {
    // TODO: redirect to match history page
  }

  handleViewProfileClicked() {
    // TODO: redirect to profile page
  }

  handleCreateGameClicked() {
    // TODO: redirect to game lobby page
  }

  handleJoinGameClicked() {
    if (this.state.gameCode === "") return;
    // TODO: if game exists, redirect them to game else do below
    this.setState({
      showRoomNotFound: true,
    });
  }

  handleGameCodeChange(e) {
    this.setState({
      gameCode: e.target.value,
    });
  }

  render() {
    const { authenticated } = this.state;
    return (
      <div className="page">
        {!authenticated ? (
          <LoginPage />
        ) : (
          <div className="content">
            <h3>{this.props.username || "kirby placeholder"}</h3>
            <img
              className="profile-picture"
              src="https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png"
              alt="pfp"
            ></img>
            <NavBar
              showCreateGame={true}
              showHome={false}
              logout={this.handleLogoutClick}
              matchHistory={this.handleMatchHistoryClicked}
              viewProfile={this.handleViewProfileClicked}
            ></NavBar>

            <InputGroup style={{ maxWidth: "70%", margin: "10px auto" }}>
              <FormControl
                placeholder="Enter lobby code to join a game"
                value={this.state.gameCode}
                onChange={this.handleGameCodeChange}
                aria-label="Lobby Code"
              />
              <InputGroup.Append>
                <Button variant="success" onClick={this.handleJoinGameClicked}>
                  Join Game
                </Button>
              </InputGroup.Append>
            </InputGroup>

            <Toast
              onClose={() => this.setState({ showRoomNotFound: false })}
              show={this.state.showRoomNotFound}
              delay={3000}
              autohide
              style={{ maxHeight: 50 }}
            >
              <Toast.Body>
                Couldn't find the room you're looking for. Sorry!
              </Toast.Body>
            </Toast>

            <Accordion className="info">
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    How to Play
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    Create a game lobby and invite your friends to play or join
                    an existing lobby above. Adjust the settings to your liking
                    and start the game. When its your turn to draw, you will
                    have to choose one of the three words that appear and
                    visualize that word in a set amount of time. The more people
                    that get the word right, the more points you win! When
                    somebody else is drawing you have to type your guess into
                    the chat to gain points, be quick, the earlier you guess a
                    word the more points you get! Tip: hints will appear above
                    the canvas as time passes.
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        )}
      </div>
    );
  }
}
