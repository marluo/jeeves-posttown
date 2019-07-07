import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { firestore, firebase } from "firebase";
import xDate from "xdate";
import faker from "faker";
import JeevesCommentResponses from "./JeevesCommentResponses";
import "./JeevesViewPost.css";

class JeevesViewPost extends React.Component {
  state = {
    comment: "",
    commentResponse: "",
    reply: false
  };

  toggleVisibility = () => {};

  onClick = (data, korv) => {
    //cloud function som tar hand om upvoteing.
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

  onChangeComment = event => {
    this.setState({
      commentResponse: event.target.value
    });
  };

  dateConverter = nowTime => {
    //Konverterar datumet från unix time till dagens datum
    const secs = nowTime;
    const time = new xDate(secs * 1000);
    //så att vi får sekunder till tid så att vi kan konvertera det
    return (
      <h1 className="f6 black-50 ttu db">{time.toString("yy/M/d - HH:mm")}</h1>
    );
  };

  renderComments = comments => {
    //passar in alla comments från reduxstore, så att vi kan göra något med dem.
    if (comments.length > 0) {
      //kollar så att vi har comments på posten, annars rendera ut "inga posts"
      return comments.map(comment => {
        //mappar ut varje comment
        return (
          <div className="ba b--light-silver ma2 w-100 bg-light-gray">
            <div class="mw9 center ph0-ns">
              <div class="cf ph2-ns">
                <div class="fl w-25 w-25-ns pa2">
                  <p class="f6 black-50 ttu db lol">{comment.username}</p>
                  <img
                    src={
                      !comment.profilepic
                        ? "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                        : comment.profilepic
                    }
                    //om användarne har en profilbild, visa den - annars visa defaultbild
                    class="br-100 h3 w3 dib"
                    alt="avatar"
                  />
                  <p class="f6 black-50 ttu db">
                    {this.dateConverter(comment.createdAt.seconds)}
                  </p>
                </div>
                <div class="fl w-100 w-75-ns pa1 ws-normal">
                  <div class="w25 ws-normal pt2 lol fl">
                    <p classname="mt5-ns mt5">{comment.comment}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* rendera ut JeevesCommentResponses på varje post, passar in postid, och commentID så att vi kan komma åt varje kommentar till posten */}
            <JeevesCommentResponses
              postId={this.props.match.params.id}
              commentId={comment.id}
              dateConverter={this.dateConverter}
            />
          </div>
        );
      });
    } else {
      return <div>be the first one to comment!</div>;
    }
  };

  /*handleComment = (commentId, postId) => event => {
    event.preventDefault();
    this.props.addCommentResponse(
      commentId,
      postId,
      event.target[0].value,
      this.props.profile.username
    );
  };*/

  onChange = event => {
    console.log(event.target);
    this.setState({
      comment: event.target.value
    });
  };

  handleSubmit = (event, ownProps, dispatch) => {
    event.preventDefault();
    //adderar ny comment till posten och passar in värden som ska sparas på dokumentet
    //i detta fall passar vi in params(postID), värdet, username, och profilePICURL som finns i redux store på profile när man är inloggad.
    this.props.addComment(
      this.props.match.params.id,
      event.target[0].value,
      this.props.profile.username,
      this.props.profile.profilepicURL
    );
  };

  render() {
    if (this.props.post && this.props.comments) {
      //om båda dessa har laddats in i redux, så renderera detta. Annars renderera ut Loading
      return this.props.post.map(post => {
        return (
          <div class="pt7 black-80 bg-light-gray vh-100 w-75 w-25-ns center ba-black vh-100 dt w-100">
            <p class="f2 lh-copy measure tc">asdasdasd</p>
            <p class="f5 lh-copy measure tc">{post.title}</p>
            <div className="f5 lh-copy measure tc">
              {post.username}
              {this.dateConverter(post.createdAt.seconds)}
            </div>
            <div class="pa3 bt b--black-10 f5 lh-copy measure tc">
              <div>{post.subtitle}</div>
              <p class="f5 lh-copy">{post.content}</p>
              <form onSubmit={this.handleSubmit}>
                {/* kallar på handleSubmit som tar hand kommentaren som postas */}
                <div className="center db tc">comment:</div>
                <input
                  type="text"
                  name="comment"
                  value={this.state.comment}
                  //värdet av commenten uppdateras från staten som vi uppdaterar
                  onChange={this.onChange}
                  //kallar på onChange vid varje ändraing av fältet och uppdaterar state
                  className="input-reset ba b--black-20 pa2 mb2 db w-75 center"
                />
                <div className="">
                  <input
                    type="submit"
                    value="Submit"
                    className="input-reset ba b--black-20 pa2 mb2 db w-75 center"
                  />
                </div>
              </form>
              {this.renderComments(this.props.comments)}
              {/* Renderar ut alla comments, vi passar in alla comments till denna funktion */}
              <div />
            </div>
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
    addComment: (id, comment, username, profilepic) => {
      //adderar en ny post till databasen. Id:t vi passar in är postidn så den hamnar som subcollection
      ownProps.firestore
        .add(
          {
            collection: "posts",
            doc: id,
            subcollections: [{ collection: "responses" }]
          },
          {
            comment: comment,
            username: username,
            profilepic: !profilepic ? faker.image.avatar() : profilepic,
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
  //hämtar ut datan vi vill ha till this.props
  return {
    post: state.firestore.ordered.post,
    comments: state.firestore.ordered.comments,
    profile: state.firebase.profile,
    commentResponses: state.firestore.ordered
  };
};

const enhance = compose(
  firestoreConnect(props => [
    //Hämra ut posten med hjälp av Router-paramsID vi får från this.props
    {
      collection: "/posts/",
      doc: props.match.params.id,
      storeAs: "post"
    },
    //Hämtar ut alla comments nedan till posten vi har
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
