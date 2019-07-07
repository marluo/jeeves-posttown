import React from "react";
import { connect } from "react-redux";
import {
  firestoreConnect,
  populate,
  firebaseConnect
} from "react-redux-firebase";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { PaginationNext, PaginationBack, querySize } from "../actions/";

class JeevesDashBoard extends React.Component {
  state = {
    number: 0,
    size: 0
  };

  showEditandDelete = (id, postid) => {
    console.log(id, this.props.auth);
    if (id === this.props.auth) {
      //om Id:t på posten är samma som den som är inloggad, visa en delete knapp.
      console.log("yoo");
      return (
        <div className="fr">
          <div>
            <button onClick={() => this.props.deletePost(postid)}>
              Delete Post
            </button>
          </div>
        </div>
      );
    }
  };

  renderPages(PageNumber) {
    this.setState(prevState => ({
      currentPage: prevState + PageNumber
    }));
  }

  onClick = (data, korv) => {
    //kallar på en Cloud Function som upvotear/downVoteas
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

  renderCommentNumbersandUpvotes = post => {
    if (post.commentCount) {
      return (
        <div className="f5 black-50 ttu">comments: {post.commentCount}</div>
      );
    } else {
      return <div className="f5 black-50 ttu">no comments</div>;
    }
  };

  renderPosts() {
    if (this.props.posts) {
      return this.props.posts.map(post => {
        return (
          <div class="mw100 center bg-light-gray pa1 ph3-ns br0 ba b--light-silver">
            <div className="fl w2 pa2">
              <i
                class="angle up icon"
                onClick={() => this.onClick([post.id, 1])}
              />
            </div>
            <div>
              <Link to={`/info/view/${post.id}`}>
                <h2 className="f3-ns f5 black-70 ttu tracked-tight mt0 lol">
                  {post.title}
                </h2>
              </Link>
              {this.showEditandDelete(post.userid, post.id)}
              <div className="f5 black-50 ttu mt0">{post.subtitle}</div>
              <div className="f5 black-50 ttu pl2 mt0 mb0 w2 pa0 dib pb2 pr3">
                {post.upvotes}
              </div>
              <span class="dib">
                <Link to={`/info/profile/${post.userid}`}>{post.username}</Link>
              </span>
            </div>
            <div className="fl w2 pa2">
              <i
                class="angle down icon"
                onClick={() => this.onClick([post.id, -1])}
              />
            </div>
            <div>
              <div>
                <div>
                  <h4 className="f6 link blue dib h2 pt2">
                    {this.renderCommentNumbersandUpvotes(post)}
                  </h4>
                </div>
              </div>
            </div>
            <div />
          </div>
        );
      });
    } else {
      return (
        <div class="sixteen wide column">
          <div class="ui segment">
            <div class="ui active centered inline loader" />
          </div>
        </div>
      );
    }
  }

  render() {
    return <div class="mt6">{this.renderPosts()}</div>;
  }
}
const populates = [{ child: "username", root: "username" }];
const collection = "posts";

const mapStateToProps = (state, props) => {
  return {
    posts: state.firestore.ordered.posts,
    auth: state.firebase.auth.uid,
    profile: state.firebase.profile,
    populate: populate(state.firestore, collection, populates),
    pagination: state.pagination,
    postsWhole: state.firestore.ordered.posts,
    size: state.size
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  console.log(ownProps);
  return {
    deletePost: postid => {
      ownProps.firestore.delete({ collection: "posts", doc: postid });
    }
  };
};

const enhance = compose(
  firestoreConnect(props => {
    return [
      {
        collection: "posts",
        orderBy: ["upvotes", "desc"],
        storeAs: "posts"
      }
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
); // sync todos collection from Firestore into redux

export default enhance(JeevesDashBoard);
