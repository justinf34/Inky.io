import React, { Component } from "react";
import GameLobbyPage from "./GameLobbyPage";

import { Redirect, withRouter } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import socket from "../Utils/socket";

class Game extends Component {
  constructor(props) {
    super(props);

    // this.socket = socket();

    this.state = {
      host: false,
    };
  }

  componentDidMount() {
    // get query params for the lobby id
    // find the lobby in the db,
    // subscribe to socket room
  }

  componentWillUnmount() {
    // this.socket.disconnect();
  }

  pageManager() {
    // add spinner for connecting loading
    if (this.state.game_state === "IN_LOBBY") return <GameLobbyPage />;
    if (this.state.game_state === "DISCONNECTED") return <Redirect to={"/"} />;
  }

  render() {
    const { match, location, history } = this.props;
    console.log(match);
    return <React.Fragment>{this.pageManager()}</React.Fragment>;
  }
}

export default AuthContext(withRouter(Game));
