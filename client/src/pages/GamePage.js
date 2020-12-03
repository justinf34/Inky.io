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
      drawing_Time:0,
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

      if(this.interval === null){
        console.log("new round statssssssssss");
        this.interval = setInterval(() => {
          if(this.state.timer > 0 ){
            this.setState({
              timer: this.state.timer-1,
            });
          }else{
            clearInterval(this.interval)
            clearInterval(this.syncInterval)
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
      console.log("Server time now",data,"off set:", this.state.timer - data);
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
        <div className="game-content">
          <CanvasContainer
            timer={this.state.timer}
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
