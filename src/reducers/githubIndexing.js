import {GITHUB_INDEXED} from '../actions/githubCode';

export default function reducer(state=null, action={}) {
  switch (action.type) {
    case GITHUB_INDEXED:
      return action.indexing;
    default:
      return state;
  }
}