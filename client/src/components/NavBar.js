import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="button-group">
        {this.props.showHome ? <Button variant="info">Home</Button> : ""}

        <Button variant="outline-dark" onClick={this.props.history}>
          Match History
        </Button>

        <Button variant="outline-dark" onClick={this.props.profile}>
          View Profile
        </Button>

        <Button variant="outline-danger" onClick={this.props.logout}>
          Logout
        </Button>
        {this.props.showCreateGame ? (
          <Button variant="info" onClick={this.props.create}>
            Create Game
          </Button>
        ) : (
          ""
        )}
      </div>
    );
  }
}
