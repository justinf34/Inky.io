import React, { Component } from "react";

import { 
  Card,
  Form,
 } from "react-bootstrap";

import ChatMessage from './ChatMessage'
import socket from '../../Utils/socket'

export default class ChatBox extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    this.messageLog = [
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

    return (
      <Card>
        <Card.Body>
            {this.messageLog.map(msg => (
              <ChatMessage message={msg}/>
            ))}
        </Card.Body>
        <Card.Footer>
          <Form>
            <Form.Control type="input"></Form.Control>
          </Form>
        </Card.Footer>
      </Card>
    )
  }
}