import {CHANGE_PAGE} from '../actions/currentPage';

const startPage = {
  landscape: 1,
  popup: null,
  showPopup: false,
  forceLoad: null
};

export default function reducer(state=startPage, action={}) {
  switch (action.type) {
    case CHANGE_PAGE:
      return {
        ...state,
        ...action.page
      };
    default:
      return state;
  }
}