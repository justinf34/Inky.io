import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import NavBar from "../components/NavBar";
import "../styles/ProfilePage.css";
import AuthContext from "../context/AuthContext";
import Dialog from "react-bootstrap-dialog";
import { SERVER_URL } from "../Utils/Constants";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userUsername: this.props.authCreds.auth.user.name,
      userImageDisplay: this.props.authCreds.auth.user.profileKey
        ? this.imageWebLink(this.props.authCreds.auth.user.profileKey)
        : "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png",
      modalShow: false,
      userImageDisplayIndex: this.props.authCreds.auth.user.profileKey,
    };
    this.usernameChange = this.usernameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProfilePicture = this.handleProfilePicture.bind(this);
    this.setModalShow = this.setModalShow.bind(this);
    this.handleProfilePick = this.handleProfilePick.bind(this);
    this.imageWebLink = this.imageWebLink.bind(this);
  }
  usernameChange(event) {
    this.setState({
      userUsername: event.target.value,
    });
  }

  handleProfilePicture() {
    const pokemons_number = 10;
    const pokemonImgList = [];

    for (let i = 1; i <= pokemons_number; i++) {
      pokemonImgList.push(
        <img
          key={i}
          id={i}
          className="pokemonImg"
          src={this.imageWebLink(i)}
          onClick={this.handleProfilePick}
        ></img>
      );
    }
    return pokemonImgList;
  }
  handleProfilePick(event) {
    this.setState({
      userImageDisplayIndex: event.target.id,
      userImageDisplay: this.imageWebLink(event.target.id),
      modalShow: false,
    });
  }
  imageWebLink(id) {
    if (id && id > 0 && id <= 10) {
      return `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
    }
    else {
      return "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png"
    }

  }
  handleSubmit() {
    fetch(
      SERVER_URL +
        `/profile/change/name?userID=${this.props.authCreds.auth.user.id}&newName=${this.state.userUsername}&userPicture=${this.state.userImageDisplayIndex}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // "Access-Control-Allow-Credentials": true,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed create new room");
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.props.authCreds.getUserInfo();
        this.dialog.showAlert("Your update was successful!");
        // redirect to lobby
      })
      .catch((error) => {
        console.log(error);
        this.dialog.showAlert("Something went wrong please try again.");
      });
  }
  setModalShow(see) {
    this.setState({
      modalShow: see,
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
          ></NavBar>
          <div className="profilecontainer">
            <div className="profile">
              <div className="picture">
                <img
                  className="profile-picture"
                  src={this.state.userImageDisplay}
                  alt="pfp"
                ></img>
                <Button
                  variant="primary"
                  className="pickIcon"
                  onClick={() => this.setModalShow(true)}
                >
                  Change Profile Picture
                </Button>
              </div>
              <div className="name">
                <p className="nameTitle">Display Name: </p>
                <input
                  className="nameInput"
                  type="text"
                  value={this.state.userUsername}
                  onChange={this.usernameChange}
                ></input>
              </div>

              <Button
                variant="success"
                className="savebutton"
                onClick={this.handleSubmit}
              >
                Save Changes
              </Button>
              <Dialog
                ref={(component) => {
                  this.dialog = component;
                }}
              />
            </div>
          </div>

          <Modal
            show={this.state.modalShow}
            onHide={() => this.setModalShow(false)}
          >
            <Modal.Header>Icons</Modal.Header>
            <Modal.Body>
              <div id="profilePictureContainer" className="modalBody">
                {this.handleProfilePicture()}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={() => this.setModalShow(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
export default AuthContext(ProfilePage);
