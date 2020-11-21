import React from "react";

export default function ColorBox(props) {
  function onClick(e) {
    e.preventDefault();
    props.changeColor(props.colorVal);
  }
  return (
    <div
      className="color-option"
      onClick={onClick}
      style={{ backgroundColor: props.colorVal }}
    >
      <div className="content">
        <span>{""}</span>
      </div>
    </div>
  );
}
