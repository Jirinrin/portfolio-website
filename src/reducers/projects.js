import projects from '../assets/projects';

const defaultState = projects.map((p, i) => ({
  ...p,
  book: {
    yOffset: i,
    xOffset: (Math.random() - 0.5) * 0.25,
    tintDeviation: 10 ** (Math.random() * 0.5)
  }
}));

export default function reducer(state=defaultState, action={}) {
  switch (action.type) {
    default:
      return state;
  }
}