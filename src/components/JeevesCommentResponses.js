import React from "react";
import { connect } from "react-redux";
import { firestoreConnect, populate } from "react-redux-firebase";
import { compose } from "redux";
import { Link } from "react-router-dom";
import faker from "faker";

class JeevesCommentResponses extends React.Component {
  state = {
    commentResponse: "",
    reply: false
  };

  renderCommentResponses = () => {
    if (this.props.test[this.props.commentId]) {
      //så vi vet att det har laddats in
      return this.props.test[this.props.commentId].map(kek => {
        //Eftersom att vi passar in commentidn på varje kommentar vi vill renderera ut,
        //och vi sparar varje response till comment som en CommentID vet vi vilken kommentar som tillhör vilken post.
        // Detta på grund av om Komment ID: 233 och komment har ID:233 vet vi att båda har samma.
        /* alterantiv FÖRKLARING7489 */
        //När vi mappar ut varje comment, hoppar den in här. Den renderar då även ut alla responses till comments.
        //Eftersom att varje commentResponse har en ID av commenten som passas in som prop, kan vi bara referera till den.
        return (
          <div className="bt w-75 w-75-ns center">
            <div class="mw9 center ph0-ns">
              <div class="cf ph2-ns">
                <div class="fl w-25 w-third-ns pa2">
                  <p class="f6 black-50 ttu lol">{kek.username}</p>
                  <img
                    src={
                      kek.profilepic
                        ? kek.profilepic
                        : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                    }
                    class="br-100 h3-ns w3-ns dib tc"
                    alt="avatar"
                  />
                  <p class="f6 black-50 ttu db">
                    {this.props.dateConverter(kek.createdAt.seconds)}
                  </p>
                </div>
                <div class="fl w-75 w-two-thirds-ns pa2 ws-normal">
                  <div class="w25 ws-normal lol">
                    <p classname="pre" />
                    {kek.comment}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
  };

  handleComment = (commentId, postId) => event => {
    event.preventDefault();
    this.props.addCommentResponse(
      commentId,
      postId,
      event.target[0].value,
      this.props.profile.username,
      this.props.profile.profilepicURL
    );
  };

  onChange = event => {
    console.log(event.target);
    this.setState({
      commentResponse: event.target.value
    });
  };

  renderActions = reply => {
    return (
      <div>
        <div class="actions">
          <h4>
            <a
              class="reply"
              onClick={() =>
                this.setState(prevState => ({
                  reply: !prevState.reply
                }))
              }
            >
              Reply
            </a>
          </h4>
        </div>
      </div>
    );
  };

  renderInput = () => {
    return (
      <form
        onSubmit={this.handleComment(this.props.commentId, this.props.postId)}
      >
        <input
          type="text"
          name="commentResponse"
          value={this.state.commentResponse}
          onChange={this.onChange}
          class="input-reset ba b--black-20 pa2 mb2 db w-75 center"
        />
        <input
          type="submit"
          value="Submit"
          class="input-reset ba b--black-20 pa2 mb2 db w-75 center"
        />
      </form>
    );
  };

  render() {
    console.log("wwww", this.props.test[this.props.commentId]);
    return (
      <div>
        {this.renderCommentResponses()}
        {this.renderActions()}
        {this.renderInput(this.state.reply)}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  console.log("we", props);
  return {
    commentResponses: state.firestore.ordered.id,
    profile: state.firebase.profile,
    test: state.firestore.ordered
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addCommentResponse: (commentid, postid, comment, username, profilepic) => {
      console.log("ww", profilepic, username);
      ownProps.firestore.add(
        {
          collection: "posts",
          doc: postid,
          subcollections: [
            { collection: "responses", doc: commentid },
            { collection: "commentResponse" }
          ]
        },
        {
          comment: comment,
          username: username,
          profilepic: !profilepic
            ? "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
            : profilepic,
          createdAt: ownProps.firestore.Timestamp.now(),
          commentid: commentid
        }
      );
    }
  };
};

const enhance = compose(
  //Vi har tillgång till props som vi passar in här, och kmr därför åt postid och commentID
  firestoreConnect(props => [
    {
      collection: "posts",
      doc: props.postId,
      subcollections: [
        { collection: "responses", doc: props.commentId },
        {
          collection: "commentResponse",
          orderBy: ["createdAt"]
        }
      ],
      storeAs: props.commentId
      //vi sparar ner den som props.commentID så att vi vet vilken responsen till kommentaren tillhör
    }
  ]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
); // sync todos collection from Firestore into redux

export default enhance(JeevesCommentResponses);
