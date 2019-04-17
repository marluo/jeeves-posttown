const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("hello, ninjas!");
});

exports.onInstanceCreate = functions.firestore
  .document("posts/{postId}/responses/{commentId}")
  .onCreate((snapshot, context) => {
    console.log(context.params);
    const postId = context.params.postId;
    const docRef = admin
      .firestore()
      .collection("posts")
      .doc(postId);

    return docRef.get().then(snap => {
      console.log("wow", snap.data().commentCount);
      const commentCount = snap.data().commentCount + 1;

      const data = { commentCount };
      console.log(data);

      return docRef.update(data);
    });
  });

exports.onUpvote = functions.https.onCall((data, context) => {
  const commentId = data[0];
  const postId = data[1];
  const number = data[2];
  const upvoteref = admin
    .firestore()
    .collection("posts")
    .doc(postId)
    .collection("responses")
    .doc(commentId);

  return upvoteref.get().then(snap => {
    console.log("wow", snap.data().upvotes);
    const upvotes = snap.data().upvotes + number;

    const data = { upvotes };
    console.log(data);

    return upvoteref.update(data);
  });
});

exports.onUpvotePost = functions.https.onCall((data, context) => {
  const postId = data[0];
  const number = data[1];
  const upvoteref = admin
    .firestore()
    .collection("posts")
    .doc(postId);

  return upvoteref.get().then(snap => {
    console.log("wow", snap.data().upvotes);
    const upvotes = snap.data().upvotes + number;

    const data = { upvotes };
    console.log(data);

    return upvoteref.update(data);
  });
});
