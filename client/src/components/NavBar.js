import React from "react";
import Button from "react-bootstrap/Button";
export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="button-group">
        {this.props.showHome ? (
          <Button variant="outline-danger">Home</Button>
        ) : (
          ""
        )}

        <Button variant="outline-danger" onClick={this.props.logout}>
          Logout
        </Button>
        <Button variant="outline-dark" onClick={this.props.matchHistory}>
          Match History
        </Button>
        <Button variant="outline-dark" onClick={this.props.viewProfile}>
          View Profile
        </Button>
        {this.props.showCreateGame ? (
          <Button variant="info" onClick={this.handleCreateGameClicked}>
            Create Game
          </Button>
        ) : (
          ""
        )}
      </div>
    );
  }
}
