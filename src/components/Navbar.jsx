import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import {changePage} from '../actions/currentPage';

import './Navbar.scss';

const BASE_Y_OFFSET = window.innerHeight * 0.4;
const BASE_SCALE = 2;

const MIDDLE_THREE_ITEMS = ['about', 'center-name', 'projects']

const NAV_ITEM_REFERENCE = {
  'contact': 'CONTACT',
  'about': 'ABOUT',
  'projects': 'PROJECTS',
  'awards': 'AWARDS',
  'soul': '侍鈴のSOUL',
  'life': 'LIFE',
  'technologies': 'TECHNOLOGIES',
  'passions': 'PASSIONS',
  'programming': 'CODING STYLE',
  'future': 'FUTURE'
}

class Navbar extends Component {
  state = { 
    yOffset: 0,
    scale: 1,
    threshold1: null,
    threshold2: null,
    overlayMode: false,
    showAboutOptions: this.props.showAboutOptions || false
  };

  componentWillMount() {
    this.updateScrollParams();
  }

  componentDidMount() {
    const navBar = document.querySelector('nav');
    navBar.style.width = '10%';
    const navItems = document.querySelectorAll('.nav-item');
    let threshold1 = 0;
    let threshold2 = 0;
    navItems.forEach(li => {
      threshold1 += li.scrollWidth;
      if (MIDDLE_THREE_ITEMS.includes(li.id))
        threshold2 += li.scrollWidth;
    });
    navBar.style.width = '100%';

    this.setState({threshold1, threshold2});

    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', () => this.forceUpdate());
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.addEventListener('resize', () => this.forceUpdate());
  }

  handleResize = (e) => {
    console.log(e.target.innerWidth);
  }
  
  onScroll = (e) => {
    e.preventDefault();
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

  goToPopup = (type, id) => {
    console.log(this.props.abouts);
    this.props.changePage({
      landscape: 1,
      popup: {
        type,
        id,
        text: this.props.abouts[id].text
      },
      forceLoad: true,
    })
    this.setState({overlayMode: false});
  }

  goTo = (content) => {
    this.props.changePage({
      ...content,
      forceLoad: true,
      showPopup: false
    })
    this.setState({overlayMode: false});
  }

  displayForThreshold1 = () => window.innerWidth > this.state.threshold1;
  displayForThreshold2 = () => window.innerWidth > this.state.threshold2;

  toggleAboutOptions = () => this.setState({showAboutOptions: !this.state.showAboutOptions});

  hideOverlay = (e) => {
    if (!e.target.className.includes('nav-overlay')) 
      return;

    this.setState({overlayMode: false});
  }

  renderNavItem(id, onClick, isSubItem=false) {
    return (
      <li id={id} className={`nav-item${isSubItem ? ' sub-nav-item' : ''}`} onClick={onClick}>
        {NAV_ITEM_REFERENCE[id]}
      </li>
    );
  }

  render() {
    return ( 
      <div className="rel-container nav-container">
        <nav>
          {this.displayForThreshold1() && this.renderNavItem('contact', () => this.goToPopup('about', 'contact-details'))}
          {this.displayForThreshold2() && this.renderNavItem('about',   () => this.goTo({landscape: 1}))}
          
          <li 
            onClick={() => this.setState({overlayMode: true})}
            className="nav-item" 
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

          {this.displayForThreshold2() && this.renderNavItem('projects', () => this.goTo({landscape: 2}))}
          {this.displayForThreshold1() && this.renderNavItem('awards',   () => this.goToPopup('text', 'awards-cup'))}
        </nav>

        <CSSTransition
            in={this.state.overlayMode}
            classNames="nav-overlay"
            unmountOnExit
            timeout={400}
          >
            <div className="nav-overlay" onClick={this.hideOverlay}>
              <li className="nav-item" id="nav-overlay-x" onClick={() => this.setState({overlayMode: false})}>
                X 
              </li>
              {this.renderNavItem('contact', () => this.goToPopup('about', 'contact-details'))}
              {this.renderNavItem('about',   () => this.toggleAboutOptions())}
              {this.state.showAboutOptions &&
                <div>
                  {this.renderNavItem('soul',         () => this.goToPopup('about', 'jiri-soul'),         true)}
                  {this.renderNavItem('life',         () => this.goToPopup('about', 'octopus-tree'),      true)}
                  {this.renderNavItem('technologies', () => this.goToPopup('about', 'technology-forest'), true)}
                  {this.renderNavItem('passions',     () => this.goToPopup('about', 'hobby-heap'),        true)}
                  {this.renderNavItem('programming',  () => this.goToPopup('about', 'spiral-tower'),      true)}
                  {this.renderNavItem('future',       () => this.goToPopup('about', 'future-building'),   true)}
                </div>
              }
              {this.renderNavItem('projects', () => this.goTo({landscape: 2}))}
              {this.renderNavItem('awards',   () => this.goToPopup('text', 'awards-cup'))}
              <li className="nav-item" id="nav-filler-bottom" />
            </div>
          </CSSTransition>


        
      </div>
    );
  }
}

const mapStateToProps = ({currentPage, abouts}) => ({currentPage, abouts});

export default connect(mapStateToProps, {changePage})(Navbar);

function mapRange(num, inMin, inMax, outMin, outMax) {
  return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}