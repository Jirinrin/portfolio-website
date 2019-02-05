import request from 'superagent';
import _ from 'lodash';

const USER_NAME    = 'Jirinrin';
const BASE_URL     = `https://api.github.com/repos/${USER_NAME}`;
const BASE_URL_RAW = `https://raw.githubusercontent.com/${USER_NAME}`;
const INDEX_DEPTH = 3;
const ALLOWED_FILE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'html', 'java', 'json', 'c', 'cpp', 'h', 'cs', 'py', 'lua', 'md', 'txt'];

export const GITHUB_INDEXED = 'GITHUB_INDEXED';

const githubIndexed = (indexing={}) => ({
  type: GITHUB_INDEXED,
  indexing
});

export const indexGithub = () => async (dispatch, getState) => {
  const indexing = {}
  const projects = getState().projects;
  if (!projects)
    return;
  
  await Promise.all(
    projects.map(async p => {
      if (!p.github)
        return;
      
      const treeSha = await request
                            .get(`${BASE_URL}/${p.id}/branches/master`)
                            .then(res => res.body.commit.commit.tree.sha);

      const paths = await request
                          .get(`${BASE_URL}/${p.id}/git/trees/${treeSha}?recursive=${INDEX_DEPTH}`)
                          .then(res => res.body.tree.filter(obj => obj.type === 'blob' && obj.size < 10000 && ALLOWED_FILE_EXTENSIONS.find(ext => obj.path.endsWith(`.${ext}`)))
                                                    .map(obj => obj.path)
                          );
      indexing[p.id] = paths;
    })
  );

  dispatch(githubIndexed(indexing));
}


export const CODE_FETCHED = 'CODE_FETCHED';

const codeFetched = (code=[]) => ({
  type: CODE_FETCHED,
  code
});

export const loadGithubCode = (allProjects=false, numberOfProjects=1) => async (dispatch, getState) => {
  const projects = getState().projects;
  const indexing = getState().githubCode.indexing;
  if (!projects || !indexing)
    return;
  
  if (allProjects) {
    Promise.all(
      _.shuffle(
        projects.filter(p => p.github)
      )
      .filter((_, i) => i < numberOfProjects)
      .map(async p => {
        const filePath = indexing[p.id][Math.round(Math.random() * (indexing[p.id].length) - 0.5)];
        return request
               .get(`${BASE_URL_RAW}/${p.id}/master/${filePath}`)
               .then(res => ({repo: p.id, filePath, code: res.text}));
      })
    )
    .then(code => dispatch(codeFetched(code)));
  }
  else {
    const repo = Object.keys(indexing)[Math.round(Math.random() * Object.values(indexing).length - 0.5)];
    const filePath = indexing[repo][Math.round(Math.random() * indexing[repo].length - 0.5)];

    request
    .get(`${BASE_URL_RAW}/${repo}/master/${filePath}`)
    .then(res =>  [{repo, filePath, code: res.text}])
    .then(code => dispatch(codeFetched(code)));
  }
}