var todaysDate;
var latitude;
var longitude;
var meteorShowers = {
    0: {
        active: "Jan 1 - Jan 10",
        yearly: true,
        peakNight: "Jan 2-3",
        name: "Quadrantids",
        Radiant: "15:18 +49.5",
        ZHR: 120,
        Velocity: 26, //miles/sec
        ParentObj: "2003 EH (Asteroid)"
    },
    1: {
        active: "Apr 16 - Apr 25",
        yearly: true,
        peakNight: "Apr 21-22",
        name: "Lyrids",
        Radiant: "18:04 +34",
        ZHR: 18,
        Velocity: 30, //miles/sec
        ParentObj: "C/1861 G1 (Thatcher)"
    },
    2: {
        active: "Apr 19 - May 26",
        yearly: true,
        peakNight: "May 6-7",
        name: "Eta Aquariids",
        Radiant: "22:32 -1",
        ZHR: 55,
        Velocity: 42, //miles/sec
        ParentObj: "1P/Halley"
    },
    3: {
        active: "Jul 11 - Aug 10",
        yearly: true,
        peakNight: "Jul 26-27",
        name: "Alpha Capriconids",
        Radiant: "20:28 -10.2",
        ZHR: 5,
        Velocity: 15, //miles/sec
        ParentObj: "169P/NEAT"
    },
    4: {
        active: "Jul 13 - Aug 26",
        yearly: true,
        peakNight: "Aug 11-12",
        name: "Perseids",
        Radiant: "03:12 +57.6",
        ZHR: 100,
        Velocity: 37, //miles/sec
        ParentObj: "109P/Swith-Thuttle"
    },
    5: {
        active: "Jul 21 - Aug 23",
        yearly: true,
        peakNight: "Jul 29-30",
        name: "Southern Delta Aquariids",
        Radiant: "22:40 -16.4",
        ZHR: 16,
        Velocity: 26, //miles/sec
        ParentObj: "96P/Machholz"
    },
    6: {
        active: "Sep 7 - Nov 19",
        yearly: true,
        peakNight: "Oct 9-10",
        name: "Southern Taurids",
        Radiant: "02:08 +8.7",
        ZHR: 5,
        Velocity: 17, //miles/sec
        ParentObj: "2P/Encke"
    },
    7: {
       active: "Oct 4 - Nov 14",
        yearly: true,
        peakNight: "Oct 21-22",
        name: "Orionids",
        Radiant: "06:20 +15.5",
        ZHR: 25,
        Velocity: 41, //miles/sec
        ParentObj: "1P/Halley" 
    },
    8: {
        active: "Oct 19 - Dec 10",
        yearly: true,
        peakNight: "Nov 10-11",
        name: "Northern Taurids",
        Radiant: "03:52 +22.7",
        ZHR: 5,
        Velocity: 18, //miles/sec
        ParentObj: "2P/Encke"
    },
    9: {
        active: "Nov 5 - Nov 30",
        yearly: true,
        peakNight: "Nov 17-18",
        name: "Leonids",
        Radiant: "10:08 +21.6",
        ZHR: 15,
        Velocity: 44, //miles/sec
        ParentObj: "55P/Temple-Tuttle"
    },
    10: {
        active: "Dec 4 - Dec 16",
        yearly: true,
        peakNight: "Dec 13-14",
        name: "Geminids",
        Radiant: "07:28 +32.2",
        ZHR: 120,
        Velocity: 22, //miles/sec
        ParentObj: "3200 Phaethon (asteroid)"
    },
    11: {
        active: "Dec 17 - Dec 23",
        yearly: true,
        peakNight: "Dec 21-22",
        name: "Ursids",
        Radiant: "14:28 +74.8",
        ZHR: 10,
        Velocity: 20, //miles/sec
        ParentObj: "8P/Tuttle"
    },
};

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
    
    for ( var i = 0; i < 12; i++){
        var activeSplit = meteorShowers[i].active.split(" ");
        var activeStartMonth = activeSplit[0];
        var activeDay1 = activeSplit[1];
        var activeEndMonth = activeSplit[3];
        var activeDay2 = activeSplit[4];
        var yearly = meteorShowers[i].yearly;
        
        
        
        //console.log(month === activeStartMonth || month === activeEndMonth);
        
        if(month === activeStartMonth && day <= activeDay1 || month === activeEndMonth && day <= activeDay2 ){
            
            var table = $("<table>");
            var h3 = $("<h3>");
            
            table.attr("border", 1);
            table.attr("frame", "void");
            table.attr("rules", "all");
            
            h3.text(activeStartMonth + " " + activeDay1 + " - " + activeEndMonth + " " + activeDay2);
            
            $("#accordion7").append(h3);
            
            var headings = $("<tr>");
            headings.html("<th>Name</th><th>Peak viewing nights</th><th>Velocity</th><th>Parent Object</th>");
            var information = $("<tr>");
            information.html("<td style='padding: 0 10px 0 10px'>" + meteorShowers[i].name + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].peakNight + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].Velocity + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].ParentObj + "</td>");
            table.append(headings);
            table.append(information);
            $("#accordion7").append(table).accordion('destroy').accordion();
            
        }
        
        //month view
        
        if(month === activeStartMonth || month === activeEndMonth){
            var table = $("<table>");
            var h3 = $("<h3>");
            
            table.attr("border", 1);
            table.attr("frame", "void");
            table.attr("rules", "all");
            
            h3.text(activeStartMonth + " " + activeDay1 + " - " + activeEndMonth + " " + activeDay2);
            
            $("#accordion8").append(h3);
            
            var headings = $("<tr>");
            headings.html("<th>Name</th><th>Peak viewing nights</th><th>Velocity</th><th>Parent Object</th>");
            var information = $("<tr>");
            information.html("<td style='padding: 0 10px 0 10px'>" + meteorShowers[i].name + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].peakNight + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].Velocity + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].ParentObj + "</td>");
            table.append(headings);
            table.append(information);
            $("#accordion8").append(table).accordion('destroy').accordion();
        }
        
        
        //year view
        if (yearly === true){
            var table = $("<table>");
            var h3 = $("<h3>");
            
            table.attr("border", 1);
            table.attr("frame", "void");
            table.attr("rules", "all");
            
            h3.text(activeStartMonth + " " + activeDay1 + " - " + activeEndMonth + " " + activeDay2);
            
            $("#accordion9").append(h3);
            
            var headings = $("<tr>");
            headings.html("<th>Name</th><th>Peak viewing nights</th><th>Velocity</th><th>Parent Object</th>");
            var information = $("<tr>");
            information.html("<td style='padding: 0 10px 0 10px'>" + meteorShowers[i].name + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].peakNight + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].Velocity + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].ParentObj + "</td>");
            table.append(headings);
            table.append(information);
            $("#accordion9").append(table).accordion('destroy').accordion();    
        }
        
        
        
        var peakSplit = meteorShowers[i].peakNight.split(" ");
        var peakMonth = peakSplit[0];
        var peakDays = peakSplit[1].split("-");
        var peakDay1 = peakDays[0];
        var peakDay2 = peakDays[1];
        if(peakMonth === month){
            if(day >= peakDay1 && day <= peakDay2){
               //console.log("Peak Days"); 
            }
            
        }
    }
    
    
}

