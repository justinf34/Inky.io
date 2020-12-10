import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
//import Modal from "react-bootstrap/Modal";
//import NavBar from "../components/NavBar";
import "../styles/EndOfGamePage.css";
//import AuthContext from "../context/AuthContext";
import Dialog from "react-bootstrap-dialog";
import { Link } from "react-router-dom";
class GameEndingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersInLobby: this.sortWinner([
        {
          playerName: "player1",
          playerProfilePic:
            "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png",
          playerScore: 500,
        },
        {
          playerName: "player2",
          playerProfilePic:
            "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png",
          playerScore: 400,
        },
        {
          playerName: "player3",
          playerProfilePic:
            "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png",
          playerScore: 300,
        },
        {
          playerName: "player4",
          playerProfilePic:
            "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png",
          playerScore: 200,
        },
        {
          playerName: "player5",
          playerProfilePic:
            "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png",
          playerScore: 100,
        },
        {
          playerName: "player6",
          playerProfilePic:
            "https://play.nintendo.com/images/profile-kirby-kirby.7bf2a8f2.aead314d58b63e27.png",
          playerScore: 50,
        },
      ]),
      playerArray: this.props.players,
      host: this.props.host,
    };
    this.sortWinner = this.sortWinner.bind(this);
  }

  sortWinner(arr) {
    let len = arr.length;
    for (let i = len - 1; i >= 0; i--) {
      for (let j = 1; j <= i; j++) {
        if (arr[j - 1].playerScore > arr[j].playerScore) {
          var temp = arr[j - 1];
          arr[j - 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
    arr.reverse();
    let displayarray = [];
    for (let i = 0; i < arr.length; i++) {
      displayarray.push(
        <Card key={i} id={i} className="player" style={{ width: "5rem" }}>
          <Card.Img variant="top" src={arr[i].playerProfilePic} />
          <Card.Body className="playerGameInfo" style={{ padding: "0px" }}>
            <Card.Title className="playerName">{arr[i].playerName}</Card.Title>
            <Card.Text className="playerScore">
              Points: {arr[i].playerScore}
            </Card.Text>
          </Card.Body>
        </Card>
      );
    }
    return displayarray;
  }

  render() {
    return (
      <div className="page">
        <div className="content">
          <div className="podium">
            <div className="playerPodium">
              <p>{this.state.usersInLobby[1]}</p>
              <div className="podium2"></div>
            </div>
            <div className="playerPodium">
              <p>{this.state.usersInLobby[0]}</p>
              <div className="podium1"></div>
            </div>
            <div className="playerPodium">
              <p>{this.state.usersInLobby[2]}</p>
              <div className="podium3"></div>
            </div>
          </div>
          <div className="restPlayers">
            {[...this.state.usersInLobby.slice(3)]}
          </div>
          <div className="buttonSet">
            <Link to="/" className="linkContainer">
              <Button className="playAgain" variant="secondary">
                Play Again
              </Button>
            </Link>
            <Link className="linkContainer">
              <Button className="leave" variant="success">
                Leave
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default GameEndingPage;
