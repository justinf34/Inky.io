import React, { Component } from "react";

import CanvasContainer from "../components/GameComponents/CanvasContainer";
import ChatBox from "../components/GameComponents/ChatBox";
import PlayerSidebar from "../components/GameComponents/PlayerSidebar";

import { withRouter, Link } from "react-router-dom";
import { withAuth } from "../context/auth-context";

import "../styles/GamePage.css";
import { Button } from "react-bootstrap";

class GamePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      strokes: [],
    };
  }

  componentDidMount() {
    this.props.socket.on("game-status", (status) => {
      this.setState({ ...status });
    });

    this.getRoundStatus();

    this.props.socket.on("new-round-status", () => {
      this.getRoundStatus();
    });
  }

  getRoundStatus() {
    const lobbyID = this.props.match.params.lobbyID;
    const user = this.props.authCreds.auth.user;
    this.props.socket.emit("game-status", lobbyID, user.id);
  }

  render() {
    const user = this.props.authCreds.auth.user;
    return (
      <div className="game-page">
        <Link to="/" className="leave-lobby-btn">
          <Button variant="outline-secondary">Leave Lobby</Button>
        </Link>
        <div className="game-contents">
          {/* <div className="game-components"> */}
          <div className="players-container">
            <PlayerSidebar
              className="players-container"
              players={this.props.players}
            ></PlayerSidebar>
          </div>
          <CanvasContainer
            socket={this.props.socket}
            drawer={this.state.drawer}
            drawing={this.state.drawer ? this.state.drawer === user.id : false}
            strokes={this.state.strokes}
          />
          <div className="chat-container">
            <ChatBox socket={this.props.socket} />
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(withRouter(GamePage));
