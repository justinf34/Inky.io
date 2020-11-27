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
        {
          user: {
            name:'alice',
            avatar: ''
          },
          content: 'hi'
        },
        {
          user: {
            name:'alice',
            avatar: ''
          },
          content: 'how\'s it going?'
        },
        {
          user: {
            name:'bob',
            avatar: ''
          },
          content: 'hi pretty good'
        }
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
    this.props.socket.emit("chat", this.props.lobbyID, event.target.value);
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
            <Form.Control type="input" onChange={this.handleChange}></Form.Control>
          </Form>
        </Card.Footer>
      </Card>
    )
  }
}