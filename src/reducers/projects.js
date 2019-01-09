import projects from '../assets/projects';
import {UPDATE_WIDTHS} from '../actions/projects';

const defaultState = projects.map((p, i) => ({
  ...p,
  book: {
    yOffset: i,
    xOffset: (Math.random() - 0.5) * 0.25,
    tintDeviation: 10 ** (Math.random() * 0.5),
    width: 1
  }
}));

export default function reducer(state=defaultState, action={}) {
  switch (action.type) {
    case UPDATE_WIDTHS:
      return state.map((p, i) => ({
        ...p,
        book: {
          ...p.book,
          width: action.widths[i], /// moet hier nog de metric stuffen ofzo
          xOffset: p.book.xOffset * action.widths[i] ///dit slaat nog nergens op vgm
        }
      }));
    default:
      return state;
  }
}