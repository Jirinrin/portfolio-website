import request from 'superagent';

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
  
  console.log(projects);

  await Promise.all(
    projects.map(async p => {
      if (!p.github)
        return;
      
      console.log(p);

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

  let lengthCounter = 0;
  dispatch(
    githubIndexed({
      indexing,
      lengthReference: Object.entries(indexing).map(kv => {
        lengthCounter += kv[1].length;
        return [kv[0], lengthCounter];
      })
    })
  );
}


export const CODE_FETCHED = 'CODE_FETCHED';

const codeFetched = (code=[]) => ({
  type: CODE_FETCHED,
  code
});

export const loadGithubCode = (allProjects=false) => async (dispatch, getState) => {
  const projects = getState().projects;
  const indexing = getState().githubIndexing.indexing;
  if (!projects || !indexing)
    return;
  
  if (allProjects) {
    Promise.all(
      projects
      .filter(p => p.github)
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
    const lengths = getState().githubIndexing.lengthReference;
    console.log(lengths);
    const index = Math.round(Math.random() * lengths[lengths.length - 1][1] - 0.5);
    console.log(index);
    for (let i = 0; i < lengths.length; i++) {
      if (index < lengths[i][1]) {
        const repo = lengths[i][0];
        const filePath = indexing[repo][index - (i === 0 ? 0 : lengths[i-1][1])];

        request
        .get(`${BASE_URL_RAW}/${repo}/master/${filePath}`)
        .then(res =>  [{repo, filePath, code: res.text}])
        .then(code => dispatch(codeFetched(code)));
      break;
      }
    }
  }
}