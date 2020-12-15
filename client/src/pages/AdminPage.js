import React from "react";
import Button from "react-bootstrap/Button";
import "../styles/AdminPage.css";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
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
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.islog
          ? props.body.map((element) => <li key={element}>{element}</li>)
          : props.body}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            props.onHide();
          }}
        >
          Close
        </Button>
        {props.islog ? (
          ""
        ) : (
          <Button
            onClick={() => {
              props.onHide();
              props.actionforyes(props.document);
            }}
          >
            Yes
          </Button>
        )}
        {props.islog ? (
          ""
        ) : (
          <Button
            onClick={() => {
              props.onHide();
              props.actionforno(props.document);
            }}
          >
            No
          </Button>
        )}
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
    <React.Fragment>
      <Button
        variant="outline-dark"
        onClick={() => {
          setModalShow(true);
          props.chatLogFunc(props.document);
        }}
      >
        {props.title}
      </Button>
      <MyOverlay
        show={modalShow}
        option={props.option}
        onHide={() => {
          setModalShow(false);
          props.clearMesFunc();
        }}
        title={props.title}
        body={props.body}
        islog={props.islog}
        actionforyes={props.actionforyes}
        actionforno={props.actionforno}
        document={props.document}
      />
    </React.Fragment>
  );
}

export default class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      documents: [],
      players: [],
      reasons: [],
      dates: [],
      lobbyIDs: [],
    };
    this.deleteReport = this.deleteReport.bind(this);
    this.gettingReport = this.gettingReport.bind(this);
    this.banPlayer = this.banPlayer.bind(this);
    this.getChatLog = this.getChatLog.bind(this);
    this.clearMessages = this.clearMessages.bind(this);
  }
  //TODO need to get Report data from database

  componentDidMount() {
    this.gettingReport();
  }

  //Fetch reports
  gettingReport() {
    fetch("http://localhost:8888/report/report", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed to get the report");
      })
      .then((responseJson) => {
        this.setState({
          documents: responseJson.document,
          players: responseJson.player,
          reasons: responseJson.reason,
          dates: responseJson.date,
          lobbyIDs: responseJson.lobbyID,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Delete report
  deleteReport(documentID) {
    console.log("delete Report");

    fetch(`http://localhost:8888/report/delete?documentID=${documentID}`, {
      method: "POST",
      // credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed create new room");
      })
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success) {
          this.setState({
            documents: responseJson.document,
            players: responseJson.player,
            reasons: responseJson.reason,
            dates: responseJson.date,
            lobbyIDs: responseJson.lobbyID,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Ban Player
  banPlayer(documentID) {
    console.log("ban player");

    fetch(`http://localhost:8888/report/ban?documentID=${documentID}`, {
      method: "POST",
      // credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed create new room");
      })
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success) {
          this.setState({
            documents: responseJson.document,
            players: responseJson.player,
            reasons: responseJson.reason,
            dates: responseJson.date,
            lobbyIDs: responseJson.lobbyID,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getChatLog(documentID) {
    console.log("getting chat log");
    fetch(`http://localhost:8888/report/chatLog?documentID=${documentID}`, {
      method: "GET",
      // credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed create new room");
      })
      .then((responseJson) => {
        if (responseJson.success) {
          this.setState({
            messages: responseJson.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  clearMessages() {
    this.setState({
      messages: [],
    });
  }
  render() {
    var card = [];
    var i;
    for (i = 0; i < this.state.documents.length; i++) {
      const date = new Date(this.state.dates[i]);
      card.push(
        <Card key={i}>
          <div className="report-container">
            <div className="myContainer">
              <div className="PlayerName">
                {" "}
                {"Player: "}
                {this.state.players[i]}
              </div>
              <div className="Date">
                {" "}
                {"Date: "}
                {date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()}
              </div>
              <div className="Reason">
                {" "}
                {"Reason: "}
                {this.state.reasons[i]}
              </div>
            </div>
            <div className="admin-button-group-wrapper">
              <div className="admin-button-group">
                <Overlay
                  option="delete"
                  title="Delete Report"
                  body="Are you sure that you wanna delete the report?"
                  actionforyes={this.deleteReport}
                  chatLogFunc={() => {}}
                  actionforno={() => {}}
                  document={this.state.documents[i]}
                  clearMesFunc={this.clearMessages}
                />
                <Overlay
                  option="log"
                  title="Chat History"
                  body={this.state.messages}
                  islog={true}
                  document={this.state.documents[i]}
                  chatLogFunc={this.getChatLog}
                  clearMesFunc={this.clearMessages}
                />
                <Overlay
                  option="ban"
                  title="Ban player"
                  body="Are you sure that you wanna ban the player?"
                  actionforyes={this.banPlayer}
                  chatLogFunc={() => {}}
                  actionforno={this.deleteReport}
                  document={this.state.documents[i]}
                  clearMesFunc={this.clearMessages}
                />
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <div className="content">
        <div className="wrapper">
          <h3 className="Title">{"Report"}</h3>
          <Link to="/">
            <Button className="home" variant="info">
              Home
            </Button>
          </Link>
        </div>
        {card}
      </div>
    );
  }
}
