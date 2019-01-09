import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import {CANVAS_HEIGHT, CANVAS_WIDTH} from './LandscapeContainer';

const BOOK_HEIGHT = 40;
const BOOK_WIDTH = 240;
const BOOK_BASE_LEFT = 3690;
const BOOK_BASE_BOTTOM = 4300;

const TOOLTIP_FONT_SIZE = 1;
const TOOLTIP_PADDING = 1.1;

const BASE_ZOOM_BLUR = 8;

const objectsReference = [
  ['awards-cup',        2811,  3594, 'Awards'],
  ['future-building',   479.5, 3765, 'Future Fantasy'],
  ['hobby-heap',        74,    4377, 'Hobby Heap'],
  ['jiri-soul',         2103,  4330, 'Jiri\'s SOUL'],
  ['octopus-tree',      1321,  4205, 'The Octopus Tree of Life'],
  ['spiral-tower',      4238,  2760, 'Two Sided Miracle'],
  ['technology-forest', 0,     3919, 'Techno Forest'],
  ['book-stack',        null,  null, 'Projects']
];

const getBookStackTop = (size) => BOOK_BASE_BOTTOM - size * BOOK_HEIGHT;

class Landscape extends Component {
  state = {
    objects: [],
    tooltip: null,
    showTooltip: false,
    popupMessage: null,
    zoomIn: false,
    zoomRegion: null,
    zoomScale: 1,
    zoomTranslation: ''
  };

  componentWillMount() {
    this.setState({
      objects: objectsReference.map(obj => {
        const bs = obj[0] === 'book-stack';
        return {
          id: obj[0],
          name: obj[3],
          left: bs ? BOOK_BASE_LEFT                             : obj[1],
          top: bs ? getBookStackTop(this.props.projects.length) : obj[2],
          width: bs ? BOOK_WIDTH                                : null,
          height: bs ? BOOK_HEIGHT * this.props.projects.length : null
        }
      }),
    });
  }

  handleObjectClick = (e) => {
    const id = e.target.id || e.target.parentNode.id;
    switch (id) {
      case 'awards-cup':
        this.popupMessage('Awards still under construction')
        return;
      case 'future-building':
      case 'hobby-heap':
      case 'jiri-soul':
      case 'octopus-tree':
      case 'spiral-tower':
      case 'technology-forest':
        this.zoomPopup(id);
        return;
      case 'book-stack':
        this.slideToScreen(id);
        return;
      default:
        throw new Error('id of the thing you clicked on seems invalid');
    }
  }

  getTooltipFontSize = () => `${TOOLTIP_FONT_SIZE / this.props.scaleFactor}rem`;
  getTooltipPaddingX = () => `${(TOOLTIP_PADDING - TOOLTIP_FONT_SIZE / 2) / this.props.scaleFactor}rem`;
  getTooltipPaddingY = () => `${TOOLTIP_PADDING / this.props.scaleFactor}rem`;

  showTooltip = (e) => {
    const target = e.target.id ? e.target : e.target.parentNode;

    const test = document.getElementById("text-test");
    test.style.fontSize = this.getTooltipFontSize();
    test.style.padding = this.getTooltipPaddingX();
    test.innerHTML = target.name;
    const width = test.clientWidth + 1;
    let extraStyles = {};
    let left = parseInt(target.style.left) + (target.clientWidth - width) / 2 + 'px';
    if (parseInt(target.style.left) + width > CANVAS_WIDTH) 
      left = `calc(${CANVAS_WIDTH - width}px - ${this.getTooltipPaddingY()} * 1.5)`;
    if (parseInt(target.style.left) <= (width - target.clientWidth) / 2) {
      if (left[0] === 'c') {
        extraStyles = {
          width: `calc(${CANVAS_WIDTH}px - ${this.getTooltipPaddingY()} * 2.5)`,
          whiteSpace: 'normal',
          lineHeight: 'normal'
        }
      }
      left = `calc(${this.getTooltipPaddingX()} * 1)`;
    }

    this.setState({
      showTooltip: true,
      tooltip: {
        contents: target.name || (target.id === 'book-stack' && 'Projects'),
        left,
        top: `calc(${parseInt(target.style.top) - target.clientHeight * 0.1}px - ${(TOOLTIP_FONT_SIZE+TOOLTIP_PADDING*2.5) / this.props.scaleFactor}rem)`,
        extraStyles
      }
    });
  }

  hideTooltip = () => this.setState({showTooltip: false});

  popupMessage = (popupMessage) => this.setState({popupMessage});

  zoomPopup = (id) => {
    const obj = document.querySelector(`#${id}`);
    if (!obj) return;

    console.log(obj);

    this.props.zoomInCanvas();
    this.updateZoomData({
      left: parseFloat(obj.style.left),
      top: parseFloat(obj.style.top),
      width: obj.naturalWidth,
      height: obj.naturalHeight
    });
  }

  cancelZoom = () => {
    this.props.zoomOutCanvas();
    this.setState({zoomIn: false});
  }

