import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import ReactMarkdown from 'react-markdown';
import ImageGallery from 'react-image-gallery';

import * as C from '../constants';
import {SITE_NAME} from '../assets/SITE_NAME';

import {updateWidths} from '../actions/projects';
import {changePage} from '../actions/currentPage';

import Landscape1 from './Landscape1';
import Landscape2 from './Landscape2';

import './Landscape.scss';
import 'react-image-gallery/styles/scss/image-gallery.scss';

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
      this.scrollDown(true);

      const {popup} = this.props.currentPage;
      const {popup: oldPopup} = oldProps.currentPage;

      if (!this.state.zoomIn && popup && 
          (!oldPopup 
            || popup.id !== oldPopup.id 
            || (this.props.currentPage.showPopup !== oldProps.currentPage.showPopup && this.props.currentPage.showPopup)) &&
          (popup.type === 'about' || popup.type === 'text')) {
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
    const style = document.createElement('style');
    const container = document.querySelector('#Landscape-container');

    const rules = [];

    const exit1 = 'translate(-100vw, 0)';
    const exit2 = 'translate(100vw, 0)';
    const enter = 'translate(0, 0)';

    const templatePt0 = 'div.landscape-variant-container'
    const templatePt1 = ' { transform: ';
    const templatePt2 = ` scale(${this.state.scaleFactor}) !important; }`;
    
    rules.push(templatePt0 + '.landscape--1-enter'                           + templatePt1 + exit1 + templatePt2);
    rules.push(templatePt0 + '.landscape--1-exit.landscape--1-exit-active'   + templatePt1 + exit1 + templatePt2);
    // rules.push(templatePt0 + '.landscape--2-enter'                           + templatePt1 + exit2 + templatePt2);
    rules.push(templatePt0 + '.landscape--2-exit.landscape--2-exit-active'   + templatePt1 + exit2 + templatePt2);
    rules.push(templatePt0 + '.landscape--1-enter.landscape--1-enter-active' + templatePt1 + enter + templatePt2);
    rules.push(templatePt0 + '.landscape--1-exit'                            + templatePt1 + enter + templatePt2);
    // rules.push(templatePt0 + '.landscape--2-enter.landscape--2-enter-active' + templatePt1 + enter + templatePt2);
    rules.push(templatePt0 + '.landscape--2-exit'                            + templatePt1 + enter + templatePt2);

    rules.forEach(r => style.appendChild(document.createTextNode(r)));

    container.appendChild(style);
  }

  scrollTo = (offset=0, callback) => {
    window.scrollTo({top: C.getBottomScrollPos() - offset, left: 0, behavior: 'auto'});
    setTimeout(callback, 1000);
  }

  scrollDown = (smooth=false, callback) => {
    window.scrollTo({top: C.getBottomScrollPos(), left: 0, behavior: smooth ? 'smooth' : 'auto'});
    setTimeout(callback, 100);
  }

  scrollToFrameOffset = () => this.scrollTo(this.state.frameOffset);

  getBottomOffset = (scroll) => {
    if (!scroll) return 0;

    return (C.getDocHeight() - scroll - window.innerHeight);
  }

  zoomInCanvas = (scroll=undefined) => {
    const bottomOffset = this.getBottomOffset(scroll);
    this.setState({
      zoomIn: true,
      frameOffset: bottomOffset
    },
    () => {
      if (bottomOffset === 0)
        this.scrollTo(bottomOffset, () => window.addEventListener('scroll', this.scrollToFrameOffset));
      else {
        this.scrollTo(bottomOffset)
        window.addEventListener('scroll', this.scrollToFrameOffset);
      }
    });
  }

  zoomOutCanvas = () => {
    window.removeEventListener('scroll', this.scrollToFrameOffset);
    setTimeout(() => window.removeEventListener('scroll', this.scrollToFrameOffset), 1000);

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

  setPageName = (customName=null) => {
    if (customName)
    document.title = `${customName} | ${SITE_NAME}`;
    else if (this.props.currentPage.landscape === 2)
      document.title = `Projects | ${SITE_NAME}`;
    else if (window.pageYOffset / C.getBottomScrollPos() > 0.6)
      document.title = `About | ${SITE_NAME}`
    else
      document.title = SITE_NAME;
  }

  getExperienceLevel(className) {
    if (!className)
      return null;
    if (className.includes('icon-dark'))
      return 'Ample';
    if (className.includes('icon-middle'))
      return 'Enough';
    if (className.includes('icon-light'))
      return 'Little';
  }

  renderPopup() {
    const {popup} = this.props.currentPage
    if (!popup)
      return null;

    switch (popup.type) {
      case 'text':
      case 'about':
        return (
          <ReactMarkdown 
            source={popup.text} 
            linkTarget={'_blank'}
            renderers={{
              image: props =>
                <img 
                  src={require(`../assets/objects/images/${props.src}`)}
                  className={props.alt}
                  alt={props.src.split('/').reverse()[0]}
                  title={popup.id === 'technology-forest' ? `${props.title} | ${this.getExperienceLevel(props.alt)} experience` : null}
                />,
             link: props => 
                <a 
                  href={props.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => window.open(props.href, '_blank')}
                > 
                  {props.children}
                </a>
            }}
          />
        );
      case 'project':
        return (
          <div>
            {popup.project.github && 
              <a 
                className="github-icon" 
                /// Something seems to be wrong with the hrefs for this...
                href={`https://github.com/Jirinrin/${popup.project.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => window.open(`https://github.com/Jirinrin/${popup.project.id}`, '_blank')}
              >
                <img src={require('../assets/objects/images/github.png')} alt={'github icon'}/>
              </a>
            }
            <ReactMarkdown 
              source={popup.project.description}
              linkTarget={'_blank'}
              renderers={{
                link: props => 
                  <a 
                    href={props.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => window.open(props.href, '_blank')}
                  > 
                    {props.children}
                  </a>
              }}
            />
            
            <br/>
            
            <br/>
            {popup.project.images[0] &&
              <ImageGallery 
                items={popup.project.images.map(img => ({
                  original: require(`../assets/projects/images/${img}`)
                }))}
                showFullscreenButton={false}
                autoplay={false}
                showPlayButton={false}
                showThumbnails={false}
              />

              // popup.project.images.map(img => <img key={img} src={require(`../assets/projects/images/${img}`)} alt="project img"/>)
            }
          </div>
        );
      default:
        throw new Error('Nonexisting popup type');
    }
  }

  render() {
    this.setPageName();
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
          <img 
            src={require('../assets/landscape/shine-3.png')} 
            className="landscape full-width" 
            id="shining-effect" alt="shining effect" 
            style={{
              bottom: -this.state.frameOffset - (C.CANVAS_HEIGHT / C.CANVAS_WIDTH) * window.innerWidth * 0.27
            }}
          />
          <img 
            src={require('../assets/landscape/sunrays.png')} 
            className="landscape full-width" 
            id="sunrays" alt="sunrays" 
            style={{
              bottom: -this.state.frameOffset - (C.CANVAS_HEIGHT / C.CANVAS_WIDTH) * window.innerWidth * 0.27
            }}
          />
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
              setPageName={this.setPageName}
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