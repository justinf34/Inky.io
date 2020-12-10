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
    this.start = true;

    this.state = {
      color: "#000000",
      weight: 1,
    };

    this.colorOptionOnClick = this.colorOptionOnClick.bind(this);
    this.strokeOptionClick = this.strokeOptionClick.bind(this);
    this.eraser = this.eraser.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
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
      sketch.background("#ffffff");
      sketch.frameRate(20);
    };

    sketch.draw = () => {
      if (this.start) {
        // console.log("Drawin old stuff");
        // console.log(this.props.strokes);
        this.props.strokes.forEach((stroke) => {
          sketch.strokeWeight(stroke.weight);
          sketch.stroke(stroke.color);
          sketch.line(stroke.x1, stroke.y1, stroke.x2, stroke.y2);
        });
        this.start = false;
      }
    };

    sketch.mouseDragged = () => {
      if (this.props.drawing && this.props.round_state !== 0) {
        const msg = {
          type: 0,
          x1: sketch.pmouseX,
          y1: sketch.pmouseY,
          x2: sketch.mouseX,
          y2: sketch.mouseY,
          color: this.state.color,
          weight: this.state.weight,
        };

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
      }
    };

    sketch.onNewDrawing = (data, strokes) => {
      if (data.type === 1) {
        sketch.background("#ffffff");
      } else {
        sketch.strokeWeight(data.weight);
        sketch.stroke(data.color);
        sketch.line(data.x1, data.y1, data.x2, data.y2);
      }
    };

    sketch.windowResized = () => {
      if (this.myRef && this.myRef.current)
        sketch.resizeCanvas(
          this.myRef.current.offsetWidth,
          this.myRef.current.offsetHeight
        );
      sketch.background("#ffffff");
      this.start = true;
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
    const { match } = this.props;
    const msg = { type: 1 };
    this.props.socket.emit("draw", match.params.lobbyID, msg);
    this.sketch.background("#ffffff");
  }

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
