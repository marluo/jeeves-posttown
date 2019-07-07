import history from "../history";
import * as firebase from "firebase";
import "firebase/firestore";

export const register = inputValues => async dispatch =>
  firebase
    .auth()
    .createUserWithEmailAndPassword(inputValues.username, inputValues.password);

export const signIn = inputValues => async dispatch => {
  firebase
    .auth()
    .signInWithEmailAndPassword(inputValues.username, inputValues.password)
    .then(() => {
      const user = firebase.auth().currentUser;
      dispatch({
        type: "SIGN_IN",
        payload: user
      });
    })
    .catch(err => {
      dispatch({
        type: "SIGN_ERROR",
        payload: err.message
      });
    });
};

export const signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      history.push("/");
    })
    .catch(function(error) {
      // An error happened.
    });
};

export const PaginationNext = number => async (dispatch, getState) => {
  if (number < 10) {
    dispatch({
      type: "PAGINATION_NEXT",
      payload: number
    });
  }
};

export const PaginationBack = number => async (dispatch, getState) => {
  if (number === number)
    dispatch({
      type: "PAGINATION_BACK",
      payload: number
    });
};

export const querySize = number => {
  return {
    type: "QUERY_SIZE",
    payload: number
  };
};

export const needToLogin = number => {
  return {
    type: "NEED_TO_LOGIN",
    payload: number
  };
};
