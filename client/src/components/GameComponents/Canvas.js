import React, { Component } from "react";
import p5 from "p5";

import weights from "./weights";
import colors from "./colors";
import ColorBox from "./ColorBox";
import { Button } from "react-bootstrap";
import { FaEraser, FaRegTrashAlt } from "react-icons/fa";

import { withRouter } from "react-router-dom";

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.strokes = this.props.strokes;

    this.state = {
      color: "#000000",
      weight: 1,
    };
  }

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
    this.props.socket.on("draw", this.sketch.onNewDrawing);
  }

  componentWillUnmount() {
    // this.start = true;
  }

  Sketch = (sketch) => {
    sketch.setup = () => {
      sketch.createCanvas(
        this.myRef.current.offsetWidth,
        this.myRef.current.offsetHeight
      );
      // sketch.frameRate(20);
      sketch.background("#ffffff");
    };

    sketch.draw = () => {};

    sketch.reset = () => {
      console.log("Clearing canvas..");

      sketch.clear();
      sketch.background("#ffffff");
      sketch.strokeCap(p5.ROUND);

      const w = sketch.width;
      const h = sketch.height;

      this.strokes.forEach((stroke) => {
        sketch.strokeWeight(stroke.weight);
        sketch.stroke(stroke.color);
        sketch.line(stroke.x1 * w, stroke.y1 * h, stroke.x2 * w, stroke.y2 * h);
      });
    };

    sketch.mouseDragged = () => {
      const w = sketch.width;
      const h = sketch.height;

      if (this.props.drawing && this.props.round_state !== 0) {
        const msg = {
          type: 0,
          x1: sketch.pmouseX / w,
          y1: sketch.pmouseY / h,
          x2: sketch.mouseX / w,
          y2: sketch.mouseY / h,
          color: this.state.color,
          weight: this.state.weight,
        };

        this.strokes.push(msg);

        const { match } = this.props;
        this.props.socket.emit("draw", match.params.lobbyID, msg);

        sketch.strokeWeight(this.state.weight);
        sketch.stroke(this.state.color);
        sketch.line(
          sketch.pmouseX,
          sketch.pmouseY,
          sketch.mouseX,
          sketch.mouseY
        );

        // console.log(`${this.strokes}`);
        // sketch.reset();
      }
    };

    sketch.onNewDrawing = (stroke, strokes) => {
      if (stroke.type === 1) {
        sketch.clear();
        sketch.background("#ffffff");
      } else {
        const w = sketch.width;
        const h = sketch.height;

        sketch.strokeWeight(stroke.weight);
        sketch.stroke(stroke.color);
        sketch.line(stroke.x1 * w, stroke.y1 * h, stroke.x2 * w, stroke.y2 * h);
      }
      this.strokes = strokes;
    };

    sketch.windowResized = () => {
      if (this.myRef.current)
        sketch.resizeCanvas(
          this.myRef.current.offsetWidth,
          this.myRef.current.offsetHeight
        );
      sketch.reset();
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
        <Button
          variant="dark"
          style={{
            padding: weight.value + "px",
            maxWidth: "70px",
            width: "100%",
            borderRadius: "50px",
          }}
          key={i}
          value={weight.value}
          onClick={this.strokeOptionClick}
        ></Button>
      );
    });

    return options;
  }

  colorOptionOnClick = (color) => {
    console.log(`Changing pen color to ${color}`);
    this.setState({ color: color });
  };

  strokeOptionClick = (event) => {
    event.preventDefault();
    console.log(`Changing stroke weight to ${event.target.value}`);
    this.setState({ weight: parseInt(event.target.value) });
  };

  eraser = () => {
    this.setState({ color: "#FFFFFF" });
  };

  clearCanvas = () => {
    const { match } = this.props;
    const msg = { type: 1 };
    // this.props.socket.emit("draw", match.params.lobbyID, msg);
    this.sketch.clear();
    this.sketch.background("#ffffff");
  };

  render() {
    return (
      <React.Fragment>
        <div id="canvas" ref={this.myRef}></div>
        {this.props.drawing ? (
          <div className="canvas-tool-container">
            <div className="color-options-container">
              {this.renderColorOptions()}
            </div>
            <div className="tools">
              <React.Fragment>{this.renderStrokeOptions()}</React.Fragment>
              <Button variant="outline-info" onClick={this.eraser}>
                <FaEraser />
              </Button>
              <Button variant="outline-info" onClick={this.clearCanvas}>
                <FaRegTrashAlt />
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Canvas);
