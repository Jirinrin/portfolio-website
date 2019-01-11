import React, { Component } from 'react';
import _ from 'lodash';
import './Navbar.scss';

const BASE_Y_OFFSET = window.innerHeight / 2;
const BASE_SCALE = 2;

class Navbar extends Component {
  state = { 
    yOffset: 0,
    scale: 1
  };

  componentWillMount() {
    this.updateScrollParams()
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }
  
  onScroll = (e) => this.updateScrollParams(e.pageY);
  
  updateScrollParams = (scroll) => {
    const yOffset = this.calculateY(scroll);

    this.setState({
      yOffset,
      scale: this.calculateTransform(yOffset)
    });
  }

  calculateY = (scroll = window.pageYOffset) => {
    const offset =  BASE_Y_OFFSET - scroll * 2;
    return offset <= 0 ? 0 : offset;
  }

  calculateTransform = (yOffset) => {
    const scale = mapRange(BASE_Y_OFFSET - yOffset, 0, 500, BASE_SCALE, 1);
    return scale <= 1 ? 1 : scale;
  }

  render() {
    return ( 
      <div className="rel-container">
        <nav>
          <li>ABOUT</li>
          <li>CONTACT</li>
          <li 
            id="center-name"
            style={{
              transform: `translateY(${this.state.yOffset}px)
                          scale(${this.state.scale})`
            }}
          >
            <p>侍鈴々</p>
            <p 
              className="subtitle" 
              style={{
                  opacity: (this.state.yOffset) / BASE_Y_OFFSET
              }}
            >
            Jiri Swen <br/>
            coding individual
            </p>
          </li>
          <li>PROJECTS</li>
          <li>AWARDS</li>
        </nav>
        
      </div>
    );
  }
}
 
export default Navbar;

function mapRange(num, inMin, inMax, outMin, outMax) {
  return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}