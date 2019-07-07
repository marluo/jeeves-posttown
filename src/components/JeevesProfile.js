import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  firestoreConnect,
  populate,
  firebaseConnect
} from "react-redux-firebase";
import { compose, withHandlers, setPropTypes } from "recompose";
import Dropzone from "react-dropzone";

class JeevesProfile extends React.Component {
  renderDropZone = () => {
    if (
      this.props.match.params.id === this.props.firebase.auth().currentUser.uid
    )
      return (
        <Dropzone onDrop={this.props.onFilesDrop}>
          {({ getRootProps, getInputProps }) => {
            return (
              <div
                {...getRootProps({ refKey: "innerRef" })}
                className="f2 black-50 ttu tc db ma4"
              >
                CLICK HERE TO UPLOAD A PROFILE PIC
                <input
                  {...getInputProps({
                    onClick: event => console.log(event)
                  })}
                />
              </div>
            );
          }}
        </Dropzone>
      );
  };

  render() {
    if (this.props.user && this.props.onFilesDrop) {
      return (
        <div className="pa7 black-80 bg-light-gray vh-100">
          <div className="center w-75 v-mid">
            <img
              src={
                this.props.user.profilepicURL
                  ? this.props.profilepicURL
                  : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
              }
              class="br-100 h5 w5 db v-mid db center"
              alt="avatar"
            />
            {this.renderDropZone()}
            <div className="f2 black-50 ttu tc db ma4 pt4">
              Username: {this.props.user.username}
            </div>
            <div className="f2 black-50 ttu tc db ma4">
              First Name: {this.props.user.firstName}
            </div>
            <div className="f2 black-50 ttu tc db ma4">
              Last Name: {this.props.user.lastName}
            </div>
            <div className="f2 black-50 ttu tc db ma4">
              Email: {this.props.user.email}
            </div>
          </div>
        </div>
      );
    }
    return <div>Marcus</div>;
  }
}

const metadata = {
  cacheControl: "public,max-age=36000",
  contentType: "image/jpeg"
};

const handlers = {
  // Uploads files and push's objects containing metadata to database at dbPath
  onFilesDrop: props => (file, key) => {
    const kek = props.firebase.storage().ref();
    var uploadTask = kek
      .child(`${props.match.params.id}/profilepic.jpg`)
      .put(file[0], metadata);
    uploadTask.then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        props.firestore.update(
          {
            collection: "users",
            doc: props.firebase.auth().currentUser.uid
          },
          { profilepicURL: url }
        );
      });
    });
    // uploadFiles(storagePath, files, dbPath)
  },
  onFileDelete: props => (file, key) => {
    // deleteFile(storagePath, dbPath)
    /*return props.firebase.deleteFile(file.fullPath, `${filesPath}/${key}`);*/
  }
};

const enhancerPropsTypes = {
  firebase: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => {
  return {
    user: state.firestore.data.user,
    path: state.firebase.ordered.lols
  };
};

const enhance = compose(
  firebaseConnect(props => {
    return [
      {
        path: `${props.match.params.id}/profilepic`,
        storeAs: "lols"
      }
    ];
  }),
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: "/users/",
      doc: props.match.params.id,
      storeAs: "user"
    }
  ]),
  setPropTypes(enhancerPropsTypes),
  // Add handlers as props
  withHandlers(handlers)
); // sync todos collection from Firestore into redux

export default enhance(JeevesProfile);
