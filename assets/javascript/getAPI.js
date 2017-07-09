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
               updateTodayWeather(data)
               getWeekDays(data);
            },
            error: function(errorMessage){
                alert("Error" + errorMessage);
            }
        });
}

function updateTodayWeather(data){
	console.log("in")
	var weatherCond = data.currently.icon.toUpperCase();
	var todayTemp = data.currently.apparentTemperature;
	$('#day-temperature').html(todayTemp+"<sup>&deg;F</sup>")


}
function getWeekDays(data){

    var eventCon = $('#week-view')
    //get the 5 days
    for(var i = 0; i < 7; i++){
    	//Create card Container
    	var cardCon = $('<div>');
    	cardCon.addClass('card');

    	//Create day of week div
    	var currentDay = moment().add(1*i,'days').format('dddd');
    	var cardDate = $('<p>');
    	cardDate.addClass('day card-title');
    	cardDate.text(currentDay);
    	cardCon.append(cardDate);

    	//Create image condition
    	var imgCon = $('<div>');
    	imgCon.addClass('card-image activator waves-effect waves-block waves-light');
    	var img = $('<img>');
    	img.addClass('cloudImg')
    	img.attr('src',cloudCover(data,i))
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
    	// var sky = $('<p>')
    	// sky.addClass('forecast sky')
    	// sky.text(data.daily.data[i].icon)
    	var temp = $('<p>')
    	temp.addClass('forecast temp center')
    	temp.html(data.daily.data[i].apparentTemperatureMin+" - "+data.daily.data[i].apparentTemperatureMax +"<sup>&deg;F</sup>")
    	var moon = $('<img>')
    	moon.addClass('forecast moonPhase')
    	moon.attr('src',moonPhase(data,i))
    	infoCon.append(temp,moon)

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

    $("#day-view").fadeToggle('fast')
}

function cloudCover(data,i){
	var cloud = data.daily.data[i].cloudCover;
	var cloudImg;
	if(cloud < .20){
		cloudImg = "assets/image/nksc.png"
	}
	else if(cloud < .40){
		cloudImg = "assets/image/nfew.png"
	}
	else if(cloud < .60){
		cloudImg = "assets/image/nsct.png"
	}
	else if(cloud < .80){
		cloudImg = "assets/image/nbkn.png"
	}
	else{
		cloudImg = "assets/image/novc.png"
	}
	return cloudImg
}

function moonPhase(data,i){
	var moon = data.daily.data[i].moonPhase;
	var moonImg;
	console.log(moon)
	if(moon >= 0 && moon <= .1){
		moonImg = "assets/image/new.png"
	}else if(moon >.1 && moon <= .25){
		moonImg = "assets/image/new-crescent.png"
	}else if(moon >.25 && moon <= .45){
		moonImg = "assets/image/crescent.png"
	}else if(moon > .45 && moon <= .55){
		moonImg = "assets/image/half.png"
	}else if(moon > .55 && moon <= .75){
		moonImg = "assets/image/gibbous.png"
	}else if(moon > .75 && moon <= .85){
		moonImg = "assets/image/gibbous-full.png"
	}else if(moon < 1){
		moonImg = "assets/image/full.png"
	}

	return moonImg
}


function updateClock() {
  $('#clock').html(moment().format('HH:mm'));
}

setInterval(updateClock, 1000);

// Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  $('.collapsible').collapsible();

 $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    
     getLocation();

  	$('#switch-view').click(function(){
  		if($('#day-view').css('display') === 'none'){
  			console.log($('#day-view').css('display'))
			$("#week-view").css("display","none");
			setTimeout(function(){$("#day-view").fadeToggle('slow'),500})
			$('#switch-view').text('view_week')
		}else{
			$("#day-view").css("display","none");
			setTimeout(function(){$("#week-view").fadeToggle('slow'),500})
			$('#switch-view').text('view_quilt')
	}
	})
  });


