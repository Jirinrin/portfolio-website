import React, { Component } from 'react';
import {connect} from 'react-redux';

import {CANVAS_HEIGHT, CANVAS_WIDTH} from './LandscapeContainer';

class Landscape extends Component {
  state = {  };

  componentWillMount() {
  }

  componentDidUpdate(oldProps) {
  }

  render() {
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

          <div id="text-test"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({projects}) => ({projects});

export default connect(mapStateToProps)(Landscape);