//get a list of solar eclipses
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
            var table = $("<table>");
            var h3 = $("<h3>");
            var eMonth = data.eclipses_in_year[i].month;
            switch(eMonth){
        case 1:
            eMonth = "January"
            break;
        case 2:
            eMonth = "February"
            break;
        case 3:
            eMonth = "March"
            break;
        case 4:
            eMonth = "April"
            break;
        case 5:
            eMonth = "May"
            break;
        case 6:
            eMonth = "June"
            break;
        case 7:
            eMonth = "July"
            break;
        case 8:
            eMonth = "August"
            break;
        case 9:
            eMonth = "September"
            break;
        case 10:
            eMonth = "October"
            break;
        case 11:
            eMonth = "November"
            break;
        case 12:
            eMonth = "December"
            break;    
                }
            
            table.attr("border", 1);
            table.attr("frame", "void");
            table.attr("rules", "all");
            
            //set up year view
            if (data.eclipses_in_year[i].year === year){
                h3.text(eMonth + " " + data.eclipses_in_year[i].day + ", " + data.eclipses_in_year[i].year);
                $("#accordion6").append(h3);
                var headings = $("<tr>");
                headings.html("<th>Event</th><th>Link</th>");
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.eclipses_in_year[i].event + "</td><td style='padding: 0 10px 0 10px'>" + "wikilink goes here" + "</td>");
                table.append(headings);
                table.append(information);
                 $("#accordion6").append(table).accordion('destroy').accordion();
            }
            
            //set up month view
            if(data.eclipses_in_year[i].month === month && data.eclipses_in_year[i].year === year){
                var h3 = $("<h3>");
                var table = $("<table>");
                h3.text(data.eclipses_in_year[i].month + " " + data.eclipses_in_year[i].day + ", " + data.eclipses_in_year[i].year);
                $("#accordion5").append(h3);
                var headings = $("<tr>");
                headings.html("<th>Event</th><th>Link</th>");
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.eclipses_in_year[i].event + "</td><td style='padding: 0 10px 0 10px'>" + "wikilink goes here" + "</td>");
                table.append(headings);
                table.append(information);
                 $("#accordion5").append(table).accordion('destroy').accordion();
            }else {
                var h3 = $("<h3>");
                h3.text("No eclipse this month, switch to year view to see upcoming eclipse information");
                $("#accordion5").append(h3).accordion('destroy').accordion();
            }
            
            //set up day view
            if(data.eclipses_in_year[i].day === day && data.eclipses_in_year[i].month === month && data.eclipses_in_year[i].year === year){
                var h3 = $("<h3>");
                var table = $("<table>");
                h3.text(data.eclipses_in_year[i].month + " " + data.eclipses_in_year[i].day + ", " + data.eclipses_in_year[i].year);
                $("#accordion4").append(h3);
                var headings = $("<tr>");
                headings.html("<th>Event</th><th>Link</th>");
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.eclipses_in_year[i].event + "</td><td style='padding: 0 10px 0 10px'>" + "wikilink goes here" + "</td>");
                table.append(headings);
                table.append(information);
                 $("#accordion4").append(table).accordion('destroy').accordion();
            }else {
                h3.text("No eclipse today, switch to year view to see upcoming eclipse information");
                $("#accordion4").append(h3).accordion('destroy').accordion();
            }
            
            i++;
        })
        
    },
    error: function(errorMessage){
        alert("Error");
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
    
    var dayEvents = [];
    var weekEvents = [];
    var dates = [];
    
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
                
                //create an object with information needed about asteroids
                var currentObj = nearObject[date];
                for (var i = 0; i < nearObject[date].length; i++){
                   var info = {
                       date: newDate,
                       name: currentObj[i].name,
                       missEarth: Math.round(currentObj[i].close_approach_data[0].miss_distance.miles).toLocaleString("en-US", {minimumFractionDigits: 0}), 
                       speed: Math.round(currentObj[i].close_approach_data[0].relative_velocity.miles_per_hour).toLocaleString("en-US", {minimumFractionDigits: 0}), 
                       diameterMax:Math.round(currentObj[i].estimated_diameter.feet.estimated_diameter_max).toLocaleString("en-US", {minimumFractionDigits: 0}), 
                       diameterMin:Math.round(currentObj[i].estimated_diameter.feet.estimated_diameter_min).toLocaleString("en-US", {minimumFractionDigits: 0}), 
                       danger:currentObj[i].is_potentially_hazardous_asteroid,
                       name: currentObj[i].name
                   } 
                   
                   if(info.date === todaysDate) {
                       
                       dayEvents.push(info);
                   }
                           
                   weekEvents.push(info);
                    
               } 
                day++;
            });
           
        },
        error: function(errorMessage){
            alert("Error" + errorMessage);
        }
    });
    
    //completes accordion for day view
    for(var i = 0; i < dayEvents.length; i++){
        var h3 = $("<h3>");
        var table = $("<table>");
        table.attr("border", 1);
        table.attr("frame", "void");
        table.attr("rules", "all");
        h3.text(dayEvents[i].name);
        //$("#accordion2").append(h3);
        $("#accordion2").append(h3);
       
        var heading = $("<tr>");
        heading.html("<th>Missing Earth (Miles)</th><th>Speed (MPH)</th><th>Max Diameter(Miles)</th><th>Min diameter (Miles)</th><th>Dangerous</th>");
        
        var information = $("<tr>");
        information.html("<td>" + dayEvents[i].missEarth + "</td><td>"+ dayEvents[i].speed +"</td><td>"+  dayEvents[i].diameterMax +"</td><td>"+ dayEvents[i].diameterMin +"</td><td>"+ dayEvents[i].danger +"</td>");
        table.append(heading);
        table.append(information);
       
        $("#accordion2").append(table).accordion('destroy').accordion();
        
    }
    
    
    //Sets up accordion for week view
    var key = "";
    for (var i = 0; i < weekEvents.length; i++){
        
        if(weekEvents[i].date !== weekEvents[i + 1].date){
            
            //variables and declarations
            key = weekEvents[i + 1].date;
            var h3 = $("<h3>");
            var heading = $("<tr>");
            h3.text(weekEvents[i].date);
            var table = $("<table>");
            
            table.attr("border", 1);
            table.attr("frame", "void");
            table.attr("rules", "all");
            
            $("#accordion3").append(h3);
            
            heading.html("<th>Name</th><th>Missing Earth (Miles)</th><th>Speed (MPH)</th><th>Max Diameter(Miles)</th><th>Min diameter (Miles)</th><th>Dangerous</th>");
            
            table.append(heading);
            
            for (var j = 0; j < weekEvents.length; j++){
                if(weekEvents[j].date === h3.text()){
                    
                    var information = $("<tr>");
                    information.html("<td>"+ weekEvents[j].name +"</td><td>" + weekEvents[j].missEarth + "</td><td>"+ weekEvents[j].speed +"</td><td>"+  weekEvents[j].diameterMax +"</td><td>"+ weekEvents[j].diameterMin +"</td><td>"+ weekEvents[j].danger +"</td>");
                    
                    table.append(information);
                }
                
            } $("#accordion3").append(table).accordion('destroy').accordion();
        }
    }   
}

