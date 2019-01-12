import request from 'superagent';

export const ABOUT_TEXTS_FETCHED = 'ABOUT_TEXTS_FETCHED';

const aboutTextsFetched = (abouts={}) => ({
  type: ABOUT_TEXTS_FETCHED,
  abouts
});

export const fetchAboutTexts = () => async (dispatch, getState) => {
  const abouts = getState().abouts;
  if (!abouts) 
    return;

  const newAbouts = {};

  await Promise.all(
    Object.values(abouts)
    .filter(about => about.hasText)
    .map(about => 
      request
      .get(require(`../assets/objects/${about.id}.md`))
      .then(res => {
        if (res.text) newAbouts[about.id] = {text: res.text};
      })
      .catch(console.error)
  ))
  .catch(console.error);

  dispatch(aboutTextsFetched(newAbouts));
}