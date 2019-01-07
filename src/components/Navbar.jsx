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
    this.setState({
      yOffset: this.calculateY(),
      scale: this.calculateTransform()
    });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = (e) => {
    this.setState({
      yOffset: this.calculateY(e.pageY),
      scale: this.calculateTransform()
    });
  }

  calculateY = (scroll = window.pageYOffset) => {
    const offset =  BASE_Y_OFFSET - scroll * 2;
    return offset <= 0 ? 0 : offset;
  }

  calculateTransform = () => {
    const scale = mapRange(BASE_Y_OFFSET - this.state.yOffset, 0, 500, BASE_SCALE, 1);
    
    // scroll / BASE_Y_OFFSET;
    return scale <= 1 ? 1 : scale;
  }

  render() {
    return ( <nav>
      <li>ABOUT</li>
      <li>CONTACT</li>
      <li 
        id="center-name"
        style={{
          transform: `translateY(${this.state.yOffset}px)
                      scale(${this.state.scale}, ${this.state.scale})`
        }}
      >ーJIRIー</li>
      <li>PROJECTS</li>
      <li>AWARDS</li>
    </nav> );
  }
}
 
export default Navbar;

function mapRange(num, inMin, inMax, outMin, outMax) {
  return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}