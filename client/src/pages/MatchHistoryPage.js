import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import AuthContext from "../context/AuthContext";
import GameRecord from "../components/GameRecord";
import NavBar from "../components/NavBar";

class MatchHistoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // matchHistory: [{lobbyCode, hostId, games[]}]
      // games: [{date, numRounds, scores[{playerName, score}]}]
      matchHistory: [],
    };
  }

  componentDidMount() {
    const user = this.props.authCreds.auth.user;
    // TODO: get all lobbies from db that user was in
    // is this what were using this function to do idk
  }

  render() {
    const user = this.props.authCreds.auth.user;
    return (
      <div className="page">
        <div className="match-history-content">
          <NavBar
            showCreateGame={!this.props.mobile}
            createGameClick={this.handleCreateGameClicked}
          ></NavBar>

          <div className="match-history-container">
            {this.state.matchHistory.map((match, index) => {
              return (
                <Accordion className="match" key={index}>
                  <Card>
                    <Card.Header>{match.lobbyCode}</Card.Header>
                    <Accordion.Toggle
                      as={Button}
                      variant="Link"
                      eventKey="0"
                    ></Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        {match.games.map((game, index) => {
                          <div class="game-overview" key={index}>
                            <GameRecord
                              userId={user.id}
                              numRounds={game.numRounds}
                              date={game.date}
                              scores={game.scores}
                            ></GameRecord>
                          </div>;
                        })}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default AuthContext(MatchHistoryPage);
