import React from "react";
import "./PlayerSidebar.css";
import { Card, Button, Overlay, Popover, Modal, Form } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import constants from "../../Utils/Constants";

export default class PlayerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showReportModal: false,
      showReportPopover: false,
      cheating: false,
      verbalAbuse: false,
      inappropriateName: false,
    };
    this.cardRef = React.createRef();
    this.reportPlayer = this.reportPlayer.bind(this);
    this.initiateReportPlayer = this.initiateReportPlayer.bind(this);
    this.renderReportModal = this.renderReportModal.bind(this);
    this.renderReportOverlay = this.renderReportOverlay.bind(this);
  }

  getVariant(playerState) {
    switch (playerState) {
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

  initiateReportPlayer() {
    console.log("reporting", this.props.player);
    this.setState({
      showReportPopover: false,
      showReportModal: true,
    });
  }

  reportPlayer() {
    console.log("reported " + this.props.player, this.state);
    // TODO
    this.setState({
      cheating: false,
      verbalAbuse: false,
      inappropriateName: false,
      showReportModal: false,
    });
  }

  renderReportModal() {
    return (
      <Modal
        show={this.state.showReportModal}
        onHide={() => this.setState({ showReportModal: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Why are you reporting {this.props.player.name}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Check all that apply</p>
          <Form.Check
            label="Cheating"
            type="checkbox"
            value={this.state.cheating}
            onChange={() => this.setState({ cheating: !this.state.cheating })}
          />
          <Form.Check
            label="Verbal Abuse"
            type="checkbox"
            value={this.state.verbalAbuse}
            onChange={() => this.setState({ verbalAbuse: !this.state.verbalAbuse })}
          />
          <Form.Check
            label="Inappropriate Name"
            type="checkbox"
            value={this.state.inappropriateName}
            onChange={() => this.setState({ inappropriateName: !this.state.inappropriateName })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            onClick={() => this.setState({ showReportModal: false })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={() => this.reportPlayer()}>
            Report
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderReportOverlay() {
    return this.props.player.state === constants.CONNECTED ? (
      <Overlay
        target={this.cardRef}
        show={this.state.showReportPopover}
        placement="right"
      >
        <Popover>
          <div className="report-popover">
            <span>Report? </span>
            <Button
              variant="outline-danger"
              onClick={() => this.setState({ showReportPopover: false })}
            >
              <FaTimes />
            </Button>
            <Button
              variant="outline-success"
              onClick={() => this.initiateReportPlayer()}
            >
              <FaCheck />
            </Button>
          </div>
        </Popover>
      </Overlay>
    ) : (
      <></>
    );
  }

  render() {
    return (
      <div>
        <a
          style={{ cursor: "pointer" }}
          ref={this.cardRef}
          onClick={() => this.setState({ showReportPopover: true })}
        >
          <Card
            id="player-card"
            border="dark"
            bg={this.getVariant(this.props.player.state)}
          >
            <Card.Header>{this.props.player.name}</Card.Header>
            <Card.Body>
              <Card.Text>
                <b># {this.props.index + 1}&emsp;</b>
                {this.props.player.score}
              </Card.Text>
            </Card.Body>
          </Card>
        </a>
        {this.state.showReportPopover ? this.renderReportOverlay() : <></>}
        {this.state.showReportModal ? this.renderReportModal() : <></>}
      </div>
    );
  }
}
