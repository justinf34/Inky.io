import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { 
  Card,
  Form,
 } from "react-bootstrap";

import ChatMessage from './ChatMessage'
class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMessage: '',
      messageLog : []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({currentMessage: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    const { match } = this.props;
    this.props.socket.emit("chat", match.params.lobbyID, this.state.currentMessage);
    this.setState({currentMessage: ''})
  }

  componentDidMount() {
    this.props.socket.on("chat", (name, msg) => {
      console.log(`received "${name}: ${msg}"`)
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

export default withRouter(ChatBox)