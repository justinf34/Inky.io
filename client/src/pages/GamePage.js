import React, { Component } from "react";

import CanvasContainer from "../components/GameComponents/CanvasContainer";
import ChatBox from "../components/GameComponents/ChatBox";
import PlayerSidebar from "../components/GameComponents/PlayerSidebar";

import { withRouter, Link } from "react-router-dom";
import { withAuth } from "../context/auth-context";

import "../styles/GamePage.css";
import { Button } from "react-bootstrap";
import Timer from "../components/GameComponents/Timer";

class GamePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      strokes: [],
      drawing_Time: 0,
    };
    this.getTime = this.getTime.bind(this);
    this.interval = null;
    this.syncInterval = null;
  }

  componentDidMount() {
    this.props.socket.on("game-status", (status) => {
      this.setState({ ...status });
    });

    this.getRoundStatus();

    this.props.socket.on("new-round-status", () => {
      if (this.interval === null) {
        console.log("new round statssssssssss");
        this.interval = setInterval(() => {
          if (this.state.timer > 0) {
            this.setState({
              timer: this.state.timer - 1,
            });
          } else {
            clearInterval(this.interval);
            clearInterval(this.syncInterval);
            this.interval = null;
            this.syncInterval = null;
          }
        }, 1000);

        this.syncInterval = setInterval(() => {
          this.getTime();
        }, 5000);

        this.getRoundStatus();
      }
    });

    this.props.socket.on("timesync", (data) => {
      console.log("Server time now", data, "off set:", this.state.timer - data);
      this.setState({
        timer: data,
      });
    });
  }

  getTime() {
    this.props.socket.emit("timesync", this.props.match.params.lobbyID);
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
          <div className="hints">{/* TODO */}</div>
          <div className="timer">
            <Timer timer={this.state.timer} />
          </div>
          <div className="players-container">
            <PlayerSidebar
              className="players-container"
              players={this.props.players}
              lobby={this.props.match.params.lobbyID}
              socket={this.props.socket}
            ></PlayerSidebar>
          </div>
          <CanvasContainer
            socket={this.props.socket}
            drawer={this.state.drawer}
            round_state={this.state.round_state}
            word_list={this.state.word_list}
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
