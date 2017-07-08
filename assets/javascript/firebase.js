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

var database = firebase.database();
var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

// show modal on load

// $(window).on("load", function(){
// 	$('#signUp-modal').modal('open');
// })

$('#submit-login').click(function(event){
	
})

// var first_name;
// var last_name;
// var email;
// var password;
// var city;
// var zip;

// $('#submit-login').click(function(event){
// 	console.log('try to login')
// 	event.preventDefault()
// 	userInfo = {
// 		first: $("#first_name").val().trim(),
// 		last: $("#last_name").val().trim(),
// 		email: $("#email").val().trim(),
// 		password: $("#password").val().trim(),
// 		city: $("#city").val().trim(),
// 		zip: $("#zip").val().trim(),
// 	}

// 	console.log(userInfo)
// })

// function GrabSignUpForm(){}
