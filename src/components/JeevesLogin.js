import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { register, signIn } from "../actions";

class JeevesLogin extends React.Component {
  renderLogin({ input, label }) {
    return (
      <div>
        <label>{label}</label>
        <input {...input} />
        {/*så att vi får med hela inputProps från forms i state */}
      </div>
    );
  }

  onLogin = inputValues => {
    this.props.signIn(inputValues);
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.onLogin)}>
        <Field
          name="username"
          component={this.renderLogin}
          label="Enter Username"
        />
        <Field
          name="password"
          component={this.renderLogin}
          label="Enter Password"
        />
        <button classNames="ui button primary">Submit!</button>
      </form>
    );
  }
}

const formWrapped = reduxForm({
  form: "login"
})(JeevesLogin);

export default connect(
  null,
  { register, signIn }
)(formWrapped);
