import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Header extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div class="ui inverted segment">
        <div class="ui inverted secondary menu">
          <Link class="item" to="/info/dashboard">
            Dashboard
          </Link>
          <Link class="item" to="/info/add">
            Add Post
          </Link>
          <div class="right menu">
            <Link to={`/info/profile/${this.props.auth.uid}`}>
              <div class="item">{this.props.profile.username}</div>
            </Link>
          </div>
        </div>
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

export default connect(mapStateToProps)(Header);
