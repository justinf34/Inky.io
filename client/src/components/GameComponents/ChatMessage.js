import React, { Component } from "react";

export default class ChatMessage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <p className="message">
          <span className="message-name">{this.props.message.name}:  </span>
          <span className="message-content">{this.props.message.content}</span>
        </p>
      </React.Fragment>
    )
  }
}