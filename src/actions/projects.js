import request from 'superagent';

export const UPDATE_WIDTHS = 'UPDATE_WIDTHS';

export const updateWidths = (widths) => ({
  type: UPDATE_WIDTHS,
  widths
});

export const PROJECT_DESCRIPTIONS_FETCHED = 'PROJECT_DESCRIPTIONS_FETCHED';

const projectDescriptionsFetched = (projectDescriptions=[]) => ({
  type: PROJECT_DESCRIPTIONS_FETCHED,
  projectDescriptions
});

export const fetchProjectDescriptions = (projectsList) => (dispatch) => {
  console.log('hi', projectsList);

  Promise.all(projectsList.map(p => 
    request
    .get(require(`../assets/projects/${p.id}.md`))
    .then(res => res.text))
  )
  .then(res => dispatch(projectDescriptionsFetched(res)));
}