import {combineReducers} from 'redux';

import viewLanguage from './viewLanguage';
import githubCode from './githubCode';
import projects from './projects';
import currentPage from './currentPage';

export default combineReducers({
  viewLanguage,
  githubCode,
  projects,
  currentPage
});