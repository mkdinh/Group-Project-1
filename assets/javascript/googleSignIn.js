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

// Initialize Materialize modals
$(document).ready(function () {
  $('.modal').modal();
  $("#update-modal").modal({
    dismissible: false
  });
});

// Make Materialize toasts dismissible with click
$(document).on("click", ".toast", function () {
  $(this).fadeOut(function () {
    $(this).remove();
  });
});

var signedIn = false;

// handle log in or out
function logInOut(user) {
  // var user = firebase.auth().currentUser;
  console.log("logInOut received:", user);
  if (!user) {
    // User is signed out.
    signedIn = false;
    console.log("no user");
    $(".profile-btn").empty();
    $(".profile-btn").html('<a class="btn btn-floating pulse"><i class="material-icons">perm_identity</i></a>');
  } else if (user && user.displayName === null) {
    // New user account has just been created, but not yet updated
    // with displayName and photoURL
    return;
  } else {
    // User is signed in
    signedIn = true;
    $("#login-modal").modal('close');
    Materialize.toast("Welcome " + user.displayName + "!", 5000);
    $("#login").html(`<img class="img-responsive circle userpic" src=${user.photoURL}>`);
  }
}

// Sign in with email and password
$(document).on("click", "#login-submit", function (e) {
  e.preventDefault();
  var email = $("#email").val().trim();
  var password = $("#password").val().trim();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(handleAuthError);
  $("#login-modal").modal("close");
});

// sign in with Google
$(document).on("click", "#g-signin", function (e) { 
  e.preventDefault();
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).catch(handleAuthError);
});

// create new user
// this one uses a class instead of ID so it can also be called from the error message
// triggered by attempt to log in with unrecognized credentials
$(document).on("click", ".create-account", function (e) {
  e.preventDefault();
  var email = $("#email").val().trim();
  var password = $("#password").val().trim();
  if (email === "" || password === "") {
    Materialize.toast("Please enter your email and password.", 5000);
  } else {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
      $("#update-modal").modal("open");
    }).catch(handleAuthError);
  }
});

// Immediately after new user creation, update displayName and phoURL
$(document).on("click", "#update-submit", function (e) {
  e.preventDefault();
  var displayName = $("#name").val().trim();
  var photoURL = $("input[name=icon]:checked").attr("data-image");
  firebase.auth().currentUser.updateProfile({
      displayName: displayName,
      photoURL: photoURL
  });
  // call logInOut a second time with the new data
  logInOut(firebase.auth().currentUser);
  $("#update-modal").modal("close");
});

function handleAuthError(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === "auth/user-not-found") {
    Materialize.toast(`
      <h3>Who?</h3>
      <p>We don't recognize that combo of email and password.</p>
      <p>Want to create a <a class="waves-effect btn create-account">New user</a> ?</p>
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

// open sign in or sign out modal
$("#login").click(function (e) {
  e.preventDefault();
  if (signedIn) {
    $("#logout-modal").modal('open');
  } else{
    $("#login-modal").modal('open');
  }
});

// sign out user
$("#signout").click(function (e) { 
  e.preventDefault();
  firebase.auth().signOut();
  $("#logout-modal").modal('close');
});