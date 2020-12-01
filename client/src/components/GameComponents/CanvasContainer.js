import React from "react";
import Canvas from "./Canvas";
import "./Canvas.css";

export default function CanvasContainer(props) {
  return (
    <div className="canvas-container">
      <Canvas
        socket={props.socket}
        strokes={props.strokes}
        drawing={props.drawing}
      />
    </div>
  );
}
