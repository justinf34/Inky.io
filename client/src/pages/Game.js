import React, { Component } from "react";
import GameLobbyPage from "./GameLobbyPage";
import GamePage from "./GamePage";

import { Redirect, withRouter } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import io from "socket.io-client";
import constants from "../Utils/Constants";

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      host: false,
      socket: io("http://localhost:8888"),
    };

    this.onJoin = this.onJoin.bind(this);
  }

  componentDidMount() {
    this.state.socket.once("connect", (data) => {
      console.log("Connected to the server socket...");
    });

    const lobby_id = this.props.match.params.lobbyID;
    const user = this.props.authCreds.auth.user;

    // Listen to socket response to join request
    this.state.socket.on("join", this.onJoin);

    // Listen to player list updates
    this.state.socket.on("player-list-update", (lobby) => {
      console.log("PLAYER UPDATE" + lobby.players.length);
      this.setState({
        host: lobby.host.id === user.id,
        host_info: lobby.host,
        players: lobby.players,
      });
    });

    // Join socket room
    this.state.socket.emit("join", {
      lobby_id: lobby_id,
      player: {
        id: user.id,
        name: user.name,
      },
    });

    this.state.socket.on("state-change", (new_state) => {
      this.setState({
        state: new_state,
      });
    });
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
  }

  onJoin(res) {
    console.log(res);
    const user = this.props.authCreds.auth.user;
    if (res.success) {
      this.setState({
        host: res.lobby.host.id === user.id,
        host_info: res.lobby.host,
        settings: res.lobby.settings,
        players: res.lobby.players,
        state: res.lobby.state,
      });
    } else {
      this.props.history.push("/");
    }
  }

  pageManager() {
    // TODO: add spinner for connecting loading
    if (this.state.state === constants.IN_LOBBY)
      return (
        <GameLobbyPage
          socket={this.state.socket}
          isHost={this.state.host}
          players={this.state.players}
          settings={this.state.settings}
        />
      );

    if (this.state.state === constants.IN_GAME)
      return <GamePage socket={this.state.socket} />;

    if (this.state.state === constants.GAME_DISCONNECTED)
      return <Redirect to={"/"} />;
  }

  render() {
    return <React.Fragment>{this.pageManager()}</React.Fragment>;
  }
}

export default AuthContext(withRouter(Game));
