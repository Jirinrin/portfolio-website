import {CODE_FETCHED} from '../actions/githubCode';

export default function reducer(state=[], action={}) {
  switch (action.type) {
    case CODE_FETCHED:
      console.log(state, action);
      return [...state, ...action.code];
    default:
      return state;
  }
}