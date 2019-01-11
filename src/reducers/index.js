import {combineReducers} from 'redux';

import viewLanguage from './viewLanguage';
import githubCode from './githubCode';
import projects from './projects';

export default combineReducers({
  viewLanguage,
  githubCode,
  projects
});