import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { Card, Form } from "react-bootstrap";

import ChatMessage from "./ChatMessage";
class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMessage: "",
      messageLog: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ currentMessage: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { match } = this.props;
    this.props.socket.emit(
      "chat",
      match.params.lobbyID,
      this.state.currentMessage
    );
    this.setState({ currentMessage: "" });
  }

  componentDidMount() {
    this.props.socket.on("chat", (name, msg) => {
      console.log(`received "${name}: ${msg}"`);
      this.setState({
        messageLog: [...this.state.messageLog, { name: name, content: msg }],
      });
    });
  }

  render() {
    return (
      <Card style={{ height: "100%" }}>
        <Card.Body>
          {this.state.messageLog.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
        </Card.Body>
        <Card.Footer>
          <Form onSubmit={this.handleSubmit}>
            <Form.Control
              type="input"
              onChange={this.handleChange}
              value={this.state.currentMessage}
              placeholder="type your guess here"
            ></Form.Control>
          </Form>
        </Card.Footer>
      </Card>
    );
  }
}

export default withRouter(ChatBox);
