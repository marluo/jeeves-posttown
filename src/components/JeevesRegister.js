import React from "react";
import { connect } from "react-redux";
import { firestoreConnect, populate } from "react-redux-firebase";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createDeflate } from "zlib";
import history from "../history";
import { register } from "../actions";

class JeevesRegister extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    emailExists: "",
    usernameExists: ""
  };

  self = this.props;

  onChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(this.state.username, this.state.email, this.state.password);

    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { userExists } = this.props;
    this.props.registerUser(userExists);
  };

  renderTaken = kek => {
    if (kek && kek.length > 0) {
      return <div>Username Exists</div>;
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div class="ui huge icon input">
          {this.renderTaken(this.props.userExists)}
          username:
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
          />
        </div>
        <div class="ui huge icon input">
          Subusername:
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
          />
        </div>
        <div class="ui huge icon input">
          password:
          <input
            type="text"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
          />
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const populates = [{ child: "createdBy", root: "users" }];
const collection = "users";

const mapDispatchToProps = (dispatch, ownProps) => {
  const username = "marcustest";
  const email = "marcustest@marcustest.com";
  const password = "test12345";
  const firstName = "Jemil";
  const lastName = "Riahi";
  return {
    registerUser: (inputs, props) => {
      ownProps.firestore
        .get({ collection: "username", doc: username.toLowerCase() })
        .then(data => {
          if (data.exists) {
            console.log("hej");
          } else {
            ownProps.firebase
              .createUser(
                { email, password },
                { username, email, firstName, lastName }
              )
              .then(resp => {
                ownProps.firestore.set(
                  {
                    collection: "username",
                    doc: username.toLowerCase()
                  },
                  { uid: ownProps.firebase.auth().currentUser.uid }
                );
              })
              .catch(err => {});
          }
        });
    }
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.firestore.ordered.users,
    auth: state.auth,
    profile: state.firebase.profile,
    populate: populate(state.firestore, collection, populates),
    userid: state.firebase.auth.uid,
    userExists: state.firestore.ordered.userExists
  };
};

const enhance = compose(
  firestoreConnect(props => [
    {
      collection,
      populates
    }
  ]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
); // sync todos collection from Firestore into redux

export default enhance(JeevesRegister);
