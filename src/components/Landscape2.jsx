import React, { Component } from 'react';
import {connect} from 'react-redux';

import * as C from '../constants';

import {fetchProjectDescriptions} from '../actions/projects';
import {changePage} from '../actions/currentPage';

class Landscape extends Component {
  state = {
    bookHeight: C.LARGE_BASE_BOOK_HEIGHT,
    openedBook: null,
    bookShadow: null
  };

  componentDidMount() {
    if (!this.props.projects[0].description)
      this.props.fetchProjectDescriptions(this.props.projects);

    this.setBookShadow();
    this.props.scrollDown();
  }

  componentDidUpdate(oldProps, oldState) {
    if (this.state.openedBook !== oldState.openedBook && this.state.openedBook)
      this.props.zoomInCanvas(window.pageYOffset);

    if (this.state.openedBook && this.props.zoomIn !== oldProps.zoomIn && this.props.zoomIn)
      this.zoomInBook();

    if (oldProps.zoomIn !== this.props.zoomIn && !this.props.zoomIn)
      this.setState({openedBook: null});
  }

  getBookStackTop = (size) => `calc(${C.LARGE_BOOK_BASE_BOTTOM}px - ${size * this.state.bookHeight}rem)`;

  getPadding = () => this.state.bookHeight * C.LARGE_BOOK_PADDING_PART;
  
  getCoverFontSize = () => this.state.bookHeight - this.getPadding() * 2;

  getTextWidth = (baseWidth) => baseWidth * this.getCoverFontSize() + this.getPadding() * 2;

  getStackWidthRange = () => {
    const range = [0, 0];
    this.props.projects.forEach(p => {
      if (p.book.xOffset < range[0])
        range[0] = p.book.xOffset;
      if (p.book.xOffset + p.book.width > range[1])
        range[1] = p.book.xOffset + p.book.width;
    });

    return range;
  }

  getStackWidth = () => {
    const range = this.getStackWidthRange();
    return this.getTextWidth(range[1] - range[0]);
  }

  setupBookZoom = (e) => {
    e.preventDefault();
    this.setState({
      openedBook: {
        book: e.currentTarget,
        title: e.currentTarget.getElementsByTagName('p')[0].innerHTML,
        style: {
          left: e.currentTarget.style.left,
          top: e.currentTarget.style.top,
          width: e.currentTarget.style.width,
          height: e.currentTarget.style.height,
        },
        imageFilter:  e.currentTarget.getElementsByTagName('img')[0].style.filter,
      }
    });    
  }

  zoomInBook = () => {
    const zoomBook = document.querySelector('#zooming-book');
    const bookStack = zoomBook.parentNode.parentNode;

    const small = window.innerWidth <= 1400;

    zoomBook.style.left   = `calc(-1 * ${bookStack.style.left} + 2.5vw / ${this.props.scaleFactor})`;
    zoomBook.style.top    = `calc(-1 * ${bookStack.style.top.split('calc')[1]} + ${C.CANVAS_HEIGHT}px - (100vh - ${small ? 7.5 : 2.5}vw) / ${this.props.scaleFactor} - ${this.props.bottom / this.props.scaleFactor}px)`;
    zoomBook.style.width  = `calc(95vw / ${this.props.scaleFactor})`;
    zoomBook.style.height = `calc((100vh - ${small ? 15 : 5}vw) / ${this.props.scaleFactor})`;
    zoomBook.className += ' book--large__zoomed';

    const project = this.props.projects.find(p => p.id === this.state.openedBook.book.id);
    if (!project) return;
    
    this.props.changePage({
      popup: {
        type: 'project',
        project
      }
    });
  }

  setBookShadow = () => this.setState({bookShadow: C.calculateBookShadow('.book--large')});

  render() {
    const {projects, scaleFactor} = this.props;
    const {bookHeight} = this.state;

    return (
      <div id="landscape-variant-container--2" 
           className="bottom-container landscape-variant-container landscape--2"
           style={{ 
             transform: `scale(${scaleFactor}, ${scaleFactor})`, /// al deze scales kunnen best gwn 1x scalefactor hebben, wordt toch gwn uniform
             height: C.CANVAS_HEIGHT, width: C.CANVAS_WIDTH,
             bottom: -this.props.bottom
           }}
      >
        <div className="rel-container">
          <h2 className="landscape-name"> PROJECTS </h2>
          <img src={require('../assets/landscape/landscape-2.png')} className="landscape" id="landscape-2" alt="landscape 2" />

          {/* and yes, the width of the bookstack is inaccurate due to the deviations and stuff */}
          <div 
            id="book-stack--large" 
            style={{
              left: C.LARGE_BOOK_BASE_LEFT,
              top: this.getBookStackTop(projects.length),
              width: this.getStackWidth() + 'rem',
              height: bookHeight * projects.length + 'rem'
            }}
          >
            <div className="rel-container">
              {projects.map((p, i) =>
                <div
                  className="book--large"
                  key={`book--large-${i}`}
                  id={p.id}
                  style={{
                    height: bookHeight*1.01 + 'rem',
                    width: this.getTextWidth(p.book.width) + 'rem',
                    top: p.book.yOffset * bookHeight + 'rem',
                    left: this.getTextWidth(p.book.xOffset) + 'rem'
                  }}
                  onClick={this.setupBookZoom}
                >
                  <div className="rel-container">
                    <img
                      src={require('../assets/box-dark-small.png')}
                      alt="book"
                      className="book--large__background"
                      style={{filter: `brightness(${p.book.tintDeviation})`}}
                    />
                    <p 
                      className="book--large__title"
                      style={{
                        fontSize: this.getCoverFontSize() + 'rem',
                        lineHeight: this.getCoverFontSize() * 1.2 + 'rem',
                      }}
                    >
                      <span className={`${p.book.tintDeviation < 1.5 ? 'dark-background' : (p.book.tintDeviation > 2.5 ? 'white-background' : '')}`}>
                        {p.title}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              {this.state.openedBook && 
                <div 
                  id="zooming-book"
                  className="book--large book--large__zoomed"
                  style={{
                    ...this.state.openedBook.style,
                    height: bookHeight*1.01 + 'rem',
                  }}
                >
                  <div className="rel-container">
                    <img
                      src={require('../assets/box-dark-small.png')}
                      alt="book"
                      className="book--large__background"
                      style={{filter: this.state.openedBook.imageFilter}}
                    />
                  </div>
                </div>
              }
              <div id="shadow-wrapper">
                <svg 
                  viewBox={`0 0 ${this.getStackWidth()} ${bookHeight*projects.length}`} 
                  width={this.getStackWidth()+'rem'} 
                  height={bookHeight*projects.length+'rem'} 
                  id="book-stack-svg">
                  <path d={this.state.bookShadow || null} className="shadow book-stack-shadow--2" fill="black"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({projects}) => ({projects});

export default connect(mapStateToProps, {fetchProjectDescriptions, changePage})(Landscape);