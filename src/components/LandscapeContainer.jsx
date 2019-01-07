import React, { Component } from 'react';
import Landscape1 from './Landscape1';

import './Landscape.scss';

class LandscapeContainer extends Component {
  state = { 
    scaleFactor: 1
  }

  componentWillMount() {
    this.setState({
      scaleFactor: this.calculateScaleFactor()
    }, () => window.addEventListener('resize', this.handleResize));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = (e) => {
    console.log(e.target.innerWidth, window.innerWidth);
    this.setState({scaleFactor: this.calculateScaleFactor(e.target.innerWidth)});
  }

  // calculateScaleFactor = (windowSize = window.innerWidth) => windowSize / 4961;
  calculateScaleFactor = (windowSize = window.innerWidth) => windowSize / 5000;

  render() { 
    return ( 
      <div className="Landscape">
        <h2>About me</h2>
        <img src={require('../assets/landscape/jiri-shine.png')} className="full-width-landscape" id="shining-effect" alt="shining effect" />
        <img src={require('../assets/landscape/jiri-head.png')} className="full-width-landscape" id="jiri-head" alt="floating head" />
        <Landscape1 scaleFactor={this.state.scaleFactor} />
      </div> 
    );
  }
}
 
export default LandscapeContainer;