import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import {isMobile} from 'react-device-detect';
import { withCookies } from 'react-cookie';

import {changePage} from '../actions/currentPage';
import {fetchAboutTexts} from '../actions/abouts';

import * as C from '../constants';
import OBJECTS from '../assets/objects';
import CREATURES from '../assets/landscape/creatures';
import TECHNOLOGIES from '../assets/objects/images';

class Landscape1 extends Component {
  state = {
    tooltip: null,
    showTooltip: false,
    zoomRegion: null,
    zoomScale: 1,
    zoomTranslation: '',
    bookShadow: null,
    cursorPos: {
      x: null,
      y: null
    },
    activeCreatures: [],
    creatureGeneratorId: null,
    activeTechClouds: [],
    techCloudGeneratorId: null
  };

  componentWillMount() {
    if (!this.props.abouts['jiri-soul'].text)
      this.props.fetchAboutTexts();
  }

  componentDidMount() {
    this.setBookShadow();
    
    if (!isMobile) {
      if (!this.props.cookies.get('hasVisited'))
        window.addEventListener('scroll', this.handleScroll);
      document.addEventListener('mousemove', this.handleMousemove);
      this.setState({
        creatureGeneratorId:  setInterval(this.generateCreature,  6000),
        techCloudGeneratorId: setInterval(this.generateTechCloud, 5000)
      });
    }
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldProps.zoomIn !== this.props.zoomIn && this.props.zoomIn) {
      const obj = document.querySelector(`#${this.props.currentPage.popup.id}`);
      if (!obj) return;

      this.props.setPageName(obj.name);
      this.updateZoomData({
        left: parseFloat(obj.style.left),
        top: parseFloat(obj.style.top),
        width:  obj.naturalWidth  || parseFloat(obj.style.width),
        height: obj.naturalHeight || parseFloat(obj.style.width)
      });
    }

