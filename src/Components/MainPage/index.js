import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  NavbarBrand
} from "reactstrap";

const photos = [{ src: "images/pohja.png" }];

const initialState = {
  toptext: "",
  fontsize: 120,
  fontsize2: 50,
  bottomtext: "",
  isTopDragging: false,
  isBottomDragging: false,
  topY: "40%",
  topX: "50%",
  bottomX: "50%",
  bottomY: "85%",
  ovhY: "95%",
  ovhX: "50%"
};

class MainPage extends React.Component {
  constructor() {
    super();
    this.state = {
      currentImage: 0,
      modalIsOpen: false,
      currentImagebase64: null,
      ...initialState
    };
  }

  openImage = index => {
    const image = photos[index];
    const base_image = new Image();
    base_image.src = image.src;
    const base64 = this.getBase64Image(base_image);
    this.setState(prevState => ({
      currentImage: index,
      modalIsOpen: !prevState.modalIsOpen,
      currentImagebase64: base64,
      ...initialState
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen
    }));
  };

  changeText = event => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value
    });
  };

  getStateObj = (e, type) => {
    let rect = this.imageRef.getBoundingClientRect();
    const xOffset = e.clientX - rect.left;
    const yOffset = e.clientY - rect.top;
    let stateObj = {};
    if (type === "bottom") {
      stateObj = {
        isBottomDragging: true,
        isTopDragging: false,
        bottomX: `${xOffset}px`,
        bottomY: `${yOffset}px`
      };
    } else if (type === "top") {
      stateObj = {
        isTopDragging: true,
        isBottomDragging: false,
        topX: `${xOffset}px`,
        topY: `${yOffset}px`
      };
    }
    return stateObj;
  };

  handleMouseDown = (e, type) => {
    const stateObj = this.getStateObj(e, type);
    document.addEventListener("mousemove", event =>
      this.handleMouseMove(event, type)
    );
    this.setState({
      ...stateObj
    });
  };

  handleMouseMove = (e, type) => {
    if (this.state.isTopDragging || this.state.isBottomDragging) {
      let stateObj = {};
      if (type === "bottom" && this.state.isBottomDragging) {
        stateObj = this.getStateObj(e, type);
      } else if (type === "top" && this.state.isTopDragging) {
        stateObj = this.getStateObj(e, type);
      }
      this.setState({
        ...stateObj
      });
    }
  };

  handleMouseUp = event => {
    document.removeEventListener("mousemove", this.handleMouseMove);
    this.setState({
      isTopDragging: false,
      isBottomDragging: false
    });
  };

  convertSvgToImage = () => {
    const svg = this.svgRef;
    let svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");
    img.setAttribute(
      "src",
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    );
    img.onload = function() {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const canvasdata = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "mainos.png";
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    };
  };

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

  render() {
    let fontsize = this.state.fontsize;
    let fontsize2 = this.state.fontsize2;
    const image = photos[this.state.currentImage];
    const base_image = new Image();
    base_image.src = image.src;
    var wrh = base_image.width / base_image.height;
    var newWidth = 600;
    var newHeight = newWidth / wrh;
    const textStyle = {
      fontFamily: "Luckiest Guy",
      fontSize: `${fontsize}px`,
      textTransform: "uppercase",
      fill: "#FFF",
      stroke: "#000",
      userSelect: "none"
    };

    const textStyle2 = {
      fontFamily: "Luckiest Guy",
      fontSize: `${fontsize2}px`,
      textTransform: "uppercase",
      fill: "#FFF",
      stroke: "#000",
      userSelect: "none"
    };

    const textStyle3 = {
      fontFamily: "Luckiest Guy",
      fontSize: "50px",
      fill: "#FFF",
      stroke: "#000",
      userSelect: "none"
    };

    return (
      <div>
        <div className="main-content">
          <div className="sidebar">
            <NavbarBrand href="/">Salpakirja</NavbarBrand>
            <p>Valitse haluamasi mainospohja oikealta</p>
          </div>
          <div className="content">
            {photos.map((image, index) => (
              <div className="image-holder" key={image.src}>
                <span className="caption">Salpakirja</span>
                <img
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    height: "100%"
                  }}
                  alt={index}
                  src={image.src}
                  onClick={() => this.openImage(index)}
                  role="presentation"
                />
              </div>
            ))}
          </div>
        </div>
        <Modal className="meme-gen-modal" isOpen={this.state.modalIsOpen}>
          <ModalHeader toggle={this.toggle}>Make</ModalHeader>
          <ModalBody>
            <svg
              width={newWidth}
              id="svg_ref"
              height={newHeight}
              ref={el => {
                this.svgRef = el;
              }}
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <image
                ref={el => {
                  this.imageRef = el;
                }}
                xlinkHref={this.state.currentImagebase64}
                height={newHeight}
                width={newWidth}
              />
              <text
                style={{
                  ...textStyle2,
                  zIndex: this.state.isTopDragging ? 4 : 1
                }}
                x={this.state.topX}
                y={this.state.topY}
                dominantBaseline="middle"
                textAnchor="middle"
                onMouseDown={event => this.handleMouseDown(event, "top")}
                onMouseUp={event => this.handleMouseUp(event, "top")}
              >
                {this.state.toptext}
              </text>
              <text
                style={textStyle}
                dominantBaseline="middle"
                textAnchor="middle"
                x={this.state.bottomX}
                y={this.state.bottomY}
                onMouseDown={event => this.handleMouseDown(event, "bottom")}
                onMouseUp={event => this.handleMouseUp(event, "bottom")}
              >
                {this.state.bottomtext}
              </text>
              <text
                style={textStyle3}
                dominantBaseline="middle"
                textAnchor="middle"
                x={this.state.ovhX}
                y={this.state.ovhY}
                onMouseDown={event => this.handleMouseDown(event, "bottom")}
                onMouseUp={event => this.handleMouseUp(event, "bottom")}
              >
                {this.state.ovh}
              </text>
            </svg>
            <div className="meme-form">
              <FormGroup>
                <Label for="toptext">Kirjan nimi</Label>
                <input
                  className="form-control"
                  type="text"
                  name="toptext"
                  id="toptext"
                  placeholder="Metsästä kuuluu hekotusta"
                  onChange={this.changeText}
                />
              </FormGroup>
              <FormGroup>
                <Label for="bottomtext">Alennettu Hinta</Label>
                <input
                  className="form-control"
                  type="text"
                  name="bottomtext"
                  id="bottomtext"
                  placeholder="20€"
                  onChange={this.changeText}
                />
              </FormGroup>
              <FormGroup>
                <Label for="ovh">OVH. hinta</Label>
                <input
                  className="form-control"
                  type="text"
                  name="ovh"
                  id="ovh"
                  defaultValue="ovh."
                  placeholder="29,90€"
                  onChange={this.changeText}
                />
              </FormGroup>
              <FormGroup>
                <Label for="fontsize">Fontin koko / nimi</Label>
                <input
                  className="form-control"
                  type="number"
                  defaultValue="50"
                  name="fontsize2"
                  id="fontsize2"
                  placeholder="50"
                  onChange={this.changeText}
                />
              </FormGroup>
              <FormGroup>
                <Label for="fontsize2">Fontin koko / hinta</Label>
                <input
                  className="form-control"
                  type="number"
                  name="fontsize"
                  id="fontsize"
                  defaultValue="120"
                  placeholder="50"
                  onChange={this.changeText}
                />
              </FormGroup>
              <button
                onClick={() => this.convertSvgToImage()}
                className="btn btn-primary"
              >
                Lataa mainos
              </button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default MainPage;
