import * as C from '../../constants';
import projects from '../projects';

const objects = {
  'awards-cup': {
    // ook goed: Trophy Tribute
    name: 'Endowment Shrine (construction中)',
    left: 2811, 
    top: 3594,
    hasText: true
  },
  'future-building': {
    name: 'あたしの FUTURE HOME',
    left: 479.5,
    top: 3765,
    hasText: true
  },
  'hobby-heap': {
    name: 'Hobby Heap',
    left: 74, 
    top: 4377,
    hasText: true
  },
  'jiri-soul': {
    name: 'Jiri\'s SOUL',
    left: 2103, 
    top: 4330,
    hasText: true
  },
  'octopus-tree': {
    name: 'The OctoTree of Life',
    left: 1321,
    top: 4205,
    hasText: true
  },
  'spiral-tower': {
    name: 'Pillar of Paradigm',
    left: 4238, 
    top: 2760,
    hasText: true
  },
  'technology-forest': {
    name: 'Techno Forest',
    left: 0, 
    top: 3919,
    hasText: true
  },
  'book-stack': {
    name: 'Stack\'o\'Projects',
    left: C.TINY_BOOK_BASE_LEFT, 
    top: C.getTinyBookStackTop(projects.length),
    width: C.TINY_BOOK_WIDTH,
    height: C.TINY_BOOK_HEIGHT * projects.length,
    hasText: false
  },
  'contact-details': {
    name: 'Search Envelope',
    left: 1247,
    top: 5225,
    hasText: true
  }
};

Object.keys(objects).forEach(id => objects[id].id = id);

export default objects;