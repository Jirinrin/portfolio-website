import React, { Component } from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {CANVAS_HEIGHT, CANVAS_WIDTH} from './LandscapeContainer';
import {calculateBookShadow} from './Landscape1';

const BASE_BOOK_HEIGHT = 6;
// const BASE_BOOK_WIDTH = 36;
const BOOK_BASE_LEFT = 1540;
const BOOK_BASE_BOTTOM = 4810;

const BOOK_PADDING_PART = 0.15;

class Landscape extends Component {
  state = {
    /// zou nog extra factor toe kunnen voegen ofzo zodat het altijd binnen die ene stip op de grond past...?
    bookHeight: BASE_BOOK_HEIGHT / this.props.scaleFactor,
    openedBook: null,
    bookShadow: null
  };

  componentDidMount() {
    this.setBookShadow();
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldProps.scaleFactor !== this.props.scaleFactor)
      this.setState({
        BOOK_HEIGHT: BASE_BOOK_HEIGHT / this.props.scaleFactor,
      });

    if (this.state.openedBook !== oldState.openedBook && this.state.openedBook)
      this.zoomInBook();

    if (oldProps.zoomIn !== this.props.zoomIn && !this.props.zoomIn)
      this.setState({openedBook: null});
  }

  getBookStackTop = (size) => `calc(${BOOK_BASE_BOTTOM}px - ${size * this.state.bookHeight}rem)`;

  getPadding = () => this.state.bookHeight * BOOK_PADDING_PART;
  
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

    this.props.zoomInCanvas();
    zoomBook.style.left   = `calc(-1 * ${bookStack.style.left} + 5vw / ${this.props.scaleFactor})`;
    /// dit moet uiteindelijk dus wel robuuster zodat het altijd op de plek waar de viewport nu is deze hele toestand aanmaakt
    zoomBook.style.top    = `calc(-1 * ${bookStack.style.top.split('calc')[1]} + ${CANVAS_HEIGHT}px - 95vh / ${this.props.scaleFactor})`;
    zoomBook.style.width  = `calc(90vw / ${this.props.scaleFactor})`;
    zoomBook.style.height = `calc(90vh / ${this.props.scaleFactor})`;
    zoomBook.className += ' book--large__zoomed';

    this.props.showPopup();
  }

  setBookShadow = () => this.setState({bookShadow: calculateBookShadow('.book--large')});

  render() {
    const {projects, scaleFactor} = this.props;
    const {bookHeight} = this.state;

    return (
      <div id="landscape-variant-container--2" 
           className="bottom-container landscape-variant-container landscape--2"
           style={{ 
             transform: `scale(${scaleFactor}, ${scaleFactor})`,
             height: CANVAS_HEIGHT, width: CANVAS_WIDTH
           }}
      >
        <div className="rel-container">
          <img src={require('../assets/landscape/landscape-2.png')} className="landscape" id="landscape-2" alt="landscape 2"
               onClick={() => this.props.changeLandscape(1)} />

          {/* and yes, the width of the bookstack is inaccurate due to the deviations and stuff */}
          <div 
            id="book-stack--large" 
            style={{
              left: BOOK_BASE_LEFT,
              top: this.getBookStackTop(projects.length),
              width: this.getStackWidth() + 'rem',
              height: bookHeight * projects.length + 'rem'
            }}
          >
            <div className="rel-container">
              {projects.map((b, i) =>
                <div
                  className="book--large"
                  key={`book--large-${i}`}
                  style={{
                    height: bookHeight + 'rem',
                    width: this.getTextWidth(b.book.width) + 'rem',
                    top: b.book.yOffset * bookHeight + 'rem',
                    left: this.getTextWidth(b.book.xOffset) + 'rem'
                  }}
                  onClick={this.setupBookZoom}
                >
                  <div className="rel-container">
                    <img
                      src={require('../assets/box-dark.png')}
                      alt="book"
                      className="book--large__background"
                      style={{filter: `brightness(${b.book.tintDeviation})`}}
                    />
                    <p 
                      className="book--large__title"
                      style={{
                        fontSize: this.getCoverFontSize() + 'rem',
                        lineHeight: this.getCoverFontSize() * 1.2 + 'rem',
                      }}
                    >
                      <span className={`${b.book.tintDeviation < 1.5 ? 'dark-background' : (b.book.tintDeviation > 2.5 ? 'white-background' : '')}`}>
                        {b.title}
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
                    height: bookHeight + 'rem',
                  }}
                >
                  <div className="rel-container">
                    <img
                      src={require('../assets/box-dark.png')}
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

export default connect(mapStateToProps)(Landscape);