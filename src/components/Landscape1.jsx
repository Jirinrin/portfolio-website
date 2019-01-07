import React, { Component } from 'react';

const objectsReference = [
  ['awards-cup',        2811, 3594],
  ['future-building',   479.5, 3765],
  ['hobby-heap',        74,   4377],
  ['jiri-soul',         2103, 4330],
  ['octopus-tree',      1321, 4205],
  ['spiral-tower',      4238, 2760],
  ['technology-forest', 0,    3919]
];

class Landscape extends Component {
  state = {
    objects: [],
    transformOrigin: 'left top'
  };

  componentWillMount() {
    this.setState({
      objects: objectsReference.map(obj => ({
        name: obj[0], 
        left: obj[1] * this.props.scaleFactor, 
        top: obj[2] * this.props.scaleFactor})),
        naturalWidth: null,
        naturalHeight: null
    });
  }

  componentDidMount() {
    this.setState({
      objects: this.state.objects.map(obj => {
        const img = document.querySelector(`#${obj.name}`);
        if (!img) return obj;
        const xOffset = (img.naturalWidth - img.naturalWidth * this.props.scaleFactor) / 2;
        const yOffset = img.naturalHeight - img.naturalHeight * this.props.scaleFactor;
        console.log(xOffset, yOffset);
        return {
          ...obj,
          xOffset,
          yOffset,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        };
      }),
      transformOrigin: 'center bottom'
    });

    objectsReference.forEach(obj => {
      document.querySelector(`#${obj.name}`)
    });
  }

  componentDidUpdate(oldProps) {
    if (this.props.scaleFactor !== oldProps.scaleFactor) {
      console.log('yooo');
      this.setState({
        objects: this.state.objects.map((obj, i) => ({
          ...obj,
          left: objectsReference[i][1] * this.props.scaleFactor,
          top: objectsReference[i][2] * this.props.scaleFactor,
          xOffset: (obj.naturalWidth - obj.naturalWidth * this.props.scaleFactor) / 2,
          yOffset: obj.naturalHeight - obj.naturalHeight * this.props.scaleFactor
        }))
      })
    }
  }

  render() { 
    console.log('yo');

    return (
      
      <div className="Landscape">
        <img src={require('../assets/landscape/landscape-1.png')} className="full-width-landscape" id="landscape-1" alt="landscape 1" />
        {this.state.objects[0] &&
        this.state.objects.map(obj =>
          <img key={obj.name} src={require(`../assets/landscape/objects/${obj.name}.png`)} className="landscape-object" id={obj.name} alt={obj.name}
               style={{
                 left: obj.left - (obj.xOffset || 0),
                 top: obj.top - (obj.yOffset || 0),
                 transform: `scale(${this.props.scaleFactor}, ${this.props.scaleFactor})`,
                 transformOrigin: this.state.transformOrigin,
               }}
          />
        )}
      </div>
    );
  }
}

export default Landscape;