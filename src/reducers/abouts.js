import _ from 'lodash';

import objects from '../assets/objects';
import {ABOUT_TEXTS_FETCHED} from '../actions/abouts';

export default function reducer(state=objects, action={}) {
  switch (action.type) {
    case ABOUT_TEXTS_FETCHED:
      return _.merge(state, action.abouts)
    default:
      return state;
  }
}