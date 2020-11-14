import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'

//takes in prop isHost: bool
class GameLobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numRounds: 3,
      drawingTime: 100,
      customWords: [],
      roomLink: "",
      numRoundsOptions: [2,3,4,5,6,7,8,9,10],
      drawingTimeOptions: [30, 45, 60, 75, 90, 100, 115, 130, 145, 160, 175, 190, 200, 215, 230],
    }
  }

  render() {
    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Label>Number of Rounds</Form.Label>
            <Form.Control as="select" 
                          disabled={!this.props.isHost}
                          value={this.state.numRounds}>
              {
                this.state.numRoundsOptions.map((value, index) => {
                  return(<option key={index}>{value}</option>)
                })
              }
            </Form.Control>
          </Form.Row>
          <Form.Group>
            <InputGroup>
              <Form.Label>Drawing Time</Form.Label>
              <Form.Control as="select" 
                            disabled={!this.props.isHost}
                            value={this.state.drawingTime}>
                {
                  this.state.drawingTimeOptions.map((value, index) => {
                    return(<option key={index}>{value}</option>)
                  })
                }
              </Form.Control>
            </InputGroup>
            <InputGroup.Append>
              <InputGroup.Text>seconds</InputGroup.Text>
            </InputGroup.Append>
          </Form.Group>
        </Form>
      </div> 
    )
  }
}

export default GameLobby;