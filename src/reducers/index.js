import { combineReducers } from "redux";
import { reducer } from "redux-form";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer, authReducer } from "react-redux-firebase";
import Pagination from "./Pagination";
import auth from "./auth";
import querySize from "./querySize";
import needToLogin from "./needToLogin";
//importerar magiska form reducern!

export default combineReducers({
  form: reducer,
  firestore: firestoreReducer,
  auth: auth,
  firebase: firebaseReducer,
  pagination: Pagination,
  size: querySize
});
