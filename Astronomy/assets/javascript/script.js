var longitude;
var latitude;
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
    //API url with searchTerm
       //if location radio is checked set url to be url with their 
       if($("#location").checked){
        getLocation();
        var url = "http://api.predictthesky.org/events/all&lat="+ latitude + "&long=" + longitude + "&limit=10&date="+ date;
    }
    
       
       //ajax call
       $.ajax({
        type:"GET",
        url: url,
        async: false,
        dataType: "json",
        success: function(data){
            
        },
        error: function(errorMessage){
            alert("Error" + errorMessage);
        }
    })
});
   });