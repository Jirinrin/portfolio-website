import projects from '../assets/projects';
import {UPDATE_WIDTHS, PROJECT_DESCRIPTIONS_FETCHED} from '../actions/projects';

const BOOK_STACK_WIDTH_LIMIT = 9;// * (window.innerHeight / 1920);
const MINIMUM_BOOK_OVERLAP = 1.5;

const defaultState = projects.map((p, i) => ({
  ...p,
  book: {
    yOffset: projects.length - 1 - i,
    tintDeviation: 10 ** (Math.random() * 0.5),
    width: 1
  }
}));

const getXOffsets = (widths) => {
  const offsets = [];

  widths.forEach((width, i) => {
    if (i === 0)
      offsets.push(-width/2);
    else {
      let range = [offsets[i-1] - width + MINIMUM_BOOK_OVERLAP, widths[i-1] + offsets[i-1] - MINIMUM_BOOK_OVERLAP];
      if (range[0] < -BOOK_STACK_WIDTH_LIMIT)
        range[0] = -BOOK_STACK_WIDTH_LIMIT;
      if (range[1] + width > BOOK_STACK_WIDTH_LIMIT)
        range[1] = BOOK_STACK_WIDTH_LIMIT - width;

      const newOffset = Math.random() * (range[1]-range[0]) + range[0];
      offsets.push(newOffset);
    }
  });
  return offsets;
}

export default function reducer(state=defaultState, action={}) {
  switch (action.type) {
    case UPDATE_WIDTHS:
      const xOffsets = getXOffsets(action.widths);
      return state.map((p, i) => ({
        ...p,
        book: {
          ...p.book,
          width: action.widths[i],
          xOffset: xOffsets[i]
        }
      }));
    case PROJECT_DESCRIPTIONS_FETCHED:
      return state.map((p, i) => ({
        ...p,
        description: action.projectDescriptions[i]
      }));
    default:
      return state;
  }
}