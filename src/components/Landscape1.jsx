import React, { Component } from 'react';
import {connect} from 'react-redux';

const BOOK_HEIGHT = 35;
const BOOK_WIDTH = 215;
const BOOK_BASE_LEFT = 3690;
const BOOK_BASE_BOTTOM = 4300;

const objectsReference = [
  ['awards-cup',        2811, 3594],
  ['future-building',   479.5, 3765],
  ['hobby-heap',        74,   4377],
  ['jiri-soul',         2103, 4330],
  ['octopus-tree',      1321, 4205],
  ['spiral-tower',      4238, 2760],
  // ['spiral-tower',      4190, 2718],
  ['technology-forest', 0,    3919],
  ['book-stack',        BOOK_BASE_LEFT, BOOK_BASE_BOTTOM] // x until: 3890 or sth; y is variable, until 4320
];

const getBookStackTop = (size) => BOOK_BASE_BOTTOM - size * BOOK_HEIGHT;

class Landscape extends Component {
  state = {
    objects: [],
    bookStack: [],
    transformOrigin: 'left top',
    toolTip: null,
    popupMessage: null
  };

  componentWillMount() {
    const bookStack = this.props.projects.map((_, i) => {
      return {
        yOffset: BOOK_HEIGHT * i,
        xOffset: (Math.random() - 0.5) * BOOK_WIDTH * 0.25,
        tintDeviation: 10 ** (Math.random() * 0.5),
      }
    })

    this.setState({
      objects: objectsReference.map(obj => {
        const bs = obj[0] === 'book-stack';
        
        return {
          name: obj[0], 
          naturalLeft: bs ? BOOK_BASE_LEFT                             : obj[1],
          naturalTop: bs ? getBookStackTop(this.props.projects.length) : obj[2],
          naturalWidth: bs ? BOOK_WIDTH                                : null,
          naturalHeight: bs ? BOOK_HEIGHT * this.props.projects.length : null
        }
      }),
      bookStack
    });
  }

  componentDidMount() {
    this.setState({
      objects: this.state.objects.map(obj => {
        const img = document.querySelector(`#${obj.name}`);
        if (!img) return obj;
        const naturalWidth  = obj.naturalWidth  || img.naturalWidth;
        const naturalHeight = obj.naturalHeight || img.naturalHeight;

        const xOffset = (naturalWidth - naturalWidth * this.props.scaleFactor) / 2;
        const yOffset = naturalHeight - naturalHeight * this.props.scaleFactor;

        return {
          ...obj,
          xOffset,
          yOffset,
          naturalWidth,
          naturalHeight
        };
      }),
      transformOrigin: 'center bottom'
    }, 
    this.initializeHoverEffects);

    objectsReference.forEach(obj => {
      document.querySelector(`#${obj.name}`)
    });

    this.updateAnimations();
  }

  componentDidUpdate(oldProps) {
    if (this.props.scaleFactor !== oldProps.scaleFactor) {
      this.setState({
        objects: this.state.objects.map((obj, i) => ({
          ...obj,
          xOffset: (obj.naturalWidth - obj.naturalWidth * this.props.scaleFactor) / 2,
          yOffset: obj.naturalHeight - obj.naturalHeight * this.props.scaleFactor
        }))
      })
    }
    this.updateAnimations(true);
  }

  initializeHoverEffects() {
    // const styleSheet = document.styleSheets[1];
    const style = document.createElement('style');
    this.state.objects.forEach(obj => {
      const css = `#${obj.name}:hover {
        animation-name: ${obj.name}-boing; 
        animation-timing-function: ease-in-out; 
        animation-duration: 0.5s; 
        animation-iteration-count: infinite;
      }`;
      style.appendChild(document.createTextNode(css));

    })
    document.querySelector('.Landscape').appendChild(style);
  }

  updateAnimations(firstDelelete=false) {
    const styleSheet = document.styleSheets[0];

    this.state.objects.forEach((obj, i) => {
      if (firstDelelete) styleSheet.deleteRule(i);
      const keyframes = 
        `@keyframes ${obj.name}-boing {
          50% { transform: scale(${this.props.scaleFactor}, ${this.props.scaleFactor * 1.1}) }
        }`;
      styleSheet.insertRule(keyframes, i);
    });
  }

  handleObjectClick = (e) => {
    const id = e.target.id || e.target.parentNode.id;
    switch (id) {
      case 'awards-cup':
        this.popupMessage('Awards still under construction')
        return;
      case 'future-building':
      case 'hobby-heap':
      case 'jiri-soul':
      case 'octopus-tree':
      case 'spiral-tower':
      case 'technology-forest':
        this.popupScreen(id);
        return;
      case 'book-stack':
        this.slideToScreen(id);
        return;
      default:
        throw new Error('id of the thing you clicked on seems invalid');
    }
  }

  showToolTip = () => {
    return;
  }

  hideToolTip = () => {
    return;
  }

  popupMessage = (popupMessage) => this.setState({popupMessage});

  popupScreen = (message) => {
    return;
  }

  slideToScreen = (screenName) => {
    return;
  }

  render() { 
    return (      
      // niet zo handig met 2x classname landscape
      <div className="Landscape">
        <img src={require('../assets/landscape/landscape-1.png')} className="full-width-landscape" id="landscape-1" alt="landscape 1" />
        {this.state.objects[0] &&
        this.state.objects.map(obj => {
          const props = {
            key: obj.name,
            id: obj.name,
            className: 'landscape-object',
            style: {
              left: obj.naturalLeft * this.props.scaleFactor - (obj.xOffset || 0),
              top:  obj.naturalTop  * this.props.scaleFactor - (obj.yOffset || 0),
              transform: `scale(${this.props.scaleFactor}, ${this.props.scaleFactor})`,
              transformOrigin: this.state.transformOrigin,
            },
            onClick: this.handleObjectClick
          }
          
          if (obj.name === 'book-stack') {
            console.log(obj.yOffset);
            return this.state.bookStack ? (
              <div {...props} style={{...props.style, width: obj.naturalWidth, height: obj.naturalHeight}}>
                {
                  this.state.bookStack.map((b, i) => 
                    <img 
                      src={require('../assets/box-dark.png')} 
                      className="book--tiny" 
                      key={`book-${i}`} 
                      alt="book"
                      style={{
                        height: BOOK_HEIGHT,
                        width: BOOK_WIDTH,
                        bottom: b.yOffset,
                        left: b.xOffset,
                        filter: `brightness(${b.tintDeviation})`
                      }}
                    />)
                }
              </div>
            ) : null;
          }
          else {
            return <img {...props} src={require(`../assets/landscape/objects/${obj.name}.png`)} alt={obj.name} />
          }
        }
        )}
      </div>
    );
  }
}

const mapStateToProps = ({projects}) => ({projects});

export default connect(mapStateToProps)(Landscape);