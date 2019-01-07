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
  ['technology-forest', 0,    3919],
  ['book-stack',        BOOK_BASE_LEFT, BOOK_BASE_BOTTOM]
];

const getBookStackTop = (size) => BOOK_BASE_BOTTOM - size * BOOK_HEIGHT;

class Landscape extends Component {
  state = {
    objects: [],
    bookStack: [],
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
          left: bs ? BOOK_BASE_LEFT                             : obj[1],
          top: bs ? getBookStackTop(this.props.projects.length) : obj[2],
          width: bs ? BOOK_WIDTH                                : null,
          height: bs ? BOOK_HEIGHT * this.props.projects.length : null
        }
      }),
      bookStack
    });
  }

  componentDidUpdate(oldProps) {
    if (this.props.scaleFactor !== oldProps.scaleFactor) {
      this.setState({
        objects: this.state.objects.map((obj, i) => ({
          ...obj,
        }))
      })
    }
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
      <div id="landscape-variant-container" 
           className="bottom-container" 
           style={{ 
             transform: `scale(${this.props.scaleFactor}, ${this.props.scaleFactor})`,
             height: 5662, width: 4961
           }}>
        <div className="rel-container">
          <img src={require('../assets/landscape/landscape-1.png')} className="landscape" id="landscape-1" alt="landscape 1" />
          {this.state.objects[0] &&
          this.state.objects.map(obj => {
            const props = {
              key: obj.name,
              id: obj.name,
              className: 'landscape-object',
              style: {
                left: obj.left,
                top:  obj.top,
              },
              onClick: this.handleObjectClick
            }
            
            if (obj.name === 'book-stack') {
              return this.state.bookStack ? (
                <div {...props} style={{...props.style, width: obj.width, height: obj.height}}>
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
      </div>
    );
  }
}

const mapStateToProps = ({projects}) => ({projects});

export default connect(mapStateToProps)(Landscape);