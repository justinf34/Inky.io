import React, { Component } from "react";
import GameLobbyPage from "./GameLobbyPage";
import GamePage from "./GamePage";
import GameEndingPage from "./GameEndingPage";

import { Redirect, withRouter } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import DeviceDetect from "../Utils/DeviceDetect";
import io from "socket.io-client";
import constants, { SERVER_URL } from "../Utils/Constants";

function mobileChecker(Component) {
  const { isMobile } = DeviceDetect();

  if (isMobile) {
    return <Redirect to={"/"} />;
  } else {
    console.log("On phone");
    return function GameRoute(props) {
      return <Component {...props} />;
    };
  }
}

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      host: false,
      socket: io.connect(SERVER_URL), // Set up reconnections
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
      this.setState({
        host: lobby.host.id === user.id,
        host_info: lobby.host,
        players: lobby.players,
      });
    });

    // listen for score updates
    this.state.socket.on("score", (res) => {
      this.setState((prevState) => ({
        players: prevState.players.map((obj) =>
          obj.id === res.user_id
            ? Object.assign(obj, { score: res.score })
            : obj
        ),
      }));
    });

    // Join socket room
    this.state.socket.emit("join", {
      lobby_id: lobby_id,
      player: {
        id: user.id,
        name: user.name,
        profileKey: user.profileKey,
      },
    });

    this.state.socket.on("state-change", (new_state) => {
      console.log(`Changing state to ${new_state}`);
      this.setState({
        state: new_state,
      });
      console.log(`Changing game state to ${this.state.state}`);
    });

    this.state.socket.on("disconnect", (reason) => {
      console.log("Disconnected  from server...");

      if (
        reason === "ping timeout" ||
        reason === "transport close" ||
        reason === "transport error"
      ) {
        console.log(`Disconnection reason: ${reason}`);
        this.props.history.push("/");
      }
    });
  }

  componentWillUnmount() {
    this.state.socket.offAny([
      "state-change",
      "join",
      "score",
      "player-list-update",
      "disconnect",
    ]);
    this.state.socket.disconnect();
  }

  onJoin(res) {
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
          hostId={this.state.host_info.id}
        />
      );

    if (this.state.state === constants.IN_GAME)
      return (
        <GamePage players={this.state.players} socket={this.state.socket} />
      );
    if (this.state.state === constants.GAME_ENDED)
      return (
        <GameEndingPage
          players={this.state.players}
          socket={this.state.socket}
          isHost={this.state.host}
        />
      );

    if (this.state.state === constants.GAME_DISCONNECTED)
      return <Redirect to={"/"} />;
  }

  render() {
    return <React.Fragment>{this.pageManager()}</React.Fragment>;
  }
}

export default AuthContext(withRouter(Game));
