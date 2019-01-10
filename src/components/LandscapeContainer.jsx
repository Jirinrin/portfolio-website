import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import ReactMarkdown from 'react-markdown';

import {updateWidths} from '../actions/projects';

import Landscape1 from './Landscape1';
import Landscape2 from './Landscape2';

import './Landscape.scss';

export const CANVAS_HEIGHT = 5662;
export const CANVAS_WIDTH  = 4961;

class LandscapeContainer extends Component {
  state = { 
    scaleFactor: 1,
    landscapeNum: 2,
    landscapeTitle: null,
    zoomIn: false,
    animationOngoing: false,
    showPopup: false,
    largePopup: true,
    popupText: null,
    popupProject: null,
    popupType: 'text'
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
        test.style.fontSize = `10000px`;
        test.style.padding = 0;
        test.innerHTML = p.title;
        return (test.clientWidth + 1) / 10000;
      })
    );
  }

  componentDidUpdate(_, oldState) {
    if (!this.state.animationOngoing && oldState.scaleFactor !== this.state.scaleFactor)
      this.updateAnimations(true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = (e) => this.setState({scaleFactor: this.calculateScaleFactor(e.target.innerWidth)});

  calculateScaleFactor = (windowSize = window.innerWidth) => windowSize / CANVAS_WIDTH;

  changeLandscape = (num, title=null) => {
    if (!this.state.animationOngoing)
      this.setState({
        landscapeNum: num,
      });
  }

  updateAnimations(firstDelelete=false) {
    const style = document.createElement('style');
    const container = document.querySelector('#Landscape-container');

    const rules = [];

    const exit1 = 'translate(-100vw, 0)';
    const exit2 = 'translate(100vw, 0)';
    const enter = 'translate(0, 0)';

    const templatePt0 = 'div.landscape-variant-container'
    const templatePt1 = ' { transform: ';
    const templatePt2 = ` scale(${this.state.scaleFactor}, ${this.state.scaleFactor}) !important; }`;
    
    rules.push(templatePt0 + '.landscape--1-enter'                           + templatePt1 + exit1 + templatePt2);
    rules.push(templatePt0 + '.landscape--1-exit.landscape--1-exit-active'   + templatePt1 + exit1 + templatePt2);
    rules.push(templatePt0 + '.landscape--2-enter'                           + templatePt1 + exit2 + templatePt2);
    rules.push(templatePt0 + '.landscape--2-exit.landscape--2-exit-active'   + templatePt1 + exit2 + templatePt2);
    rules.push(templatePt0 + '.landscape--1-enter.landscape--1-enter-active' + templatePt1 + enter + templatePt2);
    rules.push(templatePt0 + '.landscape--1-exit'                            + templatePt1 + enter + templatePt2);
    rules.push(templatePt0 + '.landscape--2-enter.landscape--2-enter-active' + templatePt1 + enter + templatePt2);
    rules.push(templatePt0 + '.landscape--2-exit'                            + templatePt1 + enter + templatePt2);

    rules.forEach(r => style.appendChild(document.createTextNode(r)));

    container.appendChild(style);
  }

  scrollToBottom = () => window.scrollTo(0, 100000); // I know kan robuuster

  zoomInCanvas = () => {
    this.setState({zoomIn: true});
    window.addEventListener('scroll', this.scrollToBottom);
    this.scrollToBottom();
  }

  zoomOutCanvas = () => {
    window.removeEventListener('scroll', this.scrollToBottom);
    this.setState({
      showPopup: false,
      zoomIn: false
    });
  }

  showAboutPopup = (name) => {
    this.setState({
      showPopup: true,
      popupComponent: name,
      popupType: 'about'
    });
  }

  showProjectPopup = (project) => {
    /// doe iets met id: kan in URL ofzo en kan gebruikt worden om github-link te genereren ()
    /// stuur dus markdown naar de state
    /// en maak image gallery aan obv spul ofzo...
    console.log(project);
    this.setState({
      showPopup: true,
      popupProject: project,
      popupType: 'project'
    });
  }

  showPopup = (popupText) => {
    console.log('hi', popupText)
    this.setState({
      showPopup: true,
      popupText,
      popupType: 'text'
    });
  }

  hidePopup = (e) => {
    if (!e.target.className.includes('popup-window-background')) return;
    this.zoomOutCanvas()
  }

  renderPopup() {
    switch (this.state.popupType) {
      case 'text':
        return (
          <ReactMarkdown source={this.state.popupText} />
        );
      case 'about':
        return null;
      case 'project':
        return (
          <div>
            <ReactMarkdown source={this.state.popupProject.description} />
            
            <br/>
            {this.state.popupProject.github && 
              <a>{`https://github.com/Jirinrin/${this.state.popupId}`}</a>
            }
            <br/>
            {this.state.popupProject.images[0] &&
              this.state.popupProject.images.map(img => <img src={require(img)} alt="project img"/>)
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
          {height: '100vh', width: '100vw'} :
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
            onExited={() => this.setState({animationOngoing: false})}
          >
            <Landscape1 
              scaleFactor={this.state.scaleFactor}
              changeLandscape={this.changeLandscape}
              zoomInCanvas={this.zoomInCanvas}
              zoomOutCanvas={this.zoomOutCanvas}
              zoomIn={this.state.zoomIn}
              showPopup={this.showPopup}
              showAboutPopup={this.showAboutPopup}
            />
          </CSSTransition>
          <CSSTransition
            in={this.state.landscapeNum === 2}
            classNames="landscape--2"
            mountOnEnter
            unmountOnExit
            timeout={1000}
            onExited={() => this.setState({animationOngoing: false})}
          >
            <Landscape2 
              scaleFactor={this.state.scaleFactor}
              landscapeTitle={this.state.landscapeTitle}
              changeLandscape={this.changeLandscape}
              zoomInCanvas={this.zoomInCanvas}
              zoomOutCanvas={this.zoomOutCanvas}
              zoomIn={this.state.zoomIn}
              showProjectPopup={this.showProjectPopup}
            />
          </CSSTransition>

          <CSSTransition
            in={this.state.showPopup}
            classNames="popup-window-background"
            unmountOnExit
            timeout={500}
          >
            <div className="popup-window-background" onClick={this.hidePopup}>
              <div className={`popup-window${this.state.popupType === 'text' ? '' : ' popup-window-large'}`}>
                {this.renderPopup()}
              </div>
            </div>
          </CSSTransition>
        </div>
        <div className="text-test" id="text-test"/>
        <div className="text-test" id="text-test-2"/>
      </div> 
    );
  }
}

const mapStateToProps = ({projects}) => ({projects});
 
export default connect(mapStateToProps, {updateWidths})(LandscapeContainer);