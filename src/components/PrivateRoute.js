import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { withFirebase, isLoaded, isEmpty } from "react-redux-firebase";
import { needToLogin } from "../actions";

const PrivateRoute = ({ auth, component: Component, dispatch, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      {
        delete props.dispatch;
      }
      if (!isLoaded(auth)) {
        return <div> is Loading..</div>;
      }
      if (!isEmpty(auth)) {
        return <Component {...props} {...rest} />;
      } else {
        return <Redirect to="/" />;
      }
    }}
  />
);

const mapStateToProps = state => {
  return { auth: state.firebase.auth };
};

export default connect(mapStateToProps)(PrivateRoute);
