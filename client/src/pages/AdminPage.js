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
        {props.log ? (""):<Button onClick={() => {props.onHide()}}>Yes</Button>}
        {props.log ? (""):<Button onClick={() => {props.onHide()}}>No</Button>}
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
        onHide={() => setModalShow(false)}
        Title = {props.Title}
        Body = {props.Body}
        log = {props.log}
      />
    </>
  );
}

export default class AdminPage extends React.Component {
  //TODO need to get Report data from database
    render() {

    var ex = [{
      "name":"Player1",
      "Date":"11/18/2020",
      "Reason":"Verbal Abuse"
    },
    {
      "name":"Player2",
      "Date":"11/18/2020",
      "Reason":"Verbal Abuse"
    }];

    var ex2 = [];

    for (var myJson of ex){
      ex2.push(<Card>
                <div>
                  <div className = "myContainer">
                    <div className = 'PlayerName'> {"Player: "}{myJson.name}</div>
                    <div className = 'Date'> {"Date: "}{myJson.Date}</div>
                    <div className = 'Reason'> {"Reason: "}{myJson.Reason}</div>
                    
                  </div>
                  <div className='button-group'>
                    <Overlay Title = "Delete Report" Body = "Are you sure that you wanna delete the report?"/>
                    <Overlay Title = "Chat History" Body = "Detail from db" log = {true} />
                    <Overlay Title = "Ban player" Body = "Are you sure that you wanna ban the player?"/>
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

            {ex2}
      </div>

    );
    }  
}