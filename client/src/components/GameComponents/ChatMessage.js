import React, { Component } from "react";

import {
  Image
} from "react-bootstrap";

export default class ChatMessage extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <React.Fragment>
        {/* <Image src={this.props.user.avatar}/> */}
        <p class="message">
          <span class="message-name">{this.props.message.user.name}:  </span>
          <span class="message-content">{this.props.message.content}</span>
        </p>
      </React.Fragment>
    )
  }
}