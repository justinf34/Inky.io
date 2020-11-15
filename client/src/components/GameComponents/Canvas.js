import React, { Component } from "react";
import p5 from "p5";

import weights from "./weights";
import colors from "./colors";
import ColorBox from "./ColorBox";
import { Button } from "react-bootstrap";

import socket from "../../Utils/socket";

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.socket = socket();

    this.state = {
      color: "#000000",
      weight: 1,
    };

    this.colorOptionOnClick = this.colorOptionOnClick.bind(this);
    this.strokeOptionClick = this.strokeOptionClick.bind(this);
    this.eraser = this.eraser.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
  }

  Sketch = (sketch) => {
    sketch.setup = () => {
      sketch.createCanvas(
        this.myRef.current.offsetWidth,
        this.myRef.current.offsetHeight
      );
      sketch.background("#ffffff");
    };

    sketch.mouseDragged = () => {
      const msg = {
        type: 0,
        x1: sketch.pmouseX,
        y1: sketch.pmouseY,
        x2: sketch.mouseX,
        y2: sketch.mouseY,
        color: this.state.color,
        weight: this.state.weight,
      };
      this.socket.draw(msg);

      sketch.strokeWeight(this.state.weight);
      sketch.stroke(this.state.color);
      sketch.line(sketch.pmouseX, sketch.pmouseY, sketch.mouseX, sketch.mouseY);
    };

    sketch.draw = () => {};

    sketch.onNewDrawing = (data) => {
      if (data.type == 1) {
        sketch.background("#ffffff");
      } else {
        sketch.strokeWeight(data.weight);
        sketch.stroke(data.color);
        sketch.line(data.x1, data.y1, data.x2, data.y2);
      }
    };

    this.sketch = sketch;
  };

  renderColorOptions() {
    const options = [];
    colors.forEach((col, i) => {
      options.push(
        <ColorBox
          key={i}
          colorVal={col.value}
          changeColor={this.colorOptionOnClick}
        />
      );
    });

    return options;
  }

  renderStrokeOptions() {
    const options = [];
    weights.forEach((weight, i) => {
      options.push(
        <Button key={i} value={weight.value} onClick={this.strokeOptionClick}>
          {weight.name}
        </Button>
      );
    });

    return options;
  }

  colorOptionOnClick(color) {
    console.log(`Changing pen color to ${color}`);
    this.setState({ color: color });
  }

  strokeOptionClick(event) {
    event.preventDefault();
    console.log(`Changing stroke weight to ${event.target.value}`);
    this.setState({ weight: parseInt(event.target.value) });
  }

  eraser() {
    this.setState({ color: "#FFFFFF" });
  }

  clearCanvas() {
    const msg = { type: 1 };
    this.socket.draw(msg);
    this.sketch.background("#ffffff");
  }

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
    this.socket.registerDraw(this.sketch.onNewDrawing);
  }

  render() {
    return (
      <React.Fragment>
        <div id="canvas" ref={this.myRef}></div>
        <div className="canvas-tool-container">
          <div className="color-options-container">
            {this.renderColorOptions()}
          </div>
          <Button onClick={this.eraser}>eraser</Button>
          <Button onClick={this.clearCanvas}>clear</Button>
          <React.Fragment>{this.renderStrokeOptions()}</React.Fragment>
        </div>
      </React.Fragment>
    );
  }
}
