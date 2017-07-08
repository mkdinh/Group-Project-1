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

// handle log in or out
function logInOut() {
  var user = firebase.auth().currentUser;
    console.log("logInOut received:", user); // the object logged here has displayName set correctly
  if (user) {
    // User is signed in
    $("#splashModal").modal('close');
    currentUser.displayName = user.displayName;
    // BUG: the two lines below log null on first time createUser
    console.log("user.displayName:", user.displayName);
    console.log("currentUser.displayName", currentUser.displayName);
    currentUser.email = user.email;
    currentUser.photoURL = user.photoURL;
    // var emailVerified = user.emailVerified;
    // var isAnonymous = user.isAnonymous; //?
    // var uid = user.uid;
    // var providerData = user.providerData;
    $("#messages").empty();
    glowOrange($("#messages"), `<img src="${currentUser.photoURL}" class="user-pic img-responsive circle">Welcome ${currentUser.displayName}!`);
    // update firebase with the order in which players have arrived
    database.ref("players").once("value").then(function(snapshot){
      var players = snapshot.val();
      // If you're the first one here...
      if (players.player1 === "") {
        database.ref("players/player1").set(currentUser.displayName);
        playerNum = "player1";
        signedIn = true;
        // a little timeout just for the appearance of it
        setTimeout(function() {
          glowOrange($("#messages"), "Now waiting for Player 2...");
        }, 1000);
      } else if (players.player2 === "") { // if you're the second one here...
        database.ref("players/player2").set(currentUser.displayName);
        playerNum = "player2";
        signedIn = true;
        // a little timeout just for the appearance of it
        setTimeout(function() {
          glowOrange($("#messages"), players.player1 + " is already waiting for you!");
        }, 1000);
      } else {
        glowOrange($("#messages"), `Sorry, ${players.player1} is playing ${players.player2} right now. Wait for one of them to sign out.`)
      }
    });
    // TODO: fix the fact that if one player reloads the page they are now playing themself
  } else if (!user) {
    // User is signed out.
    console.log("no user");
    
  }
}

// Sign in w email and password
$("#profile-input").submit(function (e) {
  e.preventDefault();
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(handleAuthError);
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

// Make Materialize toasts dismissible with click
$(document).on("click", ".toast", function () {
  $(this).fadeOut(function () {
    $(this).remove();
  });
});