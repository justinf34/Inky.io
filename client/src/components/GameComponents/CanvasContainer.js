import React from "react";
import Canvas from "./Canvas";
import "./Canvas.css";
import Timer from "./Timer";

export default function CanvasContainer(props) {
  return (
    <React.Fragment>
      <Timer timer = {props.timer}/>
        <div className="canvas-container">
          <Canvas
            socket={props.socket}
            strokes={props.strokes}
            drawing={props.drawing}
          />
        </div>
    </React.Fragment>
  );
}
