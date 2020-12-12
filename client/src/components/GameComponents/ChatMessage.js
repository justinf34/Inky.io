import React, { Component } from "react";

export default class ChatMessage extends Component {
  render() {
    return (
        <p className="message">
          <span className="message-name"><b>{this.props.message.name}</b>:  </span>
          <span className="message-content">{this.props.message.content}</span>
        </p>
    )
  }
}