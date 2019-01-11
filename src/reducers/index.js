import {combineReducers} from 'redux';

import viewLanguage from './viewLanguage';
import githubIndexing from './githubIndexing';
import githubCode from './githubCode';
import projects from './projects';

export default combineReducers({
  viewLanguage,
  githubIndexing,
  githubCode,
  projects
});