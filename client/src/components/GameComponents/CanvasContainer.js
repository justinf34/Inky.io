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
      <div
        className="custom-modal"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <WordsModal
          socket={props.socket}
          show={props.round_state === 0}
          isArtist={props.drawing}
          artistName={props.drawer}
          round_state={props.round_state}
          words={props.word_list}
        />
      </div>
    </div>
  );
}
