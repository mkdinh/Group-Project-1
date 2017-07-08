var longitude;
var latitude;
var todaysDate;

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }else {
        console.log("Error: Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    
    console.log("Latitude: " + latitude + " Longitude: " + longitude);
}

function getTodaysDate() {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();
    todaysDate = y + "/" + m + "/" + d
}

//Run some jQuery
$(document).ready(function(){
    
    
    
    //set up for search hints
    /*var availableTags = [
        "Clusters",
        "Comet",
        "Constellation",
        "Eclipse",
        "Equinox",
        "Galaxy",
        "Gamma Ray",
        "Jupiter's Moon",
        "Light Year",
        "Meteor",
        "Meteoroids",
        "Micometeorites",
        "Milky Way",
        "Minor Planet",
        "Moon",
        "Moon Phases",
        "Nebula",
        "Neutron Star",
        "Nova",
        "Orbit",
        "Orion Constellation",
        "Orion Spacecraft",
        "Ozone",
        "Parallax",
        "Phases",
        "Planet",
        "Planetary Nebula",
        "Satellite",
        "Seyfert Galaxies",
        "Shooting Star",
        "Solar System",
        "Solstice", 
        "Stratosphere",
        "Star", 
        "Supernova",
        "Sun",
        "Sun Flares",
        "Sun Spots",
        "Superior Planets"
    ];
    $( "#searchTerm" ).autocomplete({
      source: availableTags
    });*/
    
    //when search is clicked run code
   $("#search").click(function(){
       //clears output div
       $("#output").html("");
    //Gets search input
    var searchTerm = $("#searchTerm").val().trim();
       
    //Gets Date
    var date = $("#date").val();
    
    //get users location
    getLocation();
    getTodaysDate();
       
    //API url with searchTerm, longitude, latitude, and date
    var url = "http://api.predictthesky.org/events/all&lat="+ latitude + "&long=" + longitude + "&limit=10&date="+ todaysDate;
    
    "http://api.predictthesky.org/events/all&lat=35.9000918&long=-79.0124182"
       
       //ajax call
       $.ajax({
        type:"GET",
        url: url,
        async: false,
        dataType: "json",
        success: function(data){
            console.log(data);
        },
        error: function(errorMessage){
            alert("Error" + errorMessage);
        }
    })
});
   });