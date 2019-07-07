import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut, needToLogin } from "../actions";

class Header extends React.Component {
  renderSignOut = () => {
    if (this.props.auth.uid) {
      //om användaren är in loggad, visa sign out knapp.
      return (
        <p
          className="link dim white dib mr3 f7 f5-ns"
          onClick={this.props.signOut}
        >
          SIGN OUT
        </p>
        //kallar på en action att logga ut användaren
      );
    } else {
      //annars visa logga in knapp.
      return (
        <p
          className="link dim dib white mr3 f7 f5-ns"
          onClick={this.props.signOut}
        >
          LOGIN
        </p>
      );
    }
  };

  render() {
    return (
      <div className="bg-black-90 w-100 ph2 pv2 pv2-ns ph4-m ph5-l fixed top-0 cf h4">
        <div className="fr mr3 mr0-ns">
          <Link to={`/info/profile/${this.props.auth.uid}`}>
            <img
              src={
                this.props.auth.uid
                  ? this.props.profile.profilepicURL ||
                    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                  : null
              }
              style={
                this.props.auth.uid ? { width: "80px", height: "80px" } : null
              }
              className="measure center ba b--black-40 br-100 ma0"
            />
            <p className="ma0 tc v-top">{this.props.profile.username}</p>
          </Link>
        </div>
        <h4 class="f1-ns ttu tracked-tight mt0 white f2">POSTTOWN</h4>
        <nav className="f10 fw6 ttu tracked">
          {this.renderSignOut()}
          <Link
            to="/info/dashboard"
            className="link dim white dib mr3 f7 f5-ns"
          >
            Dashboard
          </Link>
          <Link className="link dim white dib mr3 f7 f5-ns" to="/info/add">
            Add Post
          </Link>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default connect(
  mapStateToProps,
  {
    signOut
  }
)(Header);