function getTodaysDate(){
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var nDate = year + "/" + (month + 1) + "/" + day;
    var dateFormat = "YYYY/MM/DD";
    var convertedDate = moment(nDate, dateFormat);
    
    switch(month){
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:
            month = "December";
            break;    
        }
    
    todaysDate = convertedDate.format("MMMM Do YYYY");
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
        /*for(var i = 0; i < 7; i++){
            var p = $("<p>");
            p.text(data.phasedata[i].phase);
            $("#day" + i).append("Moon Phase:");
            $("#day" + i).append(p);
        }*/
        var i = 0;
        $.each(data.phasedata, function(){
            var d = new Date()
            var day = d.getDate();
            var month = d.getMonth();
            month++;
            var year = d.getFullYear();
            var moonDate = data.phasedata[i].date.split(" ");
            var moonDay = moonDate[2];
            var moonMonth = moonDate[1];
            var moonYear = moonDate[0];
            
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
            moonYearonth = "Nov"
            break;
        case 12:
            month = "Dec"
            break;    
                }
            
            //day view
            if(moonMonth === month && moonDay === day && moonYear === year){
                var table = $("<table>");
                var h3 = $("<h3>");

                table.attr("border", 1);
                table.attr("frame", "void");
                table.attr("rules", "all");
                
                h3.text(moonMonth + " " + moonDay + ", " + moonYear);

                $("#accordion10").append(h3);

                var headings = $("<tr>");
                headings.html("<th>Phase</th>");
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.phasedata[i].phase + "</td>");
                table.append(headings);
                table.append(information);
                $("#accordion10").append(table).accordion('destroy').accordion();    
            } 
            
            console.log(moonMonth + " " + moonDay + "," + moonYear + " | " + month + " " + day + ", " + year + " - " + month + " " + (day + 6) + ", " + year);
            
            console.log(moonMonth == month && moonDay >= day && moonDay <= (day + 6));
            
            //week view 
            if(moonMonth == month && moonDay >= day && moonDay <= (day + 6)){
                var table = $("<table>");
                var h3 = $("<h3>");

                table.attr("border", 1);
                table.attr("frame", "void");
                table.attr("rules", "all");
                
                h3.text(moonMonth + " " + moonDay + ", " + moonYear);

                $("#accordion11").append(h3);

                var headings = $("<tr>");
                headings.html("<th>Phase</th>");
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.phasedata[i].phase + "</td>");
                table.append(headings);
                table.append(information);
                $("#accordion11").append(table).accordion('destroy').accordion();    
            } 
               
            
            //month view
            if(moonMonth == month && moonYear == year){
                var table = $("<table>");
                var h3 = $("<h3>");

                table.attr("border", 1);
                table.attr("frame", "void");
                table.attr("rules", "all");
                
                h3.text(moonMonth + " " + moonDay + ", " + moonYear);

                $("#accordion12").append(h3);

                var headings = $("<tr>");
                headings.html("<th>Phase</th>");
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.phasedata[i].phase + "</td>");
                table.append(headings);
                table.append(information);
                $("#accordion12").append(table).accordion('destroy').accordion();        
            }
            
            
            i++;
        })
        
    },
    error: function(errorMessage){
        alert("Error" + errorMessage);
    }
        }); 
}

$(document).ready(function(){
    getSolar();
    getMeteorShower();
    getMoonPhases();
   getTodaysDate();
    getAsteroids();
    
});
