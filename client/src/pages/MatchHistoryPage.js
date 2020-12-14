import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import AuthContext from "../context/AuthContext";
import NavBar from "../components/NavBar";
import "../styles/MatchHistoryPage.css";
import { SERVER_URL } from "../Utils/Constants";

class MatchHistoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      gameHistory: [],
    };
    this.getLobbies = this.getLobbies.bind(this);
    this.getUserPlacementString = this.getUserPlacementString.bind(this);
    this.getUserScore = this.getUserScore.bind(this);
  }

  componentDidMount() {
    this.getLobbies();
  }

  getLobbies() {
    fetch(
      `${SERVER_URL}/profile/matches?userID=${this.props.authCreds.auth.user.id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed get match history");
      })
      .then((responseJson) => {
        this.setState({
          gameHistory: responseJson.gameHistory,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          errorMessage: "Something went wrong getting match history.",
        });
      });
  }

  getUserPlacementString(match, username) {
    let placement = match.scores.findIndex((obj) => obj.name === username) + 1;
    return "#" + placement;
  }

  getUserScore(match, username) {
    return match.scores.find((obj) => obj.name === username).score;
  }

  render() {
    const user = this.props.authCreds.auth.user;

    return (
      <div className="page">
        <div className="match-history-content">
          <NavBar showCreateGame={false} showHome={true}></NavBar>
          {this.state.errorMessage !== "" ? (
            <h2>{this.state.errorMessage}</h2>
          ) : (
            <div className="match-history-container">
              {this.state.gameHistory && this.state.gameHistory !== [] ? (
                this.state.gameHistory.map((match, index) => {
                  return (
                    <Accordion key={index}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle
                            as={Button}
                            variant="Link"
                            eventKey="0"
                          >
                            {new Date(
                              match.date._seconds * 1000
                            ).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <div className="game-overview" key={index}>
                              <div className="game-record">
                                <h2>
                                  {this.getUserPlacementString(
                                    match,
                                    user.name
                                  )}
                                </h2>
                                <p>
                                  Your Score:{" "}
                                  {this.getUserScore(match, user.name)}
                                </p>
                                <p>Rounds: {match.rounds}</p>
                                <Table responsive>
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>Player</th>
                                      <th>Score</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {match.scores
                                      .sort(function (a, b) {
                                        return b.score - a.score;
                                      })
                                      .map((score, index) => {
                                        return (
                                          <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{score.name}</td>
                                            <td>{score.score}</td>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  );
                })
              ) : (
                <h3>
                  No matches found, play a game and when you finish the game
                  history will be here!
                </h3>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AuthContext(MatchHistoryPage);
