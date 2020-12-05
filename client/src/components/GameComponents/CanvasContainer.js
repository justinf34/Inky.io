import React from "react";
import Canvas from "./Canvas";
import WordsModal from "./WordsModal";
import "./Canvas.css";

export default function CanvasContainer(props) {
  return (
    <div className="canvas-container">
      <Canvas
        socket={props.socket}
        strokes={props.strokes}
        drawing={props.drawing}
      />
      <WordsModal isArtist={props.drawing} artistName={props.drawer} words={["testing", "words", "modal"]}></WordsModal>
    </div>
  );
}
