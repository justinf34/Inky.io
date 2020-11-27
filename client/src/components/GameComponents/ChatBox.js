import React, { Component } from "react";

import { 
  Card,
  Form,
  ListGroup
 } from "react-bootstrap";

import ChatMessage from './ChatMessage'
import socket from '../../Utils/socket'

export default class ChatBox extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Card>
        <Card.Body>
          <ListGroup>
            
          </ListGroup>
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