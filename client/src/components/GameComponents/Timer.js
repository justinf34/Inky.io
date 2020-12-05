import React from "react";


export default function Timer(props) {
  return (
    <React.Fragment>
      <img className="timer" src='https://i.pinimg.com/originals/2a/0c/fe/2a0cfecd615bed18b3cf4688d2b5962c.png' alt="pfp" ></img>
      <div>{props.timer}</div>
    </React.Fragment>
    );
}
