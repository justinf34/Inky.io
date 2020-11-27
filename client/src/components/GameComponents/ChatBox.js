import React, { Component } from "react";

import { 
  Card,
  Form,
 } from "react-bootstrap";

import ChatMessage from './ChatMessage'
export default class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMessage: '',
      messageLog : [
        { name: 'bob', content: 'hi' },
        { name: 'charlie', content: 'foo' },
        { name: 'alice', content: 'bar' },
      ]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({currentMessage: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.socket.emit("chat", this.props.lobbyID, this.state.currentMessage);
    this.setState({currentMessage: ''})
  }

  componentDidMount() {
    this.props.socket.on("chat", (name, msg) => {
      this.setState({
        messageLog: [...this.state.messageLog, {'name': name, 'content': msg}]
      })
    });
  }

  render() {

    return (
      <Card>
        <Card.Body>
            {this.state.messageLog.map(msg => (
              <ChatMessage message={msg}/>
            ))}
        </Card.Body>
        <Card.Footer>
          <Form onSubmit={this.handleSubmit}>
            <Form.Control type="input" onChange={this.handleChange} value={this.state.currentMessage}></Form.Control>
          </Form>
        </Card.Footer>
      </Card>
    )
  }
}