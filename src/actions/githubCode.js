// import request from 'superagent';

// const baseUrl = 'http://localhost:4000';

export const CODE_FETCHED = 'CODE_FETCHED';

const codeFetched = (code=[]) => ({
  type: CODE_FETCHED,
  code
});

export const loadGithubCode = () => (dispatch) => {
  dispatch(codeFetched());
  // request
  //   .get(`${baseUrl}/events/${eventId}/code`)
  //   .then(response => dispatch(codeFetched(response.body.code)))
  //   .catch(console.error);
}