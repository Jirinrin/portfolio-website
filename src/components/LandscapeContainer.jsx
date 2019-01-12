import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import ReactMarkdown from 'react-markdown';
import smoothscroll from 'smoothscroll-polyfill';
// kick off the polyfill!

import * as C from '../constants';

import {updateWidths} from '../actions/projects';
import {changePage} from '../actions/currentPage';

import Landscape1 from './Landscape1';
import Landscape2 from './Landscape2';

import './Landscape.scss';

smoothscroll.polyfill();

function getDocHeight() {
  const body = document.body;
  const html = document.documentElement;
  return Math.max(
    body.scrollHeight, 
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
}

function getBottomScrollPos() {
  console.log(getDocHeight() - window.innerHeight);
  return getDocHeight() - window.innerHeight;
}

class LandscapeContainer extends Component {
  state = { 
    scaleFactor: 1,
    landscapeTitle: null,
    zoomIn: false,
    frameOffset: 0,
    animationOngoing: false,
  };
  
  componentDidMount() {
    this.setState({
      scaleFactor: this.calculateScaleFactor(),
      landscapeNum: 1
    }, () => {
      window.addEventListener('resize', this.handleResize);
      this.updateAnimations();
    });

    this.props.updateWidths(
      this.props.projects.map(p => {
        const test = document.getElementById("text-test");
        if (!test) return null;
        test.style.fontSize = `1000px`;
        test.style.padding = 0;
        test.innerHTML = p.title;
        return (test.clientWidth + 1) / 1000;
      })
    );
  }

  componentDidUpdate(oldProps, oldState) {
    if (!this.state.animationOngoing && oldState.scaleFactor !== this.state.scaleFactor)
      this.updateAnimations(true);

    if (JSON.stringify(this.props.currentPage) !== JSON.stringify(oldProps.currentPage) &&
        !(this.props.currentPage.landscape === 2 && oldProps.currentPage.showPopup === true && this.props.currentPage.showPopup === false)) {
      console.log('hah');
      window.scrollTo({top: getBottomScrollPos(), left: 0, behavior: 'smooth'});

      if (!this.state.zoomIn && 
          this.props.currentPage.popup && 
          (!oldProps.currentPage.popup || this.props.currentPage.popup.id !== oldProps.currentPage.popup.id) &&
          this.props.currentPage.popup.type === 'about') {
        console.log('haah');
        this.zoomInCanvas();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = (e) => this.setState({scaleFactor: this.calculateScaleFactor(e.target.innerWidth)});

  calculateScaleFactor = (windowSize = window.innerWidth) => windowSize / C.CANVAS_WIDTH;

  // changeLandscape = (num, title=null) => {
  //   if (!this.state.animationOngoing)
  //     this.setState({
  //       landscapeNum: num,
  //     });
  // }

  updateAnimations(firstDelelete=false) {
    // const style = document.createElement('style');
    // const container = document.querySelector('#Landscape-container');

    // const rules = [];

    // const exit1 = 'translate(-100vw, 0)';
    // const exit2 = 'translate(100vw, 0)';
    // const enter = 'translate(0, 0)';

    // const templatePt0 = 'div.landscape-variant-container'
    // const templatePt1 = ' { transform: ';
    // const templatePt2 = ` scale(${this.state.scaleFactor}, ${this.state.scaleFactor}) !important; }`;
    
    // rules.push(templatePt0 + '.landscape--1-enter'                           + templatePt1 + exit1 + templatePt2);
    // rules.push(templatePt0 + '.landscape--1-exit.landscape--1-exit-active'   + templatePt1 + exit1 + templatePt2);
    // rules.push(templatePt0 + '.landscape--2-enter'                           + templatePt1 + exit2 + templatePt2);
    // rules.push(templatePt0 + '.landscape--2-exit.landscape--2-exit-active'   + templatePt1 + exit2 + templatePt2);
    // rules.push(templatePt0 + '.landscape--1-enter.landscape--1-enter-active' + templatePt1 + enter + templatePt2);
    // rules.push(templatePt0 + '.landscape--1-exit'                            + templatePt1 + enter + templatePt2);
    // rules.push(templatePt0 + '.landscape--2-enter.landscape--2-enter-active' + templatePt1 + enter + templatePt2);
    // rules.push(templatePt0 + '.landscape--2-exit'                            + templatePt1 + enter + templatePt2);

    // rules.forEach(r => style.appendChild(document.createTextNode(r)));

    // container.appendChild(style);
  }

  scrollTo = (offset=0) => {
    window.scrollTo(0, getBottomScrollPos() - offset);
  }

  scrollDown = (smooth=false, callback) => {
    if (smooth)
      window.scrollTo({top: getBottomScrollPos(), left: 0, behavior: 'smooth'});
    else 
      window.scrollTo(0, getBottomScrollPos());
    setTimeout(callback, 100);
  }

  scrollToFrameOffset = () => this.scrollTo(this.state.frameOffset);

  getBottomOffset = (scroll) => {
    if (!scroll) return 0;

    return (getDocHeight() - scroll - window.innerHeight);
  }

  zoomInCanvas = (scroll=undefined) => {
    const bottomOffset = this.getBottomOffset(scroll);
    this.setState({
      zoomIn: true,
      frameOffset: bottomOffset
    },
    () => {
      this.scrollTo(bottomOffset);
      window.addEventListener('scroll', this.scrollToFrameOffset);
    });
  }

  zoomOutCanvas = () => {
    window.removeEventListener('scroll', this.scrollToFrameOffset);

    this.setState({
      zoomIn: false,
      frameOffset: 0
    }, () => this.props.changePage({showPopup: false}));
  }

  hidePopup = (e) => {
    e.preventDefault();
    if (!e.target.className.includes('popup-window-background')) 
    return;
    
    this.zoomOutCanvas();
  }

  goToProjects = (e) => {
    e.preventDefault();
    this.props.changePage({landscape: 1})
  }

  renderPopup() {
    const {popup} = this.props.currentPage
    if (!popup)
      return null;

    switch (popup.type) {
      case 'text':
      case 'about':
        return (
          <ReactMarkdown source={popup.text} />
        );
      case 'project':
        return (
          <div>
            <ReactMarkdown source={popup.project.description} />
            
            <br/>
            {popup.project.github && 
              /// laat floaten rechtsbovenin ofzo
              <a href={`https://github.com/Jirinrin/${popup.project.id}`} target="_blank" rel="noopener noreferrer">
                github
              </a>
            }
            <br/>
            {popup.project.images[0] &&
              popup.project.images.map(img => <img src={require(img)} alt="project img"/>)
            }
          </div>
        );
      default:
        throw new Error('Nonexisting popup type');
    }
  }

  render() { 
    return ( 
      <div
        id="Landscape-container" 
        className="bottom-container full-width"
        style={this.state.zoomIn ?
          {height: '100%', width: '100vw', bottom: this.state.frameOffset} :
          {height: '100%'/*this.state.scaleFactor * C.CANVAS_HEIGHT * 1.5*/, width: this.state.scaleFactor * C.CANVAS_WIDTH}
        }
      >
        <div className="rel-container overflow-hidden">
          <img src={require('../assets/landscape/jiri-shine.png')} className="landscape full-width" id="shining-effect" alt="shining effect" 
               style={{bottom: -this.state.frameOffset}}/>
          <img src={require('../assets/landscape/jiri-head.png')} className="landscape full-width" id="jiri-head" alt="floating head" 
               style={{bottom: -this.state.frameOffset}}/>
          
          <CSSTransition
            in={this.props.currentPage.landscape === 1 && !!this.props.projects[0].book.xOffset}
            classNames="landscape--1"
            mountOnEnter
            unmountOnExit
            timeout={{enter: 1000, exit: 1200}}
            onExited={() => this.setState({animationOngoing: false})}
          >
            <Landscape1 
              scaleFactor={this.state.scaleFactor}
              zoomInCanvas={this.zoomInCanvas}
              zoomOutCanvas={this.zoomOutCanvas}
              zoomIn={this.state.zoomIn}
              scrollDown={this.scrollDown}
            />
          </CSSTransition>
          <CSSTransition
            in={this.props.currentPage.landscape === 2}
            classNames="landscape--2"
            mountOnEnter
            unmountOnExit
            timeout={{enter: 1200, exit: 1000}}
            onExited={() => this.setState({animationOngoing: false})}
          >
            <Landscape2 
              scaleFactor={this.state.scaleFactor}
              landscapeTitle={this.state.landscapeTitle}
              zoomInCanvas={this.zoomInCanvas}
              zoomOutCanvas={this.zoomOutCanvas}
              zoomIn={this.state.zoomIn}
              bottom={this.state.frameOffset}
              scrollDown={this.scrollDown}
            />
          </CSSTransition>

          <CSSTransition
            in={this.props.currentPage.showPopup}
            classNames="popup-window-background"
            unmountOnExit
            timeout={{enter: 700, exit: 500}}
          >
            <div className="popup-window-background" onClick={this.hidePopup}>
              <div className={`popup-window${this.props.currentPage.popup && this.props.currentPage.popup.type === 'text' ? '' : ' popup-window-large'}`}>
                {this.renderPopup()}
              </div>
            </div>
          </CSSTransition>
        </div>

        <CSSTransition
            in={this.props.currentPage.landscape === 2}
            classNames="back-arrow"
            mountOnEnter
            unmountOnExit
            timeout={{enter: 10000, exit: 10000}}
          >
            <img src={require('../assets/back-arrow.png')} alt="back arrow" className="back-arrow" onClick={this.goToProjects} />
          </CSSTransition>
        
        <div className="text-test" id="text-test"/>
        <div className="text-test" id="text-test-2"/>
      </div> 
    );
  }
}

const mapStateToProps = ({projects, currentPage}) => ({projects, currentPage});
 
export default connect(mapStateToProps, {updateWidths, changePage})(LandscapeContainer);