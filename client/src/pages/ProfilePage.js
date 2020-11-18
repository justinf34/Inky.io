import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Toast from "react-bootstrap/Toast";
import NavBar from "../components/NavBar";
import "../styles/HomePage.css";
export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="page">
        <div className="content">
          <NavBar
            showCreateGame={false}
            showHome={true}
            logout={this.handleLogoutClick}
            matchHistory={this.handleMatchHistoryClicked}
            viewProfile={this.handleViewProfileClicked}
          ></NavBar>
          <h3>{this.props.username || "kirby placeholder"}</h3>
          <img
            className="profile-picture"
            src="https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png"
            alt="pfp"
          ></img>
        </div>
      </div>
    );
  }
}
