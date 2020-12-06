import React, { useState, useEffect } from "react";

export default function Timer(props) {
  const [time, setTime] = useState(props.timer);

  useEffect(() => {
    props.socket.on("time-update", (new_time) => {
      setTime(new_time);
    });
  }, []);

  return (
    <React.Fragment>
      <img
        className="timer"
        src="https://i.pinimg.com/originals/2a/0c/fe/2a0cfecd615bed18b3cf4688d2b5962c.png"
        alt="pfp"
      ></img>
      <div>{time}</div>
    </React.Fragment>
  );
}
