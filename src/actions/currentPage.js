export const CHANGE_PAGE = 'CHANGE_PAGE';

export const changePage = (page) => {
  let extraProps = {};
  if (page.popup)
    extraProps.showPopup = true;
  if (page.forceLoad)
    page.forceLoad = Math.random();

  return {
    type: CHANGE_PAGE,
    page: {
      ...page,
      ...extraProps
    }
  };
}