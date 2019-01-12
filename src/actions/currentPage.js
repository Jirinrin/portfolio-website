export const CHANGE_PAGE = 'CHANGE_PAGE';

export const changePage = (page) => {
  let extraProps = {};
  if (page.popup)
    extraProps.showPopup = true;

  return {
    type: CHANGE_PAGE,
    page: {
      ...page,
      ...extraProps
    }
  };
}