import * as C from '../../constants';
import projects from '../projects';
import {isMobile} from 'react-device-detect';

const objects = {
  'awards-cup': {
    // Also possible: Trophy Tribute
    name: 'Endowment Shrine (construction中)',
    left: 2731, 
    top: 3542,
    hasText: true,
    extension: 'png'
  },
  'future-building': {
    name: 'あたしの FUTURE HOME',
    left: 479.5,
    top: 3765,
    hasText: true,
    extension: isMobile ? 'png' : 'gif'
  },
  'hobby-heap': {
    name: 'Hobby Heap',
    left: 74, 
    top: 4377,
    hasText: true,
    extension: 'png'
  },
  'jiri-soul': {
    name: 'Jiri\'s SOUL',
    left: 2103, 
    top: 4330,
    width: 207 * C.CANVAS_SCALE,
    height: 232 * C.CANVAS_SCALE,
    hasText: true,
    extension: 'png'
  },
  'octopus-tree': {
    name: 'The OctoTree of Life',
    left: 1321,
    top: 4205,
    hasText: true,
    extension: isMobile ? 'png' : 'gif'
  },
  'spiral-tower': {
    name: 'Pillar of Paradigm',
    left: 4238, 
    top: 2760,
    hasText: true,
    extension: isMobile ? 'png' : 'gif'
  },
  'technology-forest': {
    name: 'Techno Forest',
    left: 0, 
    top: 3919,
    hasText: true,
    extension: 'png'
  },
  'book-stack': {
    name: 'Stack \'o\' Projects',
    left: C.TINY_BOOK_BASE_LEFT,
    top: C.getTinyBookStackTop(projects.length),
    width: C.TINY_BOOK_WIDTH * C.CANVAS_SCALE,
    height: C.TINY_BOOK_HEIGHT * C.CANVAS_SCALE * projects.length,
    hasText: false,
    extension: 'png'
  },
  'contact-details': {
    name: 'Search Envelope',
    left: 1247,
    top: 5225,
    hasText: true,
    extension: 'png'
  }
};

Object.keys(objects).forEach(id => objects[id].id = id);
Object.values(objects).forEach(obj => {
  /// Maybe change this up as it's kinda unprofessional to do it through reference like this
  obj.left = obj.left * C.CANVAS_SCALE;
  obj.top = obj.top * C.CANVAS_SCALE;
});

export default objects;