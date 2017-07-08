//VARIABLES
var longitude = "";
var latitude = "";
var todaysDate;
var cityName;
var countryCode;




//FUNCTIONS

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
    
    getWeather();
    
}

function reverseGeo(long, lat) {
    var apiKey = "AIzaSyD4ya-QQ9KFOYVNcp-ejxBwaY_NeZ0txBE";
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ lat +","+ long +"&key=" + apiKey;
    
    //ajax call
       $.ajax({
        type:"GET",
        url: url,
        async: false,
        dataType: "json",
        success: function(data){
            console.log(data);
            cityName = data.results[0].address_components[0].long_name;
            countryCode = data.results[0].address_components[4].short_name;
            
            console.log(cityName + ", " + countryCode);
        },
        error: function(errorMessage){
            alert("Error" + errorMessage);
        }
    })
}

function getWeather(){
        //CORS prefix
        var cors = "https://cors-anywhere.herokuapp.com/";
        //API URL
         var url = cors +"https://api.darksky.net/forecast/ef8d2f0e9af37edb6fa8639b613e662d/"+ latitude +","+ longitude;


         //ajax call
           $.ajax({
            type:"GET",
            url: url,
            async: true,
            dataType: "json",
            success: function(data){
                
            },
            error: function(errorMessage){
                alert("Error" + errorMessage);
            }
        });
}

function getWeekDays() {
    var date = new Date();
    var weekday = date.getDay();
    var fullWeekday;
    var days = [];
    
    //gets the 5 days
    for(var i = 0; i < 7; i++){
        
        switch(weekday) {
            case 0:
                fullWeekday = "Sunday";
                $("#day"+i).text(fullWeekday);
                console.log(weekday + " " + fullWeekday);
                break;
            case 1:
                fullWeekday = "Monday";
                $("#day"+i).text(fullWeekday);
                console.log(weekday + " " + fullWeekday);
                break;
            case 2:
                fullWeekday = "Tuesday";
                $("#day"+i).text(fullWeekday);
                console.log(weekday + " " + fullWeekday);
                break;
            case 3:
                fullWeekday = "Wednesday";
                $("#day"+i).text(fullWeekday);
                console.log(weekday + " " + fullWeekday);
                break;
            case 4:
                fullWeekday = "Thursday";
                $("#day"+i).text(fullWeekday);
                console.log(weekday + " " + fullWeekday);
                break;
            case 5:
                fullWeekday = "Friday";
                $("#day"+i).text(fullWeekday);
                console.log(weekday + " " + fullWeekday);
                break;
            case 6:
                fullWeekday = "Saturday";
                $("#day"+i).html(fullWeekday);
                console.log(weekday + " " + fullWeekday);
                break;

        }
        weekday++;
        if(weekday === 7){
            weekday = 0;
        }
    }
    
}


// Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  $('.collapsible').collapsible();

 $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    
     getLocation();
     getWeekDays();
  });




