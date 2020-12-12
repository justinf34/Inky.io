import React from "react"
import { Table } from "react-bootstrap";


// props: userId, numRounds, date, scores[{playerName, playerId, score}]
// scores should be ordered from highest to lowest already
export default function GameRecord(props) {
  const getUserPlacementString = () => {
    let placement = props.scores.findIndex((obj) => obj.id === props.userId) + 1;
    return "#" + placement
  };

  const getUserScore = () => {
    return props.scores.find((obj) => obj.id === props.userId).score;
  }

  return (
    <div class="game-record">
      <h2>{getUserPlacementString}</h2>
      <p>Score: {getUserScore}</p><br/>
      <p>Match date: {props.date}</p><br/>
      <p>Rounds: {props.numRounds}</p><br/>
      <Table responsive>
        <thead>
          <tr>
            <th></th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
        {
          props.scores.map((score, index) => {
            <tr key={index}>
              <td>{index+1}</td>
              <td>{score.playerName}</td>
              <td>{score.score}</td>
            </tr>
          })
        }
        </tbody>
      </Table>
    </div>
  );
}

