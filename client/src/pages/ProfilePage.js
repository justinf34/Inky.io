import React from "react";
import Button from "react-bootstrap/Button";
import NavBar from "../components/NavBar";
import "../styles/ProfilePage.css";
import AuthContext from "../context/AuthContext";
class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userUsername: this.props.authCreds.auth.user.name,
      userImageDisplay:
        "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png",
    };
    this.usernameChange = this.usernameChange.bind(this);
    this.imageSelect = this.imageSelect.bind(this);
  }
  usernameChange(event) {
    this.setState({
      userUsername: event.target.value,
    });
  }
  imageSelect(event) {
    console.log(event.target.files[0]);
    this.setState({
      userImageDisplay: URL.createObjectURL(event.target.files[0]),
      userImageFile: event.target.files[0],
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
                  src={this.state.userImageDisplay}
                  alt="pfp"
                ></img>
                <label className="fileinput">
                  <input
                    type="file"
                    id="myFile"
                    name="filename"
                    accept="image/*"
                    onChange={this.imageSelect}
                  />
                  Select File
                </label>
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
export default AuthContext(ProfilePage);
