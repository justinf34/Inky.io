import React from 'react';
import "./PlayerSidebar.css";
import { Card, Button, OverlayTrigger, Popover  } from 'react-bootstrap'
import { FaCheck, FaTimes } from "react-icons/fa";
import constants from '../../Utils/Constants'

export default class PlayerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state= {

    }
    this.cardRef = React.createRef();
    this.reportPlayer = this.reportPlayer.bind(this);
  }

  getVariant(playerState) {
    switch(playerState) {
      case constants.CONNECTED:
        return "primary";
      case constants.KICKED:
        return "dark";
      case constants.DISCONNECTED:
        return "secondary";
      default:
        return "warning";
    }
  }

  reportPlayer() {
    // TODO: hook up to back end
    console.log("reporting", this.props.player);
    this.cardRef.current.click();
  }

  getReportOverlay() {
    return(
      this.props.player.state === constants.CONNECTED ? 
        <Popover>
          <div className="report-popover">
            <span>Report? </span>
            <Button variant="outline-danger" onClick={ () => this.cardRef.current.click() }>
              <FaTimes/>
            </Button>
            <Button variant="outline-success" onClick={ () => this.reportPlayer() }>
              <FaCheck/>
            </Button>
          </div>
        </Popover > :
        <div></div>
    )
  }

  render() {
    return(
      <OverlayTrigger
        trigger={["click"]}
        rootClose
        placement="right"
        delay={{ hide: 200 }}
        overlay={this.getReportOverlay(this.props.player)}
      >
        <Card ref={this.cardRef} id="player-card" border="dark" bg={this.getVariant(this.props.player.state)} >
          <Card.Header>{this.props.player.name}</Card.Header>
          <Card.Body>
            <Card.Text>
              <b># {this.props.index + 1}&emsp;</b>{this.props.player.score}
            </Card.Text>
          </Card.Body>
        </Card>
      </OverlayTrigger>
    )
  }
}