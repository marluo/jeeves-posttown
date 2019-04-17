import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { firestore, firebase } from "firebase";
import xDate from "xdate";
import faker from "faker";

class JeevesViewPost extends React.Component {
  state = {
    comment: ""
  };

  onClick = (data, korv) => {
    var addMessage = this.props.firebase.functions().httpsCallable("onUpvote");
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

  dateConverter = nowTime => {
    const secs = nowTime;
    const time = new xDate(secs * 1000);
    return <div>{time.toString("yy/M/d - HH:mm")}</div>;
  };

  renderComments = comments => {
    if (comments.length > 0) {
      return comments.map(comment => {
        console.log(comment);
        return (
          <div class="ui comments">
            <h3 class="ui dividing header" />
            <div class="comment">
              <a class="avatar">
                <img src={faker.image.avatar()} />
              </a>
              <div class="content">
                <a class="author">{comment.username}</a>
                <div class="metadata">
                  <span class="date">
                    {this.dateConverter(comment.createdAt.seconds)}
                  </span>
                </div>
                <div class="text">{comment.comment}</div>
                <div class="actions">{/*<a class="reply">Reply</a>*/}</div>
              </div>
              upvotes: {comment.upvotes}
              <i
                class="angle up icon"
                onClick={() =>
                  this.onClick([comment.id, this.props.match.params.id, 1])
                }
              />
              <i
                class="angle down icon"
                onClick={() =>
                  this.onClick([comment.id, this.props.match.params.id, -1])
                }
              />
            </div>
          </div>
        );
      });
    } else {
      return <div>be the first one to comment!</div>;
    }
  };

  onChange = event => {
    console.log(event.target);
    this.setState({
      comment: event.target.value
    });
  };

  handleSubmit = (event, ownProps, dispatch) => {
    console.log("kek", event.target[0].value);
    event.preventDefault();
    this.props.addComment(
      this.props.match.params.id,
      event.target[0].value,
      this.props.profile
    );
  };

  render() {
    console.log(this.state.comment);
    if (this.props.post && this.props.comments) {
      return this.props.post.map(post => {
        return (
          <div>
            <div>{post.title}</div>
            <div>{post.subtitle}</div>
            <div>{post.content}</div>
            <div>{post.userid}</div>
            <form onSubmit={this.handleSubmit}>
              <div class="ui huge icon input">
                comment:
                <input
                  type="text"
                  name="comment"
                  value={this.state.comment}
                  onChange={this.onChange}
                />
              </div>
              <input type="submit" value="Submit" />
            </form>
            {this.renderComments(this.props.comments)}
            <div />
          </div>
        );
      });
    } else {
      return <div>Loading</div>;
    }
  }
}

const populates = [{ child: "createdBy", root: "users" }];
const collection = "posts";

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addComment: (id, comment, profile) => {
      ownProps.firestore
        .add(
          {
            collection: "posts",
            doc: id,
            subcollections: [{ collection: "responses" }]
          },
          {
            comment: comment,
            username: profile,
            createdAt: ownProps.firestore.Timestamp.now(),
            upvotes: 0
          }
        )
        .then(resp => {
          console.log(resp);
        });
    }
  };
};

const mapStateToProps = (state, props) => {
  return {
    post: state.firestore.ordered.post,
    comments: state.firestore.ordered.comments,
    profile: state.firebase.profile.username
  };
};

const enhance = compose(
  firestoreConnect(props => [
    {
      collection: "/posts/",
      doc: props.match.params.id,
      storeAs: "post"
    },
    {
      collection: `/posts/${props.match.params.id}/responses`,
      orderBy: ["upvotes", "desc"],
      storeAs: "comments"
    }
  ]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
); // sync todos collection from Firestore into redux

export default enhance(JeevesViewPost);
