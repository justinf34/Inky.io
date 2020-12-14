import React, { createRef } from "react";
import "../styles/HomePage.css";
import {
  Accordion,
  Card,
  InputGroup,
  FormControl,
  Overlay,
  Button,
  Popover,
} from "react-bootstrap";
import NavBar from "../components/NavBar";
import { Redirect, withRouter } from "react-router-dom";
import BanPage from "./BanPage";
import AuthContext from "../context/AuthContext";
import { withDeviceDetect } from "../Utils/DeviceDetect";

import { SERVER_URL } from "../Utils/Constants";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameCode: "",
      showRoomNotFound: false,
    };
    this.joinButtonTarget = new createRef();
    this.handleGameCodeChange = this.handleGameCodeChange.bind(this);
    this.handleJoinGameClicked = this.handleJoinGameClicked.bind(this);
    this.handleCreateGameClicked = this.handleCreateGameClicked.bind(this);
  }

  componentDidMount() {}

  handleMatchHistoryClicked() {
    // TODO: redirect to match history page
  }

  handleViewProfileClicked() {
    // TODO: redirect to profile page
  }

  handleCreateGameClicked() {
    const user = this.props.authCreds.auth.user;
    fetch(
      SERVER_URL + `/lobby/create?hostId=${user.id}&hostName=${user.name}`,
      {
        method: "POST",
        // credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // "Access-Control-Allow-Credentials": true,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed create new room");
      })
      .then((responseJson) => {
        // redirect to lobby

        const location = {
          pathname: `/game/${responseJson.code}`,
        };
        this.props.history.push(location);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleJoinGameClicked() {
    const user = this.props.authCreds.auth.user;
    if (this.state.gameCode === "") return;
    fetch(SERVER_URL + `/lobby/join2`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.state.gameCode, userID: user.id }),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error("failed fetching room info");
      })
      .then((res_json) => {
        if (res_json.success) {
          const location = {
            pathname: `/game/${res_json.code}`,
          };
          this.props.history.push(location);
        } else {
          this.setState({
            showRoomNotFound: true,
            gameCode: "",
            gameErrorMessage: res_json.message,
          });
          // hide popover after 5 sec
          setTimeout(() => {
            this.setState({ showRoomNotFound: false });
          }, 5000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleGameCodeChange(e) {
    this.setState({
      gameCode: e.target.value,
    });
  }

  render() {
    const user = this.props.authCreds.auth.user;
    if (user.ban) {
      return <Redirect to={"/BanPage"} />;
    } else {
      return (
        <div className="page">
          <div className="homepage-content">
            <h3>{user.name || "kirby placeholder"}</h3>
            <img
              className="profile-picture"
              src={
                user.profileKey &&
                (user.profileKey > 0 && user.profileKey <= 10)
                  ? `https://pokeres.bastionbot.org/images/pokemon/${user.profileKey}.png`
                  : "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png"
              }
              alt="pfp"
            ></img>

            <NavBar
              showCreateGame={!this.props.mobile}
              createGameClick={this.handleCreateGameClicked}
            ></NavBar>
            <InputGroup style={{ maxWidth: "70%", margin: "10px auto" }}>
              <FormControl
                disabled={this.props.mobile}
                placeholder="Enter lobby code to join a game"
                value={this.state.gameCode}
                onChange={this.handleGameCodeChange}
                aria-label="Lobby Code"
              />
              <InputGroup.Append>
                <Button
                  ref={this.joinButtonTarget}
                  disabled={this.props.mobile}
                  variant="success"
                  onClick={this.handleJoinGameClicked}
                >
                  Join Game
                </Button>
              </InputGroup.Append>
            </InputGroup>

            <Overlay
              target={this.joinButtonTarget}
              show={this.state.showRoomNotFound}
              placement="top"
              onClose={() => this.setState({ showRoomNotFound: false })}
            >
              <Popover>
                <Popover.Content>{this.state.gameErrorMessage}</Popover.Content>
              </Popover>
            </Overlay>

            <Accordion defaultActiveKey="0" className="info">
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
                    then start the game. When it's your turn to draw, choose one
                    of the three words and visualize it before the time runs
                    out. The more people that get the word right, the more
                    points you win! When somebody else is drawing, type your
                    guess into the chat to gain points. Be quick, the earlier
                    you guess a word the more points you get! <br />
                    <u>Tip:</u> hints will appear above the canvas as time
                    passes. <br />
                    <u>Note:</u> if you a player is making you feel
                    uncomfortable at anytime, click their card on the left to
                    report them
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </div>
      );
    }
  }
}

export default AuthContext(withDeviceDetect(HomePage));
