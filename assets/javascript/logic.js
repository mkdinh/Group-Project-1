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