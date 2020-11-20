import React from "react";

import Button from "react-bootstrap/Button";

import NavBar from "../components/NavBar";
import "../styles/ProfilePage.css";
export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userUsername: "kirby placeholder",
      userImage: "",
    };
    this.usernameChange = this.usernameChange.bind(this);
  }
  usernameChange(event) {
    this.setState({
      userUsername: event.target.value,
    });
  }
  render() {
    return (
      <div className="page">
        <div className="content">
          <NavBar
            className="nav"
            showCreateGame={false}
            showHome={true}
            logout={this.handleLogoutClick}
            matchHistory={this.handleMatchHistoryClicked}
            viewProfile={this.handleViewProfileClicked}
          ></NavBar>
          <div className="profilecontainer">
            <div className="profile">
              <div className="name">
                <p className="nameTitle">Display Name: </p>
                <input
                  className="nameInput"
                  type="text"
                  value={this.state.userUsername}
                  onChange={this.usernameChange}
                ></input>
              </div>
              <div className="picture">
                <p>Display Icon: </p>
                <img
                  className="profile-picture"
                  src="https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png"
                  alt="pfp"
                ></img>
                <Button>Select File</Button>
                <input type="file" id="myFile" name="filename" />
              </div>
              <Button variant="success" className="savebutton">
                Save Changes
              </Button>
            </div>
          </div>
          <p>Check:{this.state.userUsername}</p>
        </div>
      </div>
    );
  }
}
