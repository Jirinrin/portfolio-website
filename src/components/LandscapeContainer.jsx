import React, { Component } from 'react';
import Landscape1 from './Landscape1';
import Landscape2 from './Landscape2';
import { CSSTransition } from 'react-transition-group';

import './Landscape.scss';

export const CANVAS_HEIGHT = 5662;
export const CANVAS_WIDTH  = 4961;

class LandscapeContainer extends Component {
  state = { 
    scaleFactor: 1,
    landscapeNum: 0,
    landscapeTitle: null,
    zoomIn: false,
  };

  componentDidMount() {
    this.setState({
      scaleFactor: this.calculateScaleFactor(),
      landscapeNum: 1
    }, () => {
      window.addEventListener('resize', this.handleResize);
      this.updateAnimations();
    });
  }

  componentDidUpdate(oldProps, oldState) {
    if (!this.state.animationOngoing && oldState.scaleFactor !== this.state.scaleFactor)
      this.updateAnimations(true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = (e) => this.setState({scaleFactor: this.calculateScaleFactor(e.target.innerWidth)});

  calculateScaleFactor = (windowSize = window.innerWidth) => windowSize / CANVAS_WIDTH;

  changeLandscape = (num, title=null) => {
    this.setState({
      landscapeNum: num,
      landscapeTitle: title
    });
  }

  updateAnimations(firstDelelete=false) {
    const style = document.createElement('style');
    const container = document.querySelector('#Landscape-container');

    const rules = [];

    const exit1 = 'translate(-100vw, 0)';
    const exit2 = 'translate(100vw, 0)';
    const enter = 'translate(0, 0)';

    const templatePt1 = ' { transform: ';
    const templatePt2 = ` scale(${this.state.scaleFactor}, ${this.state.scaleFactor}) !important; }`;
    
    rules.push('.landscape--1-enter'                           + templatePt1 + exit1 + templatePt2);
    rules.push('.landscape--1-exit.landscape--1-exit-active'   + templatePt1 + exit1 + templatePt2);
    rules.push('.landscape--2-enter'                           + templatePt1 + exit2 + templatePt2);
    rules.push('.landscape--2-exit.landscape--2-exit-active'   + templatePt1 + exit2 + templatePt2);
    rules.push('.landscape--1-enter.landscape--1-enter-active' + templatePt1 + enter + templatePt2);
    rules.push('.landscape--1-exit'                            + templatePt1 + enter + templatePt2);
    rules.push('.landscape--2-enter.landscape--2-enter-active' + templatePt1 + enter + templatePt2);
    rules.push('.landscape--2-exit'                            + templatePt1 + enter + templatePt2);

    rules.forEach(r => style.appendChild(document.createTextNode(r)));

    container.appendChild(style);
  }

  zoomInCanvas = () => {
    this.setState({zoomIn: true});
    console.log(window);
    window.scrollTo(0, 100000); // I know kan robuuster
  }

  zoomOutCanvas = () => {
    this.setState({zoomIn: false});
  }

  render() { 
    return ( 
      <div 
        id="Landscape-container" 
        className="bottom-container full-width" 
        style={this.state.zoomIn ?
          {height: '100vh', width: '100vw'} : /// en scroll naar beneden ofzo
          {height: this.state.scaleFactor * CANVAS_HEIGHT, width: this.state.scaleFactor * CANVAS_WIDTH}
        }
      >
        <div className="rel-container overflow-hidden">
          <h2>About me</h2>
          <img src={require('../assets/landscape/jiri-shine.png')} className="landscape full-width" id="shining-effect" alt="shining effect" />
          <img src={require('../assets/landscape/jiri-head.png')} className="landscape full-width" id="jiri-head" alt="floating head" />
          
          <CSSTransition
            in={this.state.landscapeNum === 1}
            classNames="landscape--1"
            mountOnEnter
            unmountOnExit
            timeout={1000}
          >
            <Landscape1 
              scaleFactor={this.state.scaleFactor}
              changeLandscape={this.changeLandscape}
              zoomInCanvas={this.zoomInCanvas}
              zoomOutCanvas={this.zoomOutCanvas}
            />
          </CSSTransition>
          <CSSTransition
            in={this.state.landscapeNum === 2}
            classNames="landscape--2"
            mountOnEnter
            unmountOnExit
            timeout={1000}
          >
            <Landscape2 
              scaleFactor={this.state.scaleFactor}
              landscapeTitle={this.state.landscapeTitle}
              changeLandscape={this.changeLandscape}
            />
          </CSSTransition>
        </div>
      </div> 
    );
  }
}
 
export default LandscapeContainer;