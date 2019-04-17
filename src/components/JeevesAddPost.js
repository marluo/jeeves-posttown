import React from "react";
import { connect } from "react-redux";
import { firestoreConnect, populate } from "react-redux-firebase";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createDeflate } from "zlib";
import history from "../history";

class JeevesAddPost extends React.Component {
  state = {
    title: "",
    subtitle: "",
    content: ""
  };

  onChange = event => {
    console.log(this.props.profile);
    const name = event.target.name;
    const value = event.target.value;
    console.log(this.state.title, this.state.subtitle, this.state.content);

    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event, ownProps, dispatch) => {
    event.preventDefault();
    this.props.addPost(
      event.target,
      this.props.profile.username,
      this.props.userid
    );
  };

  render() {
    console.log(this.props);
    return (
      <form onSubmit={this.handleSubmit}>
        <div class="ui huge icon input">
          Title:
          <input
            type="text"
            name="title"
            value={this.state.title}
            onChange={this.onChange}
          />
        </div>
        <div class="ui huge icon input">
          Subtitle:
          <input
            type="text"
            name="subtitle"
            value={this.state.subtitle}
            onChange={this.onChange}
          />
        </div>
        <div class="ui huge icon input">
          Content:
          <input
            type="text"
            name="content"
            value={this.state.content}
            onChange={this.onChange}
          />
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
const populates = [{ child: "createdBy", root: "users" }];
const collection = "posts";

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addPost: (data, username, userid) => {
      ownProps.firestore
        .add(
          { collection: "posts" },
          {
            title: data[0].value,
            subtitle: data[1].value,
            content: data[2].value,
            createdAt: ownProps.firestore.Timestamp.now(),
            username: username,
            userid: userid,
            commentCount: 0,
            upvotes: 0
          }
        )
        .then(() => {
          dispatch({ type: "CREATE_POST_SUCESS" }, data);
          history.push("/info/dashboard");
        })
        .catch(err => {
          dispatch({ type: "CREATE_POST_ERROR" });
        });
    }
  };
};

const mapStateToProps = (state, props) => {
  return {
    posts: state.firestore.ordered.posts,
    auth: state.auth,
    profile: state.firebase.profile,
    populate: populate(state.firestore, collection, populates),
    userid: state.firebase.auth.uid
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

export default enhance(JeevesAddPost);
