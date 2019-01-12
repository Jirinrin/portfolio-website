import React, { Component } from 'react';
import {connect} from 'react-redux';

import {changePage} from '../actions/currentPage';

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
  
  onScroll = (e) => {
    this.updateScrollParams(window.pageYOffset);
  }
  
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

  goToPopup = (type, content) => {
    this.props.changePage({
      landscape: 1,
      popup: {
        type,
        ...content
      },
      forceLoad: true,
    })
  }

  goTo = (content) => {
    this.props.changePage({
      ...content,
      forceLoad: true,
      showPopup: false
    });
  }

  render() {
    return ( 
      <div className="rel-container">
        <nav>
          <li onClick={() => this.goToPopup('about', {id: 'contact-details'})}>
            CONTACT
          </li>
          <li onClick={() => this.goTo({landscape: 1})}>
            ABOUT
          </li>
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
            a coding individual
            </p>
          </li>
          <li onClick={() => this.goTo({landscape: 2})}>
            PROJECTS
          </li>
          <li onClick={() => this.goToPopup('text', {text: this.props.abouts['awards-cup'].text})}>
            AWARDS
          </li>
        </nav>
        
      </div>
    );
  }
}

const mapStateToProps = ({currentPage, abouts}) => ({currentPage, abouts});

export default connect(mapStateToProps, {changePage})(Navbar);

function mapRange(num, inMin, inMax, outMin, outMax) {
  return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}