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

  calculateScaleFactor = (windowSize = window.innerWidth) => windowSize / 4961;

  render() { 
    return ( 
      <div id="Landscape-container" className="bottom-container full-width" style={{height: this.state.scaleFactor * 5662, width: this.state.scaleFactor * 4961}}>
        <div className="rel-container">
          <h2>About me</h2>
          <img src={require('../assets/landscape/jiri-shine.png')} className="landscape full-width" id="shining-effect" alt="shining effect" />
          <img src={require('../assets/landscape/jiri-head.png')} className="landscape full-width" id="jiri-head" alt="floating head" />
          <Landscape1 scaleFactor={this.state.scaleFactor} />
        </div>
      </div> 
    );
  }
}
 
export default LandscapeContainer;