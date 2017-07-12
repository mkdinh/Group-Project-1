var longitude;
var latitude;
var satLong;
var satLat;
var distance;
var satSpeed;


//requests permission to get access to users long and lat.
function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }else {
        console.log("Error: Geolocation is not supported by this browser.");
    }
    
}

//gets lat and long losition of user
function showPosition(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    
    //console.log("Latitude: " + latitude + " Longitude: " + longitude);
    
}

//gets Astronomical Picture Of the Day
function getAPOD(){
    var image;
    var apiKey = "FMWfaT1C1igzEgHUsZOK4ZUlCGACf42bmV2i9GYM";
    var url = "https://api.nasa.gov/planetary/apod?api_key=" + apiKey;
    
    //ajax call
       $.ajax({
        type:"GET",
        url: url,
        async: false,
        dataType: "json",
        success: function(data){
            var img = $("<img>");
            var p = $("<p>");
            img.attr("src", data.hdurl); 
            p.text(data.explanation);
            $("#imageOfTheDay").append(img);
            $("#info").append(p);
        },
        error: function(errorMessage){
            alert("Error" + errorMessage);
        }
    });
}

//gets information for asteroids close to earth from todays date through 7 days
function getAsteroids(){
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth();
    var yyyy = date.getFullYear();
    var startDate = yyyy +"-"+ (mm + 1) + "-"+ dd; 
    var endDate = yyyy +"-"+ (mm + 1) + "-"+ (dd + 6);
    var apiKey = "FMWfaT1C1igzEgHUsZOK4ZUlCGACf42bmV2i9GYM";
    var url = "https://api.nasa.gov/neo/rest/v1/feed?start_date="+ startDate + "&end_date="+ endDate +"&api_key="+ apiKey;
    
    
    //ajax call
       $.ajax({
        type:"GET",
        url: url,
        async: false,
        dataType: "json",
        success: function(data){
            var day = 0;
            var nearObject = data.near_earth_objects;
            var keys = Object.keys(nearObject);
            
            keys.sort();
            
            $.each(keys, function(){
                var date = keys[day];
                var dateFormat = "YYYY/MM/DD";
                var convertedDate = moment(date, dateFormat);
                var newDate = convertedDate.format("MMMM Do YYYY");
                $("#day" + day + " span").html(newDate);
                var currentObj = nearObject[date];
                for (var i = 0; i < nearObject[date].length; i++){
                   var info = {
                       missEarth: currentObj[i].close_approach_data[0].miss_distance.miles, 
                       speed: currentObj[i].close_approach_data[0].relative_velocity.miles_per_hour, 
                       diameterMax:currentObj[i].estimated_diameter.feet.estimated_diameter_max, 
                       diameterMin:currentObj[i].estimated_diameter.feet.estimated_diameter_min, 
                       danger:currentObj[i].is_potentially_hazardous_asteroid,
                       name: currentObj[i].name
                   } 
                   
                   var dangerous; 
                   if (info.danger === true) {
                       dangerous = "Yes";
                   }else if (info.danger === false){
                       dangerous = "No";
                   }
                   
                   $("#day" + day + " #content").html("Name: " + info.name +  "<br>Missing Earth by: " + info.missEarth + " miles. <br> Speed: " + Math.round(info.speed) + " MPH<br> Max Diameter: " + Math.round(info.diameterMax) + " Miles<br> Min Diameter: " + Math.round(info.diameterMin) + " Miles<br> Considered Dangerous: " + dangerous);
               } 
                day++;
            });           
        },
        error: function(errorMessage){
            alert("Error" + errorMessage);
        }
    });
}

//getting audio and images based on search terms
function getAudImgs(){
    var searchTerm = "moon";
    var url = "https://images-api.nasa.gov/search?q=" + searchTerm +"&media_type=image,audio";
    
    //ajax call
       $.ajax({
        type:"GET",
        url: url,
        async: false,
        dataType: "json",
        success: function(data){
            //console.log(data);
            //console.log(data.collection.items[2].href);
            newUrl = data.collection.items[2].href;
            
             //ajax call
            $.ajax({
            type:"GET",
            url: newUrl,
            async: false,
            dataType: "json",
            success: function(data){
                
            },
            error: function(errorMessage){
                alert("Error" + errorMessage);
            }
        });
            
            
            
        },
        error: function(errorMessage){
            alert("Error" + errorMessage);
        }
    });
}

function getSatellites(){
    var cors = "https://cors-anywhere.herokuapp.com/";
    var authURL = "https://www.space-track.org/ajaxauth/login?identity=jaycen9887@gmail.com&password=GitHubRepositories";
    
    //ajax call
    $.ajax(cors +"https://www.space-track.org/ajaxauth/login",{
    method:"POST",
    data: {identity: "jaycen9887@gmail.com", password: "GitHubRepositories"},
    crossDomain: true,
    success: function(data){
        data.setHeader("Access-Control-Allow-Origin", "https://www.space-track.org/");
        console.log(data);
    },
    error: function(errorMessage){
        alert("Error" + errorMessage);
    }
});
    
    //CORS prefix
    var cors = "https://cors-anywhere.herokuapp.com/";
    var url = "https://www.space-track.org/basicspacedata/query/class/satcat/orderby/SATNAME asc/metadata/false";
    //ajax call
    $.ajax("https://www.space-track.org/basicspacedata/query/class/satcat/orderby/SATNAME asc/metadata/false",{
    method:"GET",
    xhrFields: { withCredentials: true },
    crossDomain: true,
    success: function(data){
        
        console.log(data);
    },
    error: function(errorMessage){
        alert("Error" + errorMessage);
    }
    });
            
    
}


$(document).ready(function(){
    getAPOD();
    getAsteroids();
    getAudImgs();
    getLocation();
    
});