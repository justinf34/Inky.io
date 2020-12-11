import React from "react"
import { Table } from "react-bootstrap";


// props: userId, numRounds, date, scores[{playerName, playerId, score}]
// scores should be ordered from highest to lowest already
export default function GameRecord(props) {
  
  return (
    <div class="game-record">
      <h2>{getUserPlacementString(props.userId, props.scores)}</h2>
      <p>Score: {getUserPlacementString}</p><br/>
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

/**
 * 
 * @param {string} userId 
 * @param {any[]} scores 
 */
function getUserPlacementString(userId, scores) {
  placement = scores.findIndex((obj) => obj.id === userId) + 1;
  return "#" + placement
}

function getUserPlacementString(userId, scores) {
  return scores.find((obj) => obj.id === userId).score;
}

