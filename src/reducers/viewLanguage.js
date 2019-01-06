import {CHANGE_LANGUAGE} from '../actions/viewLanguage';

export default function reducer(state='en-EN', action={}) {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return action.language;
    default:
      return state;
  }
}