import {combineReducers} from 'redux';

import viewLanguage from './viewLanguage';
import githubCode from './githubCode';
import projects from './projects';
import currentPage from './currentPage';
import abouts from './abouts';

export default combineReducers({
  viewLanguage,
  githubCode,
  projects,
  currentPage,
  abouts
});