  updateZoomData = (zoomRegion) => {
    // const innerWidth = document.documentElement.clientWidth;
    const innerWidth = window.innerWidth;

    const sampleWidth = window.innerHeight / innerWidth > zoomRegion.height / zoomRegion.width;
    const scaleFactor = sampleWidth ?
                        (innerWidth  / zoomRegion.width * 0.9) :
                        (window.innerHeight / zoomRegion.height * 0.9);

    const xOffset = -zoomRegion.left;
    const yOffset = (CANVAS_HEIGHT * scaleFactor - zoomRegion.top * scaleFactor - window.innerHeight) / scaleFactor; 
    
    // Compensations to center the zoomed object and give it margins
    let xOffsetExtra = sampleWidth ? zoomRegion.width * 0.05 
                                     : (innerWidth / window.innerHeight) * zoomRegion.height / 2 - zoomRegion.width / 2;
    let yOffsetExtra = sampleWidth ? (window.innerHeight / innerWidth) * zoomRegion.width / 2 - zoomRegion.height / 2
                                     : zoomRegion.width * 0.05;
               
    // Extra compensations for if the image frame is partly outside the canvas
    // const canvasWidthDiff = CANVAS_WIDTH - (zoomRegion.left + xOffsetExtra * 2); /// still not entirely optimally functional...
    const canvasWidthDiff = zoomRegion.left + (innerWidth / window.innerHeight) * zoomRegion.height - CANVAS_WIDTH;
    if (canvasWidthDiff > 0) {
      console.log('hi');
      xOffsetExtra = 1/0.9 * canvasWidthDiff;
    }
    const canvasWidthDiff2 = zoomRegion.left - xOffsetExtra;
    if (canvasWidthDiff2 < 0) {
      xOffsetExtra += canvasWidthDiff2;
    }
    /// and should probably also add this for y direction
    
    this.setState({
      zoomIn: true,
      zoomRegion,
      zoomScale: scaleFactor,
      zoomTranslation: `translate(${xOffset + xOffsetExtra}px, ${yOffset + yOffsetExtra}px)`
    });
  }

  getTransformation = () => this.state.zoomIn ? `scale(${this.state.zoomScale}, ${this.state.zoomScale}) ${this.state.zoomTranslation}`
                                              : `scale(${this.props.scaleFactor}, ${this.props.scaleFactor})`;

  getBlur = () => this.state.zoomIn ? BASE_ZOOM_BLUR / this.state.zoomScale : 0;

  slideToScreen = (screenName) => {
    this.props.changeLandscape(2, screenName)
    return;
  }

  render() {
    const {objects, tooltip, showTooltip} = this.state;
    return (
      <div id="landscape-variant-container--1"
           className="bottom-container landscape-variant-container landscape--1"
           style={{ 
             transform: this.getTransformation(),
             height: CANVAS_HEIGHT, width: CANVAS_WIDTH,
             filter: `blur(${this.getBlur()}px)`
           }}>
        <div className="rel-container">
          <img src={require('../assets/landscape/landscape-1.png')} className="landscape" id="landscape-1" alt="landscape 1" />
          {objects[0] &&
            objects.map(obj => {
              const props = {
                key: obj.id,
                id: obj.id,
                name: obj.name,
                className: 'landscape-object',
                style: {
                  left: obj.left,
                  top:  obj.top,
                },
                onClick: this.handleObjectClick,
                onMouseOver: this.showTooltip,
                onMouseOut: this.hideTooltip
              }
              
              if (obj.id === 'book-stack') {
                return (
                  <div {...props} style={{...props.style, width: obj.width, height: obj.height}}>
                    {
                      this.props.projects.map((p, i) => 
                        <img 
                          src={require('../assets/box-dark.png')} 
                          className="book--tiny" 
                          key={`book--tiny-${i}`} 
                          alt="book"
                          style={{
                            height: BOOK_HEIGHT,
                            width: p.book.width * BOOK_HEIGHT,
                            bottom: p.book.yOffset * BOOK_HEIGHT,
                            left: p.book.xOffset * BOOK_HEIGHT,
                            filter: `brightness(${p.book.tintDeviation})`
                          }}
                        />)
                    }
                  </div>
                );
              }
              else {
                return ( <img {...props} src={require(`../assets/landscape/objects/${obj.id}.png`)} alt={obj.id} /> );
                // return null;
              }
            }
          )}

          <CSSTransition
            in={showTooltip}
            classNames="tooltip"
            unmountOnExit
            timeout={500}
          >
            <p
              className="tooltip"
              style={{
                left: tooltip && tooltip.left,
                top: tooltip && tooltip.top,
                fontSize: `${TOOLTIP_FONT_SIZE / this.props.scaleFactor}rem`,
                padding:  `${this.getTooltipPaddingY()} ${this.getTooltipPaddingX()}`,
                ...(tooltip && tooltip.extraStyles)
              }}
            >
              {tooltip && tooltip.contents}
            </p>
          </CSSTransition>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({projects}) => ({projects});

export default connect(mapStateToProps)(Landscape);