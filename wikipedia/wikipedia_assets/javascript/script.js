//Run some jQuery
$(document).ready(function(){
    
    //set up for search hints
    var availableTags = [
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
    });
    
    //when search is clicked run code
   $("#search").click(function(){
       //clears output div
       $("#output").html("");
    //Gets search input
    var searchTerm = $("#searchTerm").val();
    //API url with searchTerm
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ searchTerm +"&format=json&callback=?";
       
       //ajax call
       $.ajax({
        type:"GET",
        url: url,
        async: false,
        dataType: "json",
        success: function(data){
            for(var i = 0; i <data[1].length; i++){
                $("#output").append("<li><a href="+ data[3][i] +">"+ data[1][i] + "</a><p>"+ data[2][i] +"</p><li>");
            }
            
            //removes empty li tags 
            $("#output li:empty").remove();
            
        },
        error: function(errorMessage){
            alert("Error" + errorMessage);
        }
    })
});
   });