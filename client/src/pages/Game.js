import React, { Component } from "react";
import GameLobbyPage from "./GameLobbyPage";

import { Redirect, withRouter } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import io from "socket.io-client";

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

    this.state.socket.on("join", this.onJoin);
    this.state.socket.on("player-list-update", (lobby) => {
      this.setState({
        host: lobby.host.id === user.id,
        host_info: lobby.host,
        players: lobby.players,
      });
    });

    this.state.socket.emit("join", {
      lobby_id: lobby_id,
      player: {
        id: user.id,
        name: user.name,
      },
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
    // add spinner for connecting loading
    if (this.state.state === "IN_LOBBY")
      return (
        <GameLobbyPage isHost={this.state.host} players={this.state.players} />
      );
    if (this.state.state === "DISCONNECTED") return <Redirect to={"/"} />;
  }

  render() {
    const { match, location, history } = this.props;
    return <React.Fragment>{this.pageManager()}</React.Fragment>;
  }
}

export default AuthContext(withRouter(Game));
