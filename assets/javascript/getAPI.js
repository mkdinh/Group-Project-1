//VARIABLES
var longitude = "";
var latitude = "";
var todaysDate;
var cityName;
var countryCode;
var days = [];



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
               console.log(data);

               getWeekDays(data);
            },
            error: function(errorMessage){
                alert("Error" + errorMessage);
            }
        });
}

function getWeekDays(data){
    // var date = new Date();
    // var weekday = date.getDay();
    // console.log(weekday)
    var eventCon = $('#eventContainer')
    //get the 5 days
    for(var i = 0; i < 7; i++){
    	//Create card Container
    	var cardCon = $('<div>');
    	cardCon.addClass('card');

    	//Create day of week div
    	var currentDay = moment().add(1*i,'days').format('dddd');
    	var cardDate = $('<span>');
    	cardDate.addClass('card-title day');
    	cardDate.text(currentDay);
    	cardCon.append(cardDate);

    	//Create image condition
    	var imgCon = $('<div>');
    	imgCon.addClass('card-image activator waves-effect waves-block waves-light');
    	var img = $('<img>');
    	img.attr('src','assets/image/nskc.png')
    	imgCon.append(img);
    	cardCon.append(imgCon);

    	// add card content/weather info
    	var infoCon = $('<div>');
    	infoCon.addClass('card-content center')
    	var infoTitle = $('<p>');
    	// infoTitle.addClass('card-title activator');
    	// infoTitle.text("Forecast");
    	// infoCon.append(infoTitle);

    	// Weather info
    	var sky = $('<p>')
    	sky.addClass('forecast sky')
    	sky.text('Sky Cond: ',data.daily.data[i].icon)
    	var temp = $('<p>')
    	temp.addClass('forecast temp center')
    	temp.text(data.daily.data[i].apparentTemperatureMin+" - "+data.daily.data[i].apparentTemperatureMax)
    	var sunset = $('<p>')
    	sunset.addClass('forecast sunset')
    	sunset.text('Sunset: '+ moment(data.daily.data[i].sunsetTime).format('HH:mm'))
    	infoCon.append(temp,sky,sunset)

    	//add modal button
    	modalBtn = $('<a>');
    	modalBtn.addClass('expand-event')
    	modalBtn.attr('href','#modal1')
    	modalBtn.html('<i class="material-icons">view_list</i></a>')
    	infoCon.append(modalBtn);
    	cardCon.append(infoCon);

    	//append to event Container
    	eventCon.append(cardCon)
    }
	eventCon.fadeToggle('slow')
}

  	// <div class="card">
			// 	  		<div class="day">
			// 	  			<span class="card-title">Monday</span>
			// 	  		</div>
			// 		    <div class="card-image waves-effect waves-block waves-light">
			// 		    	<img class="activator" src="assets/image/nskc.png">
			// 		    </div>
			// 		    <div class="card-content">
			// 		      <span class="card-title activator">Forecast</span>
			// 			  <p class="forecast sky">Sky Conditions:</p>
			// 		      <p class="forecast temp">Temperature:</p>
			// 		      <p class="forecast visibility">visibility</p>
			// 		      <!-- Modal Trigger -->
		 //  				<a class=" expand-event" href="#modal1"><i class="material-icons">view_list</i></a>
			// 		    </div>					    
			// 		 </div>


// function getWeekDays() {
//     var date = new Date();
//     var weekday = date.getDay();
//     var fullWeekday;
    
//     //gets the 5 days
//     for(var i = 0; i < 7; i++){
        
//         switch(weekday) {
//             case 0:
//                 fullWeekday = "Sunday";
//                 days.push(fullWeekday);
//                 $("#day"+i).text(fullWeekday);
//                 console.log(weekday + " " + fullWeekday);
//                 break;
//             case 1:
//                 fullWeekday = "Monday";
//                 days.push(fullWeekday);
//                 $("#day"+i).text(fullWeekday);
//                 console.log(weekday + " " + fullWeekday);
//                 break;
//             case 2:
//                 fullWeekday = "Tuesday";
//                 days.push(fullWeekday);
//                 $("#day"+i).text(fullWeekday);
//                 console.log(weekday + " " + fullWeekday);
//                 break;
//             case 3:
//                 fullWeekday = "Wednesday";
//                 days.push(fullWeekday);
//                 $("#day"+i).text(fullWeekday);
//                 console.log(weekday + " " + fullWeekday);
//                 break;
//             case 4:
//                 fullWeekday = "Thursday";
//                 days.push(fullWeekday);
//                 $("#day"+i).text(fullWeekday);
//                 console.log(weekday + " " + fullWeekday);
//                 break;
//             case 5:
//                 fullWeekday = "Friday";
//                 days.push(fullWeekday);
//                 $("#day"+i).text(fullWeekday);
//                 console.log(weekday + " " + fullWeekday);
//                 break;
//             case 6:
//                 fullWeekday = "Saturday";
//                 days.push(fullWeekday);
//                 $("#day"+i).html(fullWeekday);
//                 console.log(weekday + " " + fullWeekday);
//                 break;

//         }
//         weekday++;
//         if(weekday === 7){
//             weekday = 0;
//         }
//     }
    
// }


// Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  $('.collapsible').collapsible();

 $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    
     getLocation();
    // getWeekDays();
  });