    if (this.state.tooltip !== oldState.tooltip)
      this.props.setPageName();
  }

  componentWillUnmount() {
    if (!isMobile) {
      if (!this.props.cookies.get('hasVisited'))
        window.removeEventListener('scroll', this.handleScroll);
      document.removeEventListener('mousemove', this.handleMousemove);

      clearInterval(this.state.creatureGeneratorId);
      clearInterval(this.state.techCloudGeneratorId);
    }

    this.state.activeCreatures.forEach(c => clearTimeout(c.timeoutId));
    this.state.activeTechClouds.forEach(t => clearTimeout(t.timeoutId));
  }

  handleObjectClick = (e) => {
    e.preventDefault();
    const id = e.currentTarget.id;
    switch (id) {
      case 'awards-cup':
      case 'contact-details':
      case 'jiri-soul':
        this.props.scrollDown(true, () => this.zoomPopup(id, 'text'));
        return;
      case 'future-building':
      case 'hobby-heap':
      case 'octopus-tree':
      case 'spiral-tower':
      case 'technology-forest':
        this.props.scrollDown(true, () => this.zoomPopup(id, 'about'));
        return;
      case 'book-stack':
        this.props.scrollDown(true, () => this.props.changePage({landscape: 2}));
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

    const test = document.getElementById("text-test-2");
    test.style.fontSize = this.getTooltipFontSize();
    test.style.padding = this.getTooltipPaddingX();
    test.innerHTML = e.message || target.name;
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
        contents: e.message || target.name || (target.id === 'book-stack' && OBJECTS['book-stack'].name) || (target.id === 'jiri-soul' && OBJECTS['jiri-soul'].name),
        left,
        top: `calc(${parseInt(target.style.top) - target.clientHeight * 0.1}px - ${(C.TOOLTIP_FONT_SIZE+C.TOOLTIP_PADDING*2.5) / this.props.scaleFactor}rem)`,
        extraStyles,
        white: !!e.message
      }
    });
  }

  hideTooltip = () => this.setState({showTooltip: false});

  handleMousemove = (e) => {
    // Could also use offsetX & offsetY
    this.setState({
      cursorPos: {
        x: e.pageX,
        y: e.pageY
      }
    });
  }

  handleScroll = () => {
    if (window.pageYOffset > C.getBottomScrollPos() * 0.9)
      setTimeout(this.displayWelcomeMessage, 2000);
  }

  displayWelcomeMessage = () => {
    window.removeEventListener('scroll', this.handleScroll);
    
    this.props.cookies.set('hasVisited', true, {path: '/'});
    
    const jiriSoul = document.getElementById('jiri-soul');
    if (!jiriSoul)
      return;

    this.showTooltip({
      currentTarget: jiriSoul,
      message: 'Welcome to Jiri\'s Domain! Click on the stuffs to get cool info!'
    });

    setTimeout(this.hideTooltip, 5000);
  }

  getPupilTranslation = () => {
    if (!this.state.cursorPos.x || !this.state.cursorPos.y)
      return {};
    
    const {x, y} = this.state.cursorPos;
    const soul = OBJECTS['jiri-soul'];

    const soulClientX = ((soul.left + soul.width / 2) / C.CANVAS_WIDTH) * document.documentElement.clientWidth;
    const soulClientY = C.getDocHeight() - ((C.CANVAS_HEIGHT - soul.top + soul.height * 0.8) / C.CANVAS_HEIGHT) * C.getDocHeight();

    let left, top;
    
    if (x < soulClientX)
      left = C.mapRange(x, 0, soulClientX, -15 * C.CANVAS_SCALE, 0);
    else
      left = C.mapRange(x, soulClientX, document.documentElement.clientWidth, 0, 5 * C.CANVAS_SCALE);
    
    if (y < soulClientY)
      top = C.mapRange(y, 0, soulClientY, -15 * C.CANVAS_SCALE, 0);
    else
      top = C.mapRange(y, soulClientY, C.getDocHeight(), 0, 15 * C.CANVAS_SCALE);

    return {left, top};
  }

  zoomPopup = (id, type) => {
    this.props.changePage({
      popup: {
        type,
        id,
        text: this.props.abouts[id].text
      }
    });
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
    const canvasWidthDiff = zoomRegion.left + (sampleWidth ? zoomRegion.width : (innerWidth / window.innerHeight) * zoomRegion.height) - C.CANVAS_WIDTH;
    if (canvasWidthDiff > 0) {
      xOffsetExtra = 1/0.9 * canvasWidthDiff;
    }
    const canvasWidthDiff2 = zoomRegion.left - xOffsetExtra;
    if (canvasWidthDiff2 < 0) {
      xOffsetExtra += canvasWidthDiff2;
    }
    const canvasHeightDiff = zoomRegion.top + (sampleWidth ? (window.innerHeight / innerWidth) * zoomRegion.width : zoomRegion.height) - C.CANVAS_HEIGHT;
    if (canvasHeightDiff > 0) {
      yOffsetExtra = 1/(1920 / window.innerWidth * 0.2) * canvasHeightDiff;
    }
    
    this.setState({
      zoomRegion,
      zoomScale: scaleFactor,
      zoomTranslation: `translate(${xOffset + xOffsetExtra}px, ${yOffset + yOffsetExtra}px)`
    });
  }

  getTransformation = () => this.props.zoomIn ? `scale(${this.state.zoomScale}) ${this.state.zoomTranslation}`
                                              : `scale(${this.props.scaleFactor})`;

  getBlur = () => this.props.zoomIn ? C.BASE_ZOOM_BLUR / this.state.zoomScale : 0;

  setBookShadow = () => this.setState({bookShadow: C.calculateBookShadow('.book--tiny')});

  generateCreature = () => {
    const creatureId = Math.random();
    const creatureType = Object.keys(CREATURES)[Math.round(Math.random() * Object.keys(CREATURES).length - 0.5)];
    const creatureSpecies = CREATURES[creatureType][Math.round(creatureId * CREATURES[creatureType].length - 0.5)];
    let style, timeout;
    switch (creatureType) {
      case 'ground':
        style = {
          left: C.mapRange(Math.random(), 0, 1, 915 * C.CANVAS_SCALE, 1150 * C.CANVAS_SCALE),
          top:  C.mapRange(Math.random(), 0, 1, 4100 * C.CANVAS_SCALE, 4300 * C.CANVAS_SCALE)
        };
        timeout = 10000;
        break;
      case 'air':
        style = {
          left: Math.random() * C.CANVAS_WIDTH * 0.5,
          top: Math.random() * C.CANVAS_HEIGHT * 0.6
        };
        timeout = 20000;
        break;
      default:
        throw new Error('Unknown creature type');
    }

    const creatureTimeoutId = setTimeout(() => 
      this.setState({activeCreatures: this.state.activeCreatures.filter(creature => creature.id !== creatureId)}), 
    timeout + 1000);

    this.setState({activeCreatures: [
      ...this.state.activeCreatures,
      {
        id: creatureId,
        type: creatureType,
        species: creatureSpecies,
        style,
        timeoutId: creatureTimeoutId
      }
    ]});
  }

  generateTechCloud = () => {
    const cloudId = Math.random();
    const cloudNumber = Math.round(Math.random() * 3 - 0.5) + 1;
    const chimneyCoords = C.TECH_CLOUD_START_POSITIONS[Math.round(Math.random() * 3 - 0.5)];
    const iconImage = TECHNOLOGIES[Math.round(cloudId * TECHNOLOGIES.length - 0.5)];

    const techCloudTimeoutId = setTimeout(() => 
      this.setState({activeTechClouds: this.state.activeTechClouds.filter(cloud => cloud.id !== cloudId)}), 
    11000);

    this.setState({activeTechClouds: [
      ...this.state.activeTechClouds,
      {
        id: cloudId,
        cloudNumber,
        iconImage,
        style: chimneyCoords,
        timeoutId: techCloudTimeoutId
      }
    ]});
  }

  render() {
    const {tooltip, showTooltip} = this.state;
    return (
      <div id="landscape-variant-container--1"
           className="bottom-container landscape-variant-container landscape--1"
           style={{ 
             transform: this.getTransformation(),
             height: C.CANVAS_HEIGHT, width: C.CANVAS_WIDTH,
             filter: `blur(${this.getBlur()}px)`
           }}>
        <div className="rel-container">
         <h2 className="landscape-name"> ABOUT </h2>
          <img src={require('../assets/landscape/landscape-1.png')} className="landscape" id="landscape-1" alt="landscape 1" />
          {this.props.abouts['jiri-soul'] &&
            Object.values(this.props.abouts).map(obj => {
              if (obj.left === undefined || obj.top === undefined) return null;
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
                      this.props.projects.map((p, i) => {
                        return <img
                          src={require('../assets/box-dark-small.png')} 
                          className="book--tiny" 
                          key={`book--tiny-${i}`}
                          id={`book--tiny-${i}`}
                          alt="book"
                          style={{
                            height: C.TINY_BOOK_HEIGHT * C.CANVAS_SCALE,
                            width:  C.TINY_BOOK_HEIGHT * C.CANVAS_SCALE * p.book.width,
                            top:    C.TINY_BOOK_HEIGHT * C.CANVAS_SCALE * p.book.yOffset,
                            left:   C.TINY_BOOK_HEIGHT * C.CANVAS_SCALE * p.book.xOffset,
                            filter: `brightness(${p.book.tintDeviation})`
                          }}
                        />})
                    }
                    <svg width={obj.width} height={obj.height} id="book-stack-svg" onMouseOver={this.showTooltip} onMouseOut={this.hideTooltip}>
                      <path d={this.state.bookShadow || null} fill="none" id="book-stack-hitbox"/>
                      <path d={this.state.bookShadow || null} className="shadow book-stack-shadow--1" fill="black"/>
                    </svg>
                  </div>
                );
              }
              else if (obj.id === 'jiri-soul') {
                return (
                  <div {...props} style={{...props.style, width: obj.width, height: obj.height}}>
                    {/* <div className="rel-container"> */}
                      <img id="jiri-soul__container" src={require(`../assets/landscape/objects/${obj.id}.${obj.extension}`)} alt="jiri soul container" />
                      <img id="jiri-soul__pupils"    src={require(`../assets/landscape/objects/${obj.id}-pupils.png`)}       alt="jiri soul pupils"
                           style={this.getPupilTranslation()}
                      />
                    {/* </div> */}
                  </div>
                ) 
              }
              else {
                return ( <img {...props} src={require(`../assets/landscape/objects/${obj.id}.${obj.extension}`)} alt={obj.id} /> );
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
              className={`tooltip ${tooltip && tooltip.white ? 'tooltip__white' : 'tooltip__black'}`}
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

          <div>
            {this.state.activeCreatures.map(cr =>
                <img 
                  src={require(`../assets/landscape/creatures/${cr.species}.gif`)} 
                  className={`creature ${cr.type}-creature ${cr.species}`} alt={cr.species} 
                  style={cr.style} key={cr.id}
                />  
            )}
          </div>
          <div>
            {this.state.activeTechClouds.map(cloud =>
                <div className="tech-cloud-container" style={cloud.style} key={cloud.id}>
                  <img 
                    src={require(`../assets/objects/images/${cloud.iconImage}`)} 
                    className="tech-cloud__icon" alt="technology icon" 
                 />
                 <img 
                    src={require(`../assets/objects/images/circle-cloud-${cloud.cloudNumber}.png`)} 
                    className="tech-cloud__cloud" alt="tech cloud cloud" 
                 />
                </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({projects, abouts, currentPage}) => ({projects, abouts, currentPage});

export default withCookies(connect(mapStateToProps, {changePage, fetchAboutTexts})(Landscape1));