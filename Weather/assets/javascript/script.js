var longitude;
var latitude;
var satLong;
var satLat;
var distance;
var satSpeed;
var meteorShowers = {
    0: {
        active: "Jan 1 - Jan 10",
        peakNight: "Jan 2-3",
        name: "Quadrantids",
        Radiant: "15:18 +49.5",
        ZHR: 120,
        Velocity: 26, //miles/sec
        ParentObj: "2003 EH (Asteroid)"
    },
    1: {
        active: "Apr 16 - Apr 25",
        peakNight: "Apr 21-22",
        name: "Lyrids",
        Radiant: "18:04 +34",
        ZHR: 18,
        Velocity: 30, //miles/sec
        ParentObj: "C/1861 G1 (Thatcher)"
    },
    2: {
        active: "Apr 19 - Apr May 26",
        peakNight: "May 6-7",
        name: "Eta Aquariids",
        Radiant: "22:32 -1",
        ZHR: 55,
        Velocity: 42, //miles/sec
        ParentObj: "1P/Halley"
    },
    3: {
        active: "Jul 21 - Aug 23",
        peakNight: "Jul 29-30",
        name: "Southern Delta Aquariids",
        Radiant: "22:40 -16.4",
        ZHR: 16,
        Velocity: 26, //miles/sec
        ParentObj: "96P/Machholz"
    },
    4: {
        active: "Jul 11 - Aug 10",
        peakNight: "Jul 26-27",
        name: "Alpha Capriconids",
        Radiant: "20:28 -10.2",
        ZHR: 5,
        Velocity: 15, //miles/sec
        ParentObj: "169P/NEAT"
    },
    5: {
        active: "Jul 13 - Aug 26",
        peakNight: "Aug 11-12",
        name: "Perseids",
        Radiant: "03:12 +57.6",
        ZHR: 100,
        Velocity: 37, //miles/sec
        ParentObj: "109P/Swith-Thuttle"
    },
    6: {
        active: "Oct 4 - Nov 14",
        peakNight: "Oct 21-22",
        name: "Orionids",
        Radiant: "06:20 +15.5",
        ZHR: 25,
        Velocity: 41, //miles/sec
        ParentObj: "1P/Halley"
    },
    7: {
        active: "Sep 7 - Nov 19",
        peakNight: "Oct 9-10",
        name: "Southern Taurids",
        Radiant: "02:08 +8.7",
        ZHR: 5,
        Velocity: 17, //miles/sec
        ParentObj: "2P/Encke"
    },
    8: {
        active: "Oct 19 - Dec 10",
        peakNight: "Nov 10-11",
        name: "Northern Taurids",
        Radiant: "03:52 +22.7",
        ZHR: 5,
        Velocity: 18, //miles/sec
        ParentObj: "2P/Encke"
    },
    9: {
        active: "Nov 5 - Nov 30",
        peakNight: "Nov 17-18",
        name: "Leonids",
        Radiant: "10:08 +21.6",
        ZHR: 15,
        Velocity: 44, //miles/sec
        ParentObj: "55P/Temple-Tuttle"
    },
    10: {
        active: "Dec 4 - Dec 16",
        peakNight: "Dec 13-14",
        name: "Geminids",
        Radiant: "07:28 +32.2",
        ZHR: 120,
        Velocity: 22, //miles/sec
        ParentObj: "3200 Phaethon (asteroid)"
    },
    11: {
        active: "Dec 17 - Dec 23",
        peakNight: "Dec 21-22",
        name: "Ursids",
        Radiant: "14:28 +74.8",
        ZHR: 10,
        Velocity: 20, //miles/sec
        ParentObj: "8P/Tuttle"
    },
}

