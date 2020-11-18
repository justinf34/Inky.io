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
        {this.props.showHome ? (
          <Link to="/home">
            <Button variant="info">Home</Button>
          </Link>
        ) : (
          ""
        )}
        <Link to="/history">
          <Button variant="outline-dark">Match History</Button>
        </Link>
        <Link to="/profile">
          <Button variant="outline-dark">View Profile</Button>
        </Link>
        <Link>
          <Button variant="outline-danger" onClick={this.props.logout}>
            Logout
          </Button>
        </Link>
      </div>
    );
  }
}
