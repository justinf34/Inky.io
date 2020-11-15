import React, { Component } from "react";
import p5 from "p5";
import weights from "./weights";
import colors from "./colors";
import ColorBox from "./ColorBox";
import { Button } from "react-bootstrap";

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();

    this.state = {
      color: "#000000",
      weight: 1,
    };

    this.colorOptionOnClick = this.colorOptionOnClick.bind(this);
    this.eraser = this.eraser.bind(this);
    this.strokeOptionClick = this.strokeOptionClick.bind(this);
  }

  Sketch = (sketch) => {
    sketch.setup = () => {
      sketch.createCanvas(
        this.myRef.current.offsetWidth,
        this.myRef.current.offsetHeight
      );
      sketch.background("#ffffff");
    };

    sketch.draw = () => {
      sketch.strokeWeight(this.state.weight);
      sketch.stroke(this.state.color);
      if (sketch.mouseIsPressed) {
        sketch.line(
          sketch.pmouseX,
          sketch.pmouseY,
          sketch.mouseX,
          sketch.mouseY
        );
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
    this.setState({ weight: event.target.value });
  }

  eraser() {
    this.setState({ color: "#FFFFFF" });
  }

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
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
          <Button onClick={() => this.sketch.background("#ffffff")}>
            clear
          </Button>
          <React.Fragment>{this.renderStrokeOptions()}</React.Fragment>
        </div>
      </React.Fragment>
    );
  }
}
