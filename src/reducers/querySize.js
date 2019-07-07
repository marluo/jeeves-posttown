export default (state = 10, action) => {
  switch (action.type) {
    case "QUERY_SIZE":
      return action.payload;
    case "PAGINATION_NEXT":
      return state - action.payload;
    case "PAGINATION_BACK":
      return state + action.payload;
    default:
      return state;
  }
};
