import { combineReducers } from "redux";
import { reducer } from "redux-form";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";
import auth from "./auth";
//importerar magiska form reducern!

export default combineReducers({
  form: reducer,
  firestore: firestoreReducer,
  auth: auth,
  firebase: firebaseReducer
});
