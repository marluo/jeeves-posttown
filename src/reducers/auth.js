import { actionTypes } from "react-redux-firebase";

const INITAL_STATE = {
  isSignedIn: null,
  message: null
};

export default (state = INITAL_STATE, action) => {
  //if undefined, get initial_state
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, isSignedIn: true, ...action.payload };
    //modiferar bara isSignedIn
    case "SIGN_OUT":
      return { ...state, isSignedIn: false, userId: null };
    //modiferar bara isSignedOut
    case "SIGN_ERROR":
      return { ...state, isSignedIn: false, message: action.payload };
    default:
      return state;
  }
};
