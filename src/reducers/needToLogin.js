export default (state = 1, action) => {
  //if undefined, get initial_state
  switch (action.type) {
    case "NEED_TO_LOGIN":
      return state - action.payload;
    default:
      return state;
  }
};
