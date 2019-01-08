import React, { Component } from 'react';
import {connect} from 'react-redux';

import {CANVAS_HEIGHT, CANVAS_WIDTH} from './LandscapeContainer';

const BOOK_HEIGHT = 175;
const BOOK_WIDTH = 1075;
const BOOK_BASE_LEFT = 1540;
const BOOK_BASE_BOTTOM = 4810;

const getBookStackTop = (size) => BOOK_BASE_BOTTOM - size * BOOK_HEIGHT;

class Landscape extends Component {
  state = {  };

  componentWillMount() {
  }

  componentDidUpdate(oldProps) {
  }

  getCoverFontSize = () => BOOK_HEIGHT * 0.7;

  getTextWidth = (text, fontSize) => {
    console.log(text, fontSize);
    const test = document.getElementById("text-test");
    if (!test) return null;
    test.style.fontSize = `${fontSize}px`;
    test.innerHTML = text;
    console.log(test);
    return test.clientWidth + 1;
  }

  render() {
    const {projects} = this.props;
    return (
      <div id="landscape-variant-container" 
           className="bottom-container landscape--2" 
           style={{ 
             transform: `scale(${this.props.scaleFactor}, ${this.props.scaleFactor})`,
             height: CANVAS_HEIGHT, width: CANVAS_WIDTH
           }}>
        <div className="rel-container">
          <img src={require('../assets/landscape/landscape-2.png')} className="landscape" id="landscape-2" alt="landscape 2"
               onClick={() => this.props.changeLandscape(1)} />

          {/* and yes, the width of the bookstack is inaccurate due to the deviations and stuff */}
          <div 
            id="book-stack--large" 
            style={{
              left: BOOK_BASE_LEFT,
              top: getBookStackTop(projects.length),
              width: BOOK_WIDTH,
              height: BOOK_HEIGHT * projects.length
            }}
          >
            <div className="rel-container">
              {projects.map((b, i) =>
                <div
                  className="book--large"
                  key={`book--large-${i}`}
                  style={{
                    height: BOOK_HEIGHT,
                    width: this.getTextWidth(b.title, this.getCoverFontSize()) || BOOK_WIDTH,
                    bottom: b.book.yOffset * BOOK_HEIGHT,
                    left: b.book.xOffset * BOOK_WIDTH,
                    filter: `brightness(${b.book.tintDeviation})`
                  }}
                >
                  <div className="rel-container">
                    <img
                      src={require('../assets/box-dark.png')}
                      alt="book"
                      className="book--large__background"
                    />
                    <p className="book--large__title" style={{fontSize: this.getCoverFontSize()}}>
                      {b.title}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({projects}) => ({projects});

export default connect(mapStateToProps)(Landscape);