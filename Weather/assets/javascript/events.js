var todaysDate;
var latitude;
var longitude;
var long;
var lat;
var map;
var l ;
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

function initMap(){
    var uluru = {lat: parseFloat(lat), lng: parseFloat(long)};
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: uluru
    });
    var icon = "assets/image.satellite.png";

    var marker = new google.maps.Marker({
        postition: uluru,
        icon: icon,
        map: map
    });
    }
function getISS(){
    var url = "https://api.wheretheiss.at/v1/satellites/25544/";

    //ajax call
    $.ajax({
        type:"GET",
        url: url,
        async: false,
        dataType: "json",
        success: function(data){
        long = data.longitude;
        lat = data.latitude;
    },
    error: function(errorMessage){
        alert("Error" + errorMessage);
    }
    });
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
        
        // day view
        if(month === activeStartMonth && day <= activeDay1 || month === activeEndMonth && day <= activeDay2 ){
            
            var li = $("<li>");
            var headerDiv = $("<div>");
            var bodyDiv = $("<div>");
            var span = $("<span>");
            var table = $("<table>");
            var thead = $("<thead>");
            var tbody = $("<tbody>");
            
            table.attr("border", 1);
            table.attr("frame", "void");
            table.attr("rules", "all");
            
            bodyDiv.addClass("collapsible-body");
            headerDiv.addClass("collapsible-header");
            
            headerDiv.text(activeStartMonth + " " + activeDay1 + " - " + activeEndMonth + " " + activeDay2);
            
            li.append(headerDiv);
            
            
            var headings = $("<tr>");
            headings.html("<th>Name</th><th>Peak viewing nights</th><th>Velocity</th><th>Parent Object</th><th>Wikipedia</th>");
            
            thead.append(headings);
            
            var information = $("<tr>");
            information.html("<td style='padding: 0 10px 0 10px'>" + meteorShowers[i].name + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].peakNight + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].Velocity + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].ParentObj + "</td><td style='padding: 0 10px 0 10px' id='dayMeteorWiki" + i + "'></td>");
            
            tbody.append(information);
            table.append(thead);
            table.append(tbody);
            span.append(table);
            bodyDiv.append(span);
            li.append(bodyDiv);
            $("#accordion6").append(li);
            
            wiki(meteorShowers[i].name, ($("#dayMeteorWiki" + i)));
        
            /*$("meteorWiki" + i).attr("href", $("meteorWiki" + i).text());*/
        }
        
        //month view
        
        if(month === activeStartMonth || month === activeEndMonth){
            var table = $("<table>");
            var li = $("<li>");
            var headerDiv = $("<div>");
            var bodyDiv = $("<div>");
            var span = $("<span>");
            var thead = $("<thead>");
            var tbody = $("<tbody>");
            
            table.attr("border", 1);
            table.attr("frame", "void");
            table.attr("rules", "all");
            
            
            bodyDiv.addClass("collapsible-body");
            headerDiv.addClass("collapsible-header");

            headerDiv.text(activeStartMonth + " " + activeDay1 + " - " + activeEndMonth + " " + activeDay2);

            li.append(headerDiv);
            
            var headings = $("<tr>");
            
            headings.html("<th>Name</th><th>Peak viewing nights</th><th>Velocity</th><th>Parent Object</th><th>Wikipedia</th>");
            
            thead.append(headings);
            
            var information = $("<tr>");
            information.html("<td style='padding: 0 10px 0 10px'>" + meteorShowers[i].name + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].peakNight + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].Velocity + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].ParentObj + "</td><td style='padding: 0 10px 0 10px' id='monthMeteorWiki" + i + "'></td>");
            
            tbody.append(information);
            table.append(thead);
            table.append(tbody);
            span.append(table);
            bodyDiv.append(span);
            li.append(bodyDiv);
            $("#accordion7").append(li);
            
            wiki(meteorShowers[i].name, ($("#monthMeteorWiki" + i)));
        }
        
        
        //year view
        if (yearly === true){
            var table = $("<table>");
            
            var li = $("<li>");
            var headerDiv = $("<div>");
            var bodyDiv = $("<div>");
            var span = $("<span>");
            var thead = $("<thead>");
            var tbody = $("<tbody>");

            bodyDiv.addClass("collapsible-body");
            headerDiv.addClass("collapsible-header");

            headerDiv.text(activeStartMonth + " " + activeDay1 + " - " + activeEndMonth + " " + activeDay2);

            li.append(headerDiv);
            
            table.attr("border", 1);
            table.attr("frame", "void");
            table.attr("rules", "all");
            
            var headings = $("<tr>");
            headings.html("<th>Name</th><th>Peak viewing nights</th><th>Velocity</th><th>Parent Object</th><th>Wikipedia</th>");
            
            thead.append(headings);
            
            var information = $("<tr>");
            information.html("<td style='padding: 0 10px 0 10px'>" + meteorShowers[i].name + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].peakNight + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].Velocity + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].ParentObj + "</td><td style='padding: 0 10px 0 10px' id='yearMeteorWiki" + i + "'></td>");
            tbody.append(information);
            table.append(thead);
            table.append(tbody);
            span.append(table);
            bodyDiv.append(span);
            li.append(bodyDiv);
            $("#accordion8").append(li); 
            
            wiki(meteorShowers[i].name, ($("#yearMeteorWiki" + i)));
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
        console.log(data);
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
            
            //set up year view
            if (data.eclipses_in_year[i].year === year){
                var li = $("<li>");
                var headerDiv = $("<div>");
                var bodyDiv = $("<div>");
                var span = $("<span>");
                var thead = $("<thead>");
                var tbody = $("<tbody>");
                
                wiki(data.eclipses_in_year[i].event, ($("#wiki" + i)));
                
                
                bodyDiv.addClass("collapsible-body");
                headerDiv.addClass("collapsible-header");

                headerDiv.text(eMonth + " " + data.eclipses_in_year[i].day + ", " + data.eclipses_in_year[i].year);

                li.append(headerDiv);
                
                var headings = $("<tr>");
                var table = $("<table>");
                
                table.attr("border", 1);
                table.attr("frame", "void");
                table.attr("rules", "all");
                
                headings.html("<th>Event</th><th>Wikipedia</th>");
                
                thead.append(headings);
                
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.eclipses_in_year[i].event + "</td><td style='padding: 0 10px 0 10px' id='daySolarWiki" + i + "'></td>");
                
                tbody.append(information);
                table.append(thead);
                table.append(tbody);
                span.append(table);
                bodyDiv.append(span);
                li.append(bodyDiv);
                
                 $("#accordion5").append(li);
                wiki(data.eclipses_in_year[i].event, ($("#daySolarWiki" + i)));
            }
                    
            //set up month view
            if(data.eclipses_in_year[i].month === month && data.eclipses_in_year[i].year === year){
                //console.log("Month");
                var li = $("<li>");
                var headerDiv = $("<div>");
                var bodyDiv = $("<div>");
                var span = $("<span>");
                var thead = $("<thead>");
                var tbody = $("<tbody>");

                bodyDiv.addClass("collapsible-body");
                headerDiv.addClass("collapsible-header");

                headerDiv.text(data.eclipses_in_year[i].month + " " + data.eclipses_in_year[i].day + ", " + data.eclipses_in_year[i].year);

                li.append(headerDiv);
                
                var headings = $("<tr>");
                var table = $("<table>");
                
                table.attr("border", 1);
                table.attr("frame", "void");
                table.attr("rules", "all");
                
                headings.html("<th>Event</th><th>Link</th>");
                
                thead.append(headings);
                
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.eclipses_in_year[i].event + "</td><td style='padding: 0 10px 0 10px' id='monthSolarWiki" + i + "'></td>");
                
                tbody.append(information);
                table.append(thead);
                table.append(tbody);
                span.append(table);
                bodyDiv.append(span);
                li.append(bodyDiv);
                 $("#accordion4").append(li);
                wiki(data.eclipses_in_year[i].event, ($("#monthSolarWiki" + i)));
            }/*else {
                var headerDiv = $("<div>");
                var bodyDiv = $("<div>");
                var span = $("<span>");
                
                bodyDiv.addClass("collapsible-body");
                headerDiv.addClass("collapsible-header");

                headerDiv.text("No eclipse today, switch to year view to see upcoming eclipse information");

                li.append(headerDiv);
                
                $("#accordion4").append(li);
            }*/
            
            //set up day view
            if(data.eclipses_in_year[i].day === day && data.eclipses_in_year[i].month === month && data.eclipses_in_year[i].year === year){
                var li = $("<li>");
                var headerDiv = $("<div>");
                var bodyDiv = $("<div>");
                var span = $("<span>");
                var thead = $("<thead>");
                var tbody = $("<tbody>");

                bodyDiv.addClass("collapsible-body");
                headerDiv.addClass("collapsible-header");

                headerDiv.text(data.eclipses_in_year[i].month + " " + data.eclipses_in_year[i].day + ", " + data.eclipses_in_year[i].year);

                li.append(headerDiv);
                
                var headings = $("<tr>");
                var table = $("<table>");
                
                table.attr("border", 1);
                table.attr("frame", "void");
                table.attr("rules", "all");
                
                headings.html("<th>Event</th><th>Wikipedia</th>");
                
                thead.append(headings);
                
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.eclipses_in_year[i].event + "</td><td style='padding: 0 10px 0 10px' id='yearSolarWiki" + i + "'></td>");
                
                tbody.append(information);
                table.append(thead);
                table.append(tbody);
                span.append(table);
                bodyDiv.append(span);
                li.append(bodyDiv);
                 $("#accordion3").append(li);
                
                wiki(data.eclipses_in_year[i].event, ($("#yearSolarWiki" + i)));
            }/*else {
                var headerDiv = $("<div>");
                var bodyDiv = $("<div>");
                var span = $("<span>");
                
                bodyDiv.addClass("collapsible-body");
                headerDiv.addClass("collapsible-header");

                headerDiv.text("No eclipse today, switch to year view to see upcoming eclipse information");

                li.append(headerDiv);
                
                $("#accordion3").append(li);
            }*/
            
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
    for(var k = 0; k < dayEvents.length; k++){
        var li = $("<li>");
        var headerDiv = $("<div>");
        var bodyDiv = $("<div>");
        var span = $("<span>");
        var thead = $("<thead>");
        var tbody = $("<tbody>");
        
        bodyDiv.addClass("collapsible-body");
        headerDiv.addClass("collapsible-header");
        
        headerDiv.text(dayEvents[k].name);
        
        li.append(headerDiv);
        
        var headings = $("<tr>");
        var table = $("<table>");
        
        table.attr("border", 1);
        table.attr("frame", "void");
        table.attr("rules", "all");

        headings.html("<th>Missing Earth (Miles)</th><th>Speed (MPH)</th><th>Max Diameter(Miles)</th><th>Min diameter (Miles)</th><th>Dangerous</th>");
        
        thead.append(headings);
        
        var information = $("<tr>");
        information.html("<td>" + dayEvents[k].missEarth + "</td><td>"+ dayEvents[k].speed +"</td><td>"+  dayEvents[k].diameterMax +"</td><td>"+ dayEvents[k].diameterMin +"</td><td>"+ dayEvents[k].danger +"</td>");
        
        
        table.append(information);
       
        
        tbody.append(information);
        table.append(thead);
        table.append(tbody);
        span.append(table);
        bodyDiv.append(span);
        li.append(bodyDiv);
        
        $("#accordion1").append(li);
        
    }
    
    
    //Sets up accordion for week view
    var key = "";
    for (var i = 0; i < weekEvents.length; i++){
        var li = $("<li>");
        var headerDiv = $("<div>");
        var bodyDiv = $("<div>");
        var span = $("<span>");
        var cap = i + 1;
        var thead = $("<thead>");
        var tbody = $("<tbody>");
        
        if(cap === weekEvents.length){
            cap = i;
        }
        
        if( weekEvents[i].date !== weekEvents[cap].date){
            
            
            //variables and declarations
            key = weekEvents[i + 1].date;
            
            bodyDiv.addClass("collapsible-body");
            headerDiv.addClass("collapsible-header");
            headerDiv.text(weekEvents[i].date);
            
            li.append(headerDiv);
            
            var headings = $("<tr>");
            var table = $("<table>");
            
            table.attr("border", 1);
            table.attr("frame", "void");
            table.attr("rules", "all");
            
            
            headings.html("<th>Name</th><th>Missing Earth (Miles)</th><th>Speed (MPH)</th><th>Max Diameter(Miles)</th><th>Min diameter (Miles)</th><th>Dangerous</th>");
            
            thead.append(headings);
            
            for (var j = 0; j < weekEvents.length; j++){
                if(weekEvents[j].date === headerDiv.text()){
                    
                    var information = $("<tr>");
                    information.html("<td>"+ weekEvents[j].name +"</td><td>" + weekEvents[j].missEarth + "</td><td>"+ weekEvents[j].speed +"</td><td>"+  weekEvents[j].diameterMax +"</td><td>"+ weekEvents[j].diameterMin +"</td><td>"+ weekEvents[j].danger +"</td>");
                    
                    table.append(information);
                }
                
                tbody.append(information);
                table.append(thead);
                table.append(tbody);
                span.append(table);
                bodyDiv.append(span);
                li.append(bodyDiv);
                $("#accordion2").append(li);
                
            } 
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
                var li = $("<li>");
                var headerDiv = $("<div>");
                var bodyDiv = $("<div>");
                var span = $("<span>");
                var thead = $("<thead>");
                var tbody = $("<tbody>");

                bodyDiv.addClass("collapsible-body");
                headerDiv.addClass("collapsible-header");

                headerDiv.text(moonMonth + " " + moonDay + ", " + moonYear);

                li.append(headerDiv);
                
                var table = $("<table>");
                
                table.attr("border", 1);
                table.attr("frame", "void");
                table.attr("rules", "all");

                var headings = $("<tr>");
                headings.html("<th>Phase</th><th>Wikipedia</th>");
                
                thead.append(headings);
                
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'" + data.phasedata[i].phase + "</td><td style='padding: 0 10px 0 10px' id'dayMoonWiki" + i + "'></td>");
                
                tbody.append(information);
                table.append(thead);
                table.append(tbody);
                span.append(table);
                bodyDiv.append(span);
                li.append(bodyDiv); 
                $("#accordion9").append(li); 
                
                wiki(data.eclipses_in_year[i].event, ($("#dayMoonWiki" + i)));
            } 
                    
            //week view 
            if(moonMonth == month && moonDay >= day && moonDay <= (day + 6)){
                
                var li = $("<li>");
                var headerDiv = $("<div>");
                var bodyDiv = $("<div>");
                var span = $("<span>");
                var thead = $("<thead>");
                var tbody = $("<tbody>");

                bodyDiv.addClass("collapsible-body");
                headerDiv.addClass("collapsible-header");

                headerDiv.text(moonMonth + " " + moonDay + ", " + moonYear);

                li.append(headerDiv);
                
                var table = $("<table>");

                table.attr("border", 1);
                table.attr("frame", "void");
                table.attr("rules", "all");

                var headings = $("<tr>");
                headings.html("<th>Phase</th><th>Wikipedia</th>");
                
                thead.append(headings);
                
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.phasedata[i].phase + "</td><td style='padding: 0 10px 0 10px' id'weekMoonWiki" + i + "'></td>");
                
                tbody.append(information);
                table.append(thead);
                table.append(tbody);
                span.append(table);
                bodyDiv.append(span);
                li.append(bodyDiv);
                $("#accordion10").append(li); 
                
                wiki(data.eclipses_in_year[i].event, ($("#weekMoonWiki" + i)));
            } 
               
            
            //month view
            if(moonMonth == month && moonYear == year){
                
                var li = $("<li>");
                var headerDiv = $("<div>");
                var bodyDiv = $("<div>");
                var span = $("<span>");
                var thead = $("<thead>");
                var tbody = $("<tbody>");

                bodyDiv.addClass("collapsible-body");
                headerDiv.addClass("collapsible-header");

                headerDiv.text(moonMonth + " " + moonDay + ", " + moonYear);

                li.append(headerDiv);
                
                var table = $("<table>");
                

                table.attr("border", 1);
                table.attr("frame", "void");
                table.attr("rules", "all");
                
                var headings = $("<tr>");
                headings.html("<th>Phase</th><th>Wikipedia</th>");
                
                thead.append(headings);
                
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.phasedata[i].phase + "</td><td style='padding: 0 10px 0 10px' id'monthMoonWiki" + i + "'></td>");
                
                tbody.append(information);
                table.append(thead);
                table.append(tbody);
                span.append(table);
                bodyDiv.append(span);
                li.append(bodyDiv);
                $("#accordion11").append(li);
                
                wiki(data.eclipses_in_year[i].event, ($("#monthMoonWiki" + i)));
            }
            
            
            i++;
        })
        
    },
    error: function(errorMessage){
        alert("Error" + errorMessage);
    }
        }); 
}

function wiki(search, location){
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ search +"&format=json&callback=?";
    
       
       //ajax call
       $.ajax({
        type:"GET",
        url: url,
        async: false,
        dataType: "json",
        success: function(data){
            var a = $("<a>");
            a.text(data[3][0]);
            
            a.attr("href", data[3][0]);
            a.attr("target", "_blank");
            location.append(a);
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
    getISS();
    getTodaysDate();
    getAsteroids();
    
});
