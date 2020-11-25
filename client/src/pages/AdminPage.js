import React from 'react';
import Button from 'react-bootstrap/Button'
import '../styles/AdminPage.css'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import { Link } from "react-router-dom";

/*
 JSX For overlay in the middle of screen
*/

function MyOverlay(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.Title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {props.Body}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {props.onHide()}}>Close</Button>
        {props.log ? (""):<Button onClick={() => {props.onHide(); props.actionforyes(props.documentID)}}>Yes</Button>}
        {props.log ? (""):<Button onClick={() => {props.onHide(); props.actionforno(props.documentID)}}>No</Button>}
      </Modal.Footer>
    </Modal>
  );
}

/*
Overlay
*/
function Overlay(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button variant="outline-dark" onClick={ () =>setModalShow(true)} >{props.Title}</Button>
      <MyOverlay
        show={modalShow}
        option = {props.option}
        onHide = {() => setModalShow(false)}
        Title = {props.Title}
        Body = {props.Body}
        log = {props.log}
        actionforyes = {props.actionforyes}
        actionforno = {props.actionforno}
        documentID = {props.documentID}
      />
    </>
  );
}

export default class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents : [],
      players : [],
      reasons : [],
      dates : [],
      lobbyIDs : [],
    }
    this.deleteReport = this.deleteReport.bind(this);
    this.gettingReport = this.gettingReport.bind(this);
    this.banPlayer = this.banPlayer.bind(this);
  }
  //TODO need to get Report data from database
  
  componentDidMount() {
    this.gettingReport();
  }

  //Fetch reports
  gettingReport(){
    fetch(
      'http://localhost:8888/report/report',
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed to get the report");
      })
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          documents: responseJson.document,
          players: responseJson.player,
          reasons: responseJson.reason,
          dates: responseJson.date,
          lobbyIDs: responseJson.lobbyID,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Delete report
    deleteReport(documentID){
      console.log("delete Report")
      
      fetch(
        `http://localhost:8888/report/delete?documentID=${documentID}`,
        {
          method: "POST",
          // credentials: "include",
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
          if(responseJson.success){
            this.setState({
              documents: responseJson.document,
              players: responseJson.player,
              reasons: responseJson.reason,
              dates: responseJson.date,
              lobbyIDs: responseJson.lobbyID,
            })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    //Ban Player
    banPlayer(documentID){
      console.log("ban player")

      fetch(
        `http://localhost:8888/report/ban?documentID=${documentID}`,
        {
          method: "POST",
          // credentials: "include",
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
          if(responseJson.success){
            this.setState({
              documents: responseJson.document,
              players: responseJson.player,
              reasons: responseJson.reason,
              dates: responseJson.date,
              lobbyIDs: responseJson.lobbyID,
            })
          }
        })
        .catch((error) => {
          console.log(error);
        });;
    }
    
    render() {

    var card = [];
    var i;
    for (i = 0 ; i < this.state.documents.length ; i++){
      const date = new Date(this.state.dates[i]);
      card.push(<Card>
                <div>
                  <div className = "myContainer">
                    <div className = 'PlayerName'> {"Player: "}{this.state.players[i]}</div>
                    <div className = 'Date'> {"Date: "}{date.getFullYear()}/{date.getMonth()+1}/{date.getDate()}</div>
                    <div className = 'Reason'> {"Reason: "}{this.state.reasons[i]}</div>                    
                  </div>
                  <div className='button-group'>
                    <Overlay option = "delete" Title = "Delete Report" Body = "Are you sure that you wanna delete the report?" actionforyes = {this.deleteReport} actionforno = {()=>{}} documentID = {this.state.documents[i]}/>
                    <Overlay option = "log" Title = "Chat History" Body = "Detail from db" log = {true} documentID = {this.state.documents[i]} />
                    <Overlay option = "ban" Title = "Ban player" Body = "Are you sure that you wanna ban the player?" actionforyes = {this.banPlayer} actionforno = {this.deleteReport} documentID = {this.state.documents[i]}/>
                  </div>
                </div>
              </Card>)
    }

    return (
      <div className='content'>
        <h3 className = "Title">
          {"Report"}
          <Link to="/">
            <Button className = "home" variant="info">Home</Button>
          </Link>
        </h3>

            {card}
      </div>

    );
    }  
}