function getMeteorShower() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    month++;
    
    switch(month){
        case 1:
            month = "Jan"
            break;
        case 2:
            month = "Feb"
            break;
        case 3:
            month = "Mar"
            break;
        case 4:
            month = "Apr"
            break;
        case 5:
            month = "May"
            break;
        case 6:
            month = "Jun"
            break;
        case 7:
            month = "Jul"
            break;
        case 8:
            month = "Aug"
            break;
        case 9:
            month = "Sep"
            break;
        case 10:
            month = "Oct"
            break;
        case 11:
            month = "Nov"
            break;
        case 12:
            month = "Dec"
            break;    
                }
    
    console.log(month);
    for ( var i = 0; i < 12; i++){
        var activeSplit = meteorShowers[i].active.split(" ");
        var activeStartMonth = activeSplit[0];
        var activeDay1 = activeSplit[1];
        var activeEndMonth = activeSplit[3];
        var activeDay2 = activeSplit[4];
        
        //console.log(month === activeStartMonth || month === activeEndMonth);
        
        
        if(month === activeStartMonth || month === activeEndMonth && day >= activeDay1 && day <= activeDay2){
                console.log("Meteor Shower: " +  meteorShowers[i].name + " | Active: " + meteorShowers[i].active + " | Peak nights to view: " + meteorShowers[i].peakNight);
        }
        
        var peakSplit = meteorShowers[i].peakNight.split(" ");
        var peakMonth = peakSplit[0];
        var peakDays = peakSplit[1].split("-");
        var peakDay1 = peakDays[0];
        var peakDay2 = peakDays[1];
        if(peakMonth === month){
            if(day >= peakDay1 && day <= peakDay2){
               console.log("Peak Days"); 
            }
            
        }
    }
    
    
}

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
        //console.log(data);
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
        
        //console.log(data);
    },
    error: function(errorMessage){
        alert("Error" + errorMessage);
    }
    });
            
    
}

function getSolar(){
    var coords = [longitude, latitude];
    var d = new Date();
    var year = d.getFullYear();
   
    var url = "http://api.usno.navy.mil/eclipses/solar?year="+ year;
    
     //ajax call
    $.ajax({
    type:"GET",
    url: url,
    async: false,
    dataType: "json",
    success: function(data){
        //console.log(data);
        
        var i = 0;
        $.each(data.eclipses_in_year, function(){
            var d = new Date()
            var day = d.getDate();
            var month = d.getMonth();
            var year = d.getFullYear();
    
            if(data.eclipses_in_year[i].month >= month && data.eclipses_in_year[i].year >= year){
                var p = $("<p>");
                p.text(data.eclipses_in_year[i].event);
                $("#solar").append(p);
            }
            
            i++;
        })
        
    },
    error: function(errorMessage){
        alert("Error" + errorMessage);
    }
        });
}

function getMoonPhases(){
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    
    var dateFormat = (month + 1) + "/" + day + "/" + year;
    
   
    var url = "http://api.usno.navy.mil/moon/phase?date="+ dateFormat + "&nump=7";
    
     //ajax call
    $.ajax({
    type:"GET",
    url: url,
    async: false,
    dataType: "json",
    success: function(data){
        console.log(data);
        for(var i = 0; i < 7; i++){
            var p = $("<p>");
            p.text(data.phasedata[i].phase);
            $("#day" + i).append("Moon Phase:");
            $("#day" + i).append(p);
        }
        /*var i = 0;
        $.each(data.eclipses_in_year, function(){
            var d = new Date()
            var day = d.getDate();
            var month = d.getMonth();
            var year = d.getFullYear();
    
            if(data.eclipses_in_year[i].month >= month && data.eclipses_in_year[i].year >= year){
                var p = $("<p>");
                p.text(data.eclipses_in_year[i].event);
                $("#solar").append(p);
                console.log(i);
            }
            
            i++;
        })*/
        
    },
    error: function(errorMessage){
        alert("Error" + errorMessage);
    }
        }); 
}


function wikiInfo() {
     //Gets search input
    var searchTerm = "Asteroid";
    //API url with searchTerm
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ searchTerm +"&format=json&callback=?";
       
       //ajax call
       $.ajax({
        type:"GET",
        url: url,
        async: false,
        dataType: "json",
        success: function(data){
            console.log(data[3][0]);
            $("wikid0").html("<a href=" + data[3][0] + " title=" + data[2][0] + "</a>");
            
        },
        error: function(errorMessage){
            alert("Error" + errorMessage);
        }
    })
}


$(document).ready(function(){
    getAPOD();
    getAsteroids();
    getAudImgs();
    getLocation();
    getSolar();
    getMoonPhases();
    wikiInfo();
    getMeteorShower();
    
});