import React, { Component } from "react";
import CanvasContainer from "../components/GameComponents/CanvasContainer";

export default class GamePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="game-page">
        <div className="game-content">
          <CanvasContainer socket={this.props.socket} />
        </div>
      </div>
    );
  }
}
