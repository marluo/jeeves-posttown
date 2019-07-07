export default (state = 1, action) => {
  switch (action.type) {
    case "PAGINATION_NEXTee":
      return state + action.payload;
    case "PAGINATION_BACKee":
      return state - action.payload;
    default:
      return state;
  }
};
