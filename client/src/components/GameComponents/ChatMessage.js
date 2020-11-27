import React, { Component } from "react";

import {
  Image
} from "react-bootstrap";

export default class ChatMessage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <Image src={props.user.avatar}/>
        <p>{props.msg}</p>
      </React.Fragment>
    )
  }
}