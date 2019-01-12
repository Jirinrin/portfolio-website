import * as C from '../../constants';
import projects from '../projects';

const objects = {
  'awards-cup': {
    name: 'Awards',
    left: 2811, 
    top: 3594,
    hasText: true
  },
  'future-building': {
    name: 'Future Fantasy',
    left: 479.5,
    top: 3765,
    hasText: false
  },
  'hobby-heap': {
    name: 'Hobby Heap',
    left: 74, 
    top: 4377,
    hasText: false
  },
  'jiri-soul': {
    name: 'Jiri\'s SOUL',
    left: 2103, 
    top: 4330,
    hasText: true
  },
  'octopus-tree': {
    name: 'The Octopus Tree of Life',
    left: 1321, 
    top: 4205,
    hasText: false
  },
  'spiral-tower': {
    name: 'Two Sided Miracle',
    left: 4238, 
    top: 2760,
    hasText: false
  },
  'technology-forest': {
    name: 'Techno Forest',
    left: 0, 
    top: 3919,
    hasText: false
  },
  'book-stack': {
    name: 'Projects',
    left: C.TINY_BOOK_BASE_LEFT, 
    top: C.getTinyBookStackTop(projects.length),
    width: C.TINY_BOOK_WIDTH,
    height: C.TINY_BOOK_HEIGHT * projects.length,
    hasText: false
  },
  'contact-details': {
    name: 'Find me',
    left: null,
    top: null,
    hasText: false
  }
};

Object.keys(objects).forEach(id => objects[id].id = id);

export default objects;