import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import * as C from '../constants';

class Landscape extends Component {
  state = {
    objects: [],
    tooltip: null,
    showTooltip: false,
    popupMessage: null,
    zoomRegion: null,
    zoomScale: 1,
    zoomTranslation: '',
    bookShadow: null
  };

  componentWillMount() {
    this.setState({
      objects: C.OBJECTS_REFERENCE.map(obj => {
        const bs = obj[0] === 'book-stack';
        return {
          id: obj[0],
          name: obj[3],
          left:   bs ? C.TINY_BOOK_BASE_LEFT                           : obj[1],
          top:    bs ? C.getTinyBookStackTop(this.props.projects.length) : obj[2],
          width:  bs ? C.TINY_BOOK_WIDTH                               : null,
          height: bs ? C.TINY_BOOK_HEIGHT * this.props.projects.length : null
        }
      }),
    });
  }

  componentDidMount() {
    this.setBookShadow();
  }

  handleObjectClick = (e) => {
    const id = e.currentTarget.id;
    switch (id) {
      case 'awards-cup':
        this.popupMessage('Awards still under construction, hahah')
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

  getTooltipFontSize = () => `${C.TOOLTIP_FONT_SIZE / this.props.scaleFactor}rem`;
  getTooltipPaddingX = () => `${(C.TOOLTIP_PADDING - C.TOOLTIP_FONT_SIZE / 2) / this.props.scaleFactor}rem`;
  getTooltipPaddingY = () => `${C.TOOLTIP_PADDING / this.props.scaleFactor}rem`;

  showTooltip = (e) => {
    let target = e.currentTarget;
    
    if (target.id === 'book-stack')
    return;
    if (target.id === 'book-stack-svg')
    target = target.parentNode;

    const test = document.getElementById("text-test");
    test.style.fontSize = this.getTooltipFontSize();
    test.style.padding = this.getTooltipPaddingX();
    test.innerHTML = target.name;
    const width = test.clientWidth + 1;
    let extraStyles = {};
    let left = parseInt(target.style.left) + (target.clientWidth - width) / 2 + 'px';
    if (parseInt(target.style.left) + width > C.CANVAS_WIDTH) 
      left = `calc(${C.CANVAS_WIDTH - width}px - ${this.getTooltipPaddingY()} * 1.5)`;
    if (parseInt(target.style.left) <= (width - target.clientWidth) / 2) {
      if (left[0] === 'c') {
        extraStyles = {
          width: `calc(${C.CANVAS_WIDTH}px - ${this.getTooltipPaddingY()} * 2.5)`,
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
        top: `calc(${parseInt(target.style.top) - target.clientHeight * 0.1}px - ${(C.TOOLTIP_FONT_SIZE+C.TOOLTIP_PADDING*2.5) / this.props.scaleFactor}rem)`,
        extraStyles
      }
    });
  }

  hideTooltip = () => this.setState({showTooltip: false});

  popupMessage = (popupMessage) => {
    this.props.showPopup(popupMessage);
  }

  zoomPopup = (id) => {
    const obj = document.querySelector(`#${id}`);
    if (!obj) return;

    this.updateZoomData({
      left: parseFloat(obj.style.left),
      top: parseFloat(obj.style.top),
      width: obj.naturalWidth,
      height: obj.naturalHeight
    });
    this.props.zoomInCanvas();
    this.props.showAboutPopup(id);
  }

  updateZoomData = (zoomRegion) => {
    // const innerWidth = document.documentElement.clientWidth;
    const innerWidth = window.innerWidth;

    const sampleWidth = window.innerHeight / innerWidth > zoomRegion.height / zoomRegion.width;
    const scaleFactor = sampleWidth ?
                        (innerWidth  / zoomRegion.width * 0.9) :
                        (window.innerHeight / zoomRegion.height * 0.9);

    const xOffset = -zoomRegion.left;
    const yOffset = (C.CANVAS_HEIGHT * scaleFactor - zoomRegion.top * scaleFactor - window.innerHeight) / scaleFactor; 
    
    // Compensations to center the zoomed object and give it margins
    let xOffsetExtra = sampleWidth ? zoomRegion.width * 0.05 
                                     : (innerWidth / window.innerHeight) * zoomRegion.height / 2 - zoomRegion.width / 2;
    let yOffsetExtra = sampleWidth ? (window.innerHeight / innerWidth) * zoomRegion.width / 2 - zoomRegion.height / 2
                                     : zoomRegion.width * 0.05;
               
    // Extra compensations for if the image frame is partly outside the canvas
    // const canvasWidthDiff = CANVAS_WIDTH - (zoomRegion.left + xOffsetExtra * 2); /// still not entirely optimally functional...
    const canvasWidthDiff = zoomRegion.left + (innerWidth / window.innerHeight) * zoomRegion.height - C.CANVAS_WIDTH;
    if (canvasWidthDiff > 0) {
      xOffsetExtra = 1/0.9 * canvasWidthDiff;
    }
    const canvasWidthDiff2 = zoomRegion.left - xOffsetExtra;
    if (canvasWidthDiff2 < 0) {
      xOffsetExtra += canvasWidthDiff2;
    }
    /// and should probably also add this for y direction
    
    this.setState({
      zoomRegion,
      zoomScale: scaleFactor,
      zoomTranslation: `translate(${xOffset + xOffsetExtra}px, ${yOffset + yOffsetExtra}px)`
    });
  }

  getTransformation = () => this.props.zoomIn ? `scale(${this.state.zoomScale}, ${this.state.zoomScale}) ${this.state.zoomTranslation}`
                                              : `scale(${this.props.scaleFactor}, ${this.props.scaleFactor})`;

  getBlur = () => this.props.zoomIn ? C.BASE_ZOOM_BLUR / this.state.zoomScale : 0;

  slideToScreen = (screenName) => {
    this.props.changeLandscape(2, screenName)
    return;
  }

  setBookShadow = () => this.setState({bookShadow: C.calculateBookShadow('.book--tiny')});

  render() {
    const {objects, tooltip, showTooltip} = this.state;
    return (
      <div id="landscape-variant-container--1"
           className="bottom-container landscape-variant-container landscape--1"
           style={{ 
             transform: this.getTransformation(),
             height: C.CANVAS_HEIGHT, width: C.CANVAS_WIDTH,
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
                onMouseOver: obj.id === 'book-stack' ? null : this.showTooltip,
                onMouseOut:  obj.id === 'book-stack' ? null : this.hideTooltip
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
                          id={`book--tiny-${i}`}
                          alt="book"
                          style={{
                            height: C.TINY_BOOK_HEIGHT,
                            width:  C.TINY_BOOK_HEIGHT * p.book.width,
                            top:    C.TINY_BOOK_HEIGHT * p.book.yOffset,
                            left:   C.TINY_BOOK_HEIGHT * p.book.xOffset,
                            filter: `brightness(${p.book.tintDeviation})`
                          }}
                        />)
                    }
                    <svg width={obj.width} height={obj.height} id="book-stack-svg" onMouseOver={this.showTooltip} onMouseOut={this.hideTooltip}>
                      <path d={this.state.bookShadow || null} fill="none" id="book-stack-hitbox"/>
                      <path d={this.state.bookShadow || null} className="shadow book-stack-shadow--1" fill="black"/>
                    </svg>
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
                fontSize: `${C.TOOLTIP_FONT_SIZE / this.props.scaleFactor}rem`,
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