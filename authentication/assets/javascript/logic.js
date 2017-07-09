// Initialize Firebase
var config = {
	apiKey: "AIzaSyDAk_q6CgSSX-dcQzPesIBcwTJ0aBxe_A0",
	authDomain: "night-by-night.firebaseapp.com",
	databaseURL: "https://night-by-night.firebaseio.com",
	projectId: "night-by-night",
	storageBucket: "night-by-night.appspot.com",
	messagingSenderId: "996621044302"
};

firebase.initializeApp(config);

// Initialize collapse button
$(".button-collapse").sideNav();
// Initialize collapsible (uncomment the line below if you use the dropdown variation)
$('.collapsible').collapsible();

$(document).ready(function () {
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});

$("#login").click(function (e) {
  e.preventDefault();
  $("#login-modal").modal('open');
});

// To hold user's display information
var currentUser = {
  displayName: "",
  photoURL: ""
}

// handle log in or out
function logInOut() {
  var user = firebase.auth().currentUser;
    console.log("logInOut received:", user); // the object logged here has displayName set correctly
  if (user) {
    // User is signed in
    $("#login-modal").modal('close');
    currentUser.displayName = user.displayName;
    console.log("user.displayName:", user.displayName);
    console.log("currentUser.displayName", currentUser.displayName);
    currentUser.photoURL = user.photoURL;
    Materialize.toast("Welcome " + currentUser.displayName + "!", 5000);
    $("#login").html(`<img class="img-responsive circle userpic" src=${currentUser.photoURL}>`);
    // var emailVerified = user.emailVerified;
    // var isAnonymous = user.isAnonymous; //?
    // var uid = user.uid;
    // var providerData = user.providerData;
  } else if (!user) {
    // User is signed out.
    console.log("no user");
    $("#login").empty();
    $("#login").html('<a class="btn btn-floating pulse"><i class="material-icons">perm_identity</i></a>');
  }
}

// Sign in with email and password
$("#profile-input").submit(function (e) {
  e.preventDefault();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(handleAuthError);
});

// sign in with Google
$(document).on("click", "#g-signin", function (e) { 
  e.preventDefault();
  var provider = new firebase.auth.GoogleAuthProvider();
  // send the user off on a redirect to Google sign in
  firebase.auth().signInWithRedirect(provider);
  // handle what happens when they get back
  firebase.auth().getRedirectResult()
  // .then(logInOut)
  .catch(handleAuthError);
});

function handleAuthError(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === "auth/user-not-found") {
    Materialize.toast(`
      <h3>Who?</h3>
      <p>We don't recognize that combo of email and password.</p>
      <p>Want to create a <a class="waves-effect btn" onclick="createNewUser()">New user</a> ?</p>
      <p>Or just <a class="waves-effect btn">try again</a> ?
    `);
  } else {
    var errorToastTxt = `
    <h3>I'm sorry, there's been a problem!</h3>
    <p>Error code "${errorCode}": ${errorMessage}.</p>
    <a class="btn waves-effect">OK</a>
  `;
    Materialize.toast(errorToastTxt);
  }
}

// one function for login or logout
firebase.auth().onAuthStateChanged(logInOut);

// Make Materialize toasts dismissible with click
$(document).on("click", ".toast", function () {
  $(this).fadeOut(function () {
    $(this).remove();
  });
});