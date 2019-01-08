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
                <div>
                  <img 
                  src={require('../assets/box-dark.png')}
                  className="book--large"
                  key={`book--large-${i}`}
                  alt="book"
                  style={{
                    height: BOOK_HEIGHT,
                    width: BOOK_WIDTH,
                    bottom: b.book.yOffset * BOOK_HEIGHT,
                    left: b.book.xOffset * BOOK_WIDTH,
                    filter: `brightness(${b.book.tintDeviation})`
                  }}
                />
                </div>
                
                
              )}
            </div>
            
          </div>

          <div id="text-test"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({projects}) => ({projects});

export default connect(mapStateToProps)(Landscape);