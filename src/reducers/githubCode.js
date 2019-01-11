import _ from 'lodash';
import {GITHUB_INDEXED, CODE_FETCHED} from '../actions/githubCode';

export default function reducer(state={indexing: null, code: []}, action={}) {
  switch (action.type) {
    case GITHUB_INDEXED:
      return {
        ...state,
        indexing: action.indexing
      };
    case CODE_FETCHED:
      const newIndexing = _.cloneDeep(state.indexing);
      // console.log(action.code);
      // console.log(newIndexing);
      action.code.forEach(c => {
        newIndexing[c.repo] = newIndexing[c.repo].filter(file => file !== c.filePath);
        if (newIndexing[c.repo].length === 0) 
          delete newIndexing[c.repo];
      });

      return {
        code: [...state.code, ...action.code],
        indexing: newIndexing
      };
    default:
      return state;
  }
}