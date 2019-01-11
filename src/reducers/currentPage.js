import {CHANGE_PAGE} from '../actions/currentPage';

export default function reducer(state='landscape-1', action={}) {
  switch (action.type) {
    case CHANGE_PAGE:
      return action.pageName;
    default:
      return state;
  }
}