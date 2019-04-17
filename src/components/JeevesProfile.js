import React from "react";
import { connect } from "react-redux";
import { firestoreConnect, populate } from "react-redux-firebase";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createDeflate } from "zlib";
import history from "../history";

class JeevesProfile extends React.Component {
  render() {
    if (this.props.user) {
      console.log(this.props.user);
      return (
        <div>
          <div>{this.props.user.username}</div>
          <div>{this.props.user.firstName}</div>
          <div>{this.props.user.lastName}</div>
          <div>{this.props.user.email}</div>
        </div>
      );
    }
    return <div>Marcus</div>;
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: state.firestore.data.user
  };
};

const enhance = compose(
  firestoreConnect(props => [
    {
      collection: "/users/",
      doc: props.match.params.id,
      storeAs: "user"
    }
  ]),
  connect(mapStateToProps)
); // sync todos collection from Firestore into redux

export default enhance(JeevesProfile);
