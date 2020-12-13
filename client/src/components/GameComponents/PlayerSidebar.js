import React from "react";
import "./PlayerSidebar.css";
import PlayerContainer from "./PlayerContainer";

export default class PlayerSidebar extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="player-sidebar">
        {this.props.players
          .sort(function (a, b) {
            return b.score - a.score;
          })
          .map((player, index) => {
            return (
              <PlayerContainer
                key={index}
                player={player}
                index={index}
                lobby={this.props.lobby}
                socket={this.props.socket}
              ></PlayerContainer>
            );
          })}
      </div>
    );
  }
}
