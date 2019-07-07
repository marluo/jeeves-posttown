import React from "react";
import { connect } from "react-redux";
import { firestoreConnect, populate } from "react-redux-firebase";
import { compose } from "redux";
import { Field, reduxForm } from "redux-form";
import history from "../history";
import { register } from "../actions";

class JeevesRegister extends React.Component {
  renderInput = ({ input, label, meta, type }) => {
    console.log(meta.error);
    //Field passar in argument in som vi kan använda
    return (
      <div className="field">
        <input
          {...input}
          autoComplete="off"
          className="pa2 input-reset ba bg-white hover-bg-white w-100"
          type={type}
        />
        {meta.touched && (meta.error && <span>{meta.error}</span>)}
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.registerUser(formValues);
    //När vi submittar formet, kallas denna funktion och vi kallar på den actionCreator vi har tillgång till
  };

  renderTaken = kek => {
    if (kek && kek.length > 0) {
      return <div>Username Exists</div>;
    }
  };

  render() {
    return (
      <div class="pa7 black-80 bg-light-gray vh-100">
        <form
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          className="measure center"
        >
          <h2 className="f2 black-50 ttu center">REGISTER</h2>
          {this.renderTaken(this.props.userExists)}
          Username:
          <Field name="username" component={this.renderInput} />
          Email:
          <Field name="email" component={this.renderInput} />
          Password:
          <Field
            name="password"
            component={this.renderInput}
            label="password"
            type="password"
          />
          First Name:
          <Field
            name="firstName"
            component={this.renderInput}
            label="firstname"
          />
          Last Name:
          <Field
            name="lastName"
            component={this.renderInput}
            label="lastname"
          />
          <input
            type="submit"
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib mt2"
            value="Submit"
          />
        </form>
      </div>
    );
  }
}
const populates = [{ child: "createdBy", root: "users" }];
const collection = "users";

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    registerUser: props => {
      const { username, email, password, firstName, lastName } = props;
      //destructar ut alla props vi har från formet. Det är ett objekt pga att det är en form.
      ownProps.firestore
        .get({ collection: "username", doc: props.username.toLowerCase() })
        .then(data => {
          //kollar om användarnamnet redan finns. Har sparat användarnamnen i lowerCase i en egen collection och kollar mot detta.
          if (data.exists) {
            //om denna data finns, logga ut något! :D
            console.log("hej");
          } else {
            //om användaren inte hittas i collectionen med usernamet i lowercase, skapa användaren i firebase Egna Authgrej
            ownProps.firebase
              .createUser(
                { email, password },
                { username, email, firstName, lastName, profilepicURL: null }
              )
              .then(resp => {
                //sparar ner användarnamnet i min lowercase-collection för att inte flera användarnman med lowercase ska finnas
                ownProps.firestore.set(
                  {
                    collection: "username",
                    doc: username.toLowerCase()
                  },
                  { uid: ownProps.firebase.auth().currentUser.uid }
                  //sparar endast ner authUIDT vi får ut av responsen av att skapa en användare och sparar det som en referens egentligen.
                );
              })
              .then(resp => {
                //pusha till dashboard
                history.push("/info/dashboard");
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

const validate = values => {
  //validation av fields
  const errors = {};
  console.log("eee", values);
  if (!values.username) {
    errors.username = "Required";
  } else if (values.username.length > 15) {
    errors.username = "Must be 15 characters or less";
  } else if (values.username.length < 6) {
    errors.username = "Must be 6 characters or more";
  }
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.firstName) {
    errors.firstName = "Required";
  }
  if (!values.lastName) {
    errors.lastName = "Required";
  }
  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 6) {
    errors.password = "Must be longer than 6";
  }
  return errors;
};

const enhance = compose(
  reduxForm({ form: "form" }),
  firestoreConnect(props => [
    {
      collection,
      populates
    }
  ]),
  reduxForm({
    form: "sampleForm",
    validate: validate,
    asyncBlurFields: []
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
); // sync todos collection from Firestore into redux

export default enhance(JeevesRegister);
