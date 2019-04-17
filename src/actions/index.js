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
      history.push("/info/dashboard");
      dispatch({
        type: "SIGN_IN",
        payload: user
      });
    });
};
