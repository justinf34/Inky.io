import React, { Component } from "react";

import CanvasContainer from "../components/GameComponents/CanvasContainer";
import ChatBox from "../components/GameComponents/ChatBox";

import { withRouter } from "react-router-dom";
import { withAuth } from "../context/auth-context";

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
        <div className="game-content">
          <CanvasContainer
            socket={this.props.socket}
            drawing={this.state.drawer ? this.state.drawer === user.id : false}
            strokes={this.state.strokes}
          />
          <ChatBox socket={this.props.socket} />
        </div>
      </div>
    );
  }
}

export default withAuth(withRouter(GamePage));
