import React from "react";
import { connect } from "react-redux";
import { firestoreConnect, populate } from "react-redux-firebase";
import { compose } from "redux";
import { Link } from "react-router-dom";

class JeevesDashBoard extends React.Component {
  showEdit = id => {
    console.log(id, this.props.auth);
    if (id === this.props.auth) {
      console.log("yoo");
      return <div>Edit</div>;
    }
  };

  onClick = (data, korv) => {
    var addMessage = this.props.firebase
      .functions()
      .httpsCallable("onUpvotePost");
    addMessage(data, korv)
      .then(function(result) {
        // Read result of the Cloud Function.
      })
      .catch(function(error) {
        // Getting the Error details.
        var code = error.code;
        var message = error.message;
        var details = error.details;
        // ...
      });
  };

  showComments = id => {
    this.props.firestore.get({
      collection: "/posts/",
      doc: id,
      subcollections: [
        {
          collection: "comments"
        }
      ],
      storeAs: "comments"
    });
  };

  renderCommentNumbers = post => {
    if (post.commentCount) {
      return <div>comments: {post.commentCount}</div>;
    } else {
      return <div>no comments</div>;
    }
  };

  renderPosts() {
    if (this.props.posts) {
      return this.props.posts.map(post => {
        return (
          <div class="sixteen wide column">
            <div class="ui segment">
              <div>
                <Link to={`/info/view/${post.id}`}>
                  <h2>{post.title}</h2>
                </Link>
                <h3>{post.subtitle}</h3>
                <Link to={`/info/profile/${post.userid}`}>
                  <h4>{post.username}</h4>
                </Link>
              </div>
              Upvotes: {post.upvotes}
              <i
                class="angle up icon"
                onClick={() => this.onClick([post.id, 1])}
              />
              <i
                class="angle down icon"
                onClick={() => this.onClick([post.id, -1])}
              />
              {this.renderCommentNumbers(post)}
              <div />
              {this.showEdit(post.userid)}
            </div>
          </div>
        );
      });
    } else {
      return <div>Loading</div>;
    }
  }

  render() {
    return <div class="ui grid">{this.renderPosts()}</div>;
  }
}
const populates = [{ child: "username", root: "username" }];
const collection = "posts";

const mapStateToProps = (state, props) => {
  return {
    posts: state.firestore.ordered.posts,
    auth: state.firebase.auth.uid,
    profile: state.firebase.profile,
    populate: populate(state.firestore, collection, populates)
  };
};

const enhance = compose(
  firestoreConnect(props => [
    {
      collection: "/posts/",
      orderBy: ["upvotes", "desc"],
      storeAs: "posts"
    }
  ]),
  connect(mapStateToProps)
); // sync todos collection from Firestore into redux

export default enhance(JeevesDashBoard);
