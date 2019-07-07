import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { register, signIn } from "../actions";
import { Link } from "react-router-dom";

class JeevesLogin extends React.Component {
  renderLogin({ input, label, type }) {
    return (
      <div>
        <label>{label}</label>
        <input
          {...input}
          type={type}
          className="pa2 input-reset ba bg-white hover-bg-white w-100"
        />
        {/*så att vi får med hela inputProps från forms i state */}
      </div>
    );
  }

  onLogin = inputValues => {
    this.props.signIn(inputValues);
  };

  /*renderLogged() {
    if (isEmpty(this.props.auth)) {
      return (
        <div>
          <h2>Please login to proceed</h2>
        </div>
      );
    } else {
      history.goBack();
    }
  }*/

  render() {
    return (
      <div>
        <div className="pa7 black-80 bg-light-gray vh-100">
          <form
            onSubmit={this.props.handleSubmit(this.onLogin)}
            className="measure center"
          >
            <h2 className="f2 black-50 ttu center">LOGIN</h2>
            <Field
              name="username"
              component={this.renderLogin}
              label="Enter Username"
              type="text"
            />
            <Field
              name="password"
              component={this.renderLogin}
              label="Enter Password"
              type="password"
            />
            <button className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib mt2">
              Submit!
            </button>
          </form>
          <div class="lh-copy mt3 measure center">
            <Link to="/info/register" class="f5 black-50 ttu db">
              Sign up
            </Link>
            <div className="tc">{this.props.message}</div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    message: state.auth.message
  };
};

const formWrapped = reduxForm({
  form: "login"
})(JeevesLogin);

export default connect(
  mapStateToProps,
  { register, signIn }
)(formWrapped);
