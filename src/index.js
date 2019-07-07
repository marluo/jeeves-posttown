import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import {
  createFirestoreInstance,
  getFirestore,
  profilePopulates,
  reduxFirestore
} from "redux-firestore";
import {
  ReactReduxFirebaseProvider,
  getFirebase,
  reduxFirebase
} from "react-redux-firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyDXRx3dMwRgEVZDBaOA2Uecz2MAfPkDZwo",
  authDomain: "jeeves-5d976.firebaseapp.com",
  databaseURL: "https://jeeves-5d976.firebaseio.com",
  projectId: "jeeves-5d976",
  storageBucket: "jeeves-5d976.appspot.com",
  messagingSenderId: "332828688336"
};

firebase.initializeApp(config);
firebase.firestore();

firebase
  .firestore()
  .enablePersistence()
  .catch(function(err) {
    if (err.code == "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code == "unimplemented") {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });
var functions = firebase.functions();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    compose(
      applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))
    )
  )
);

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
  AttachAuthIsReady: true,
  profileParamsToPopulate: profilePopulates
  /*fileMetadataFactory: (uploadRes, firebase, metadata, downloadURL, ee) => {
    console.log(
      "kek",
      uploadRes,
      "test",
      firebase,
      "power",
      metadata,
      "wqeqe",
      ee
    );
    // upload response from Firebase's storage upload
    const {
      metadata: { name, fullPath }
    } = uploadRes;
    // default factory includes name, fullPath, downloadURL
    return {
      name,
      fullPath,
      downloadURL
    };
  }*/
};
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);
