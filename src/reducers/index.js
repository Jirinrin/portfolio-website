import {combineReducers} from 'redux';

import viewLanguage from './viewLanguage';
import githubCode from './githubCode';

export default combineReducers({
  viewLanguage,
  githubCode,
});