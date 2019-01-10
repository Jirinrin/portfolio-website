import request from 'superagent';

import projects from '../assets/projects';
import {UPDATE_WIDTHS, PROJECT_DESCRIPTIONS_FETCHED} from '../actions/projects';

const defaultState = projects.map((p, i) => ({
  ...p,
  book: {
    yOffset: projects.length - 1 - i,
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
          width: action.widths[i],
          xOffset: p.book.xOffset * action.widths[i]
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