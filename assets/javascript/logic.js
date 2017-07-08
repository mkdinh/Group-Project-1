 // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  $('.collapsible').collapsible();

 $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });

 $("#login").click(function (e) { 
   e.preventDefault();
   $("#login-modal").modal('open');
 });

 $("#profile-input").submit(function (e) { 
  e.preventDefault();
  firebase.auth().signInWithEmailAndPassword(email, password)
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