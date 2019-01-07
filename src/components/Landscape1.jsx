import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';

const BOOK_HEIGHT = 35;
const BOOK_WIDTH = 215;
const BOOK_BASE_LEFT = 3690;
const BOOK_BASE_BOTTOM = 4300;

const objectsReference = [
  ['awards-cup',        2811,  3594, 'Awards'],
  ['future-building',   479.5, 3765, 'Future Fantasy'],
  ['hobby-heap',        74,    4377, 'Hobby Heap'],
  ['jiri-soul',         2103,  4330, 'Jiri\'s SOUL'],
  ['octopus-tree',      1321,  4205, 'The Octopus Tree of Life'],
  ['spiral-tower',      4238,  2760, 'Two Sided Miracle'],
  ['technology-forest', 0,     3919, 'Techno Forest'],
  ['book-stack',        null,  null, 'Projects']
];

const getBookStackTop = (size) => BOOK_BASE_BOTTOM - size * BOOK_HEIGHT;

class Landscape extends Component {
  state = {
    objects: [],
    bookStack: [],
    tooltip: null,
    showTooltip: false,
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
          id: obj[0],
          name: obj[3],
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

  showTooltip = (e) => {
    const target = e.target.id ? e.target : e.target.parentNode;

    this.setState({
      showTooltip: true,
      tooltip: {
        contents: target.name,
        left: target.style.left,
        top: parseInt(target.style.top) - target.naturalHeight * 0.6,
        fontSize: + 1 / this.props.scaleFactor + 'rem'
      }
    });
  }
  
  

  hideTooltip = () => this.setState({showTooltip: false});

  popupMessage = (popupMessage) => this.setState({popupMessage});

  popupScreen = (message) => {
    return;
  }

  slideToScreen = (screenName) => {
    return;
  }

  render() {
    const {objects, bookStack, tooltip, showTooltip} = this.state;
    return (
      <div id="landscape-variant-container" 
           className="bottom-container" 
           style={{ 
             transform: `scale(${this.props.scaleFactor}, ${this.props.scaleFactor})`,
             height: 5662, width: 4961
           }}>
        <div className="rel-container">
          <img src={require('../assets/landscape/landscape-1.png')} className="landscape" id="landscape-1" alt="landscape 1" />
          {objects[0] &&
            objects.map(obj => {
              const props = {
                key: obj.id,
                id: obj.id,
                name: obj.name,
                className: 'landscape-object',
                style: {
                  left: obj.left,
                  top:  obj.top,
                },
                onClick: this.handleObjectClick,
                onMouseOver: this.showTooltip,
                onMouseOut: this.hideTooltip
              }
              
              if (obj.id === 'book-stack') {
                return bookStack ? (
                  <div {...props} style={{...props.style, width: obj.width, height: obj.height}}>
                    {
                      bookStack.map((b, i) => 
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
                return <img {...props} src={require(`../assets/landscape/objects/${obj.id}.png`)} alt={obj.id} />
              }
            }
          )}

          <CSSTransition
            in={showTooltip}
            classNames="tooltip"
            unmountOnExit
            timeout={500}
          >
            <p
              className="tooltip"
              style={{
                left: tooltip && tooltip.left,
                top: tooltip && tooltip.top,
                fontSize: tooltip && tooltip.fontSize
              }}
            >
              {tooltip && tooltip.contents}
            </p>
          </CSSTransition>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({projects}) => ({projects});

export default connect(mapStateToProps)(Landscape);