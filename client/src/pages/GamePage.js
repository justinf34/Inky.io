import React, { Component } from "react";
import CanvasContainer from "../components/GameComponents/CanvasContainer";
import ChatBox from "../components/GameComponents/ChatBox";
export default class GamePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="game-page">
        <div className="game-content">
          <CanvasContainer socket={this.props.socket} />
          <ChatBox/>
        </div>
      </div>
    );
  }
}
