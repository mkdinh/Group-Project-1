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
	icons = new Skycons({
	   "monochrome": false,
	   "colors" : {
	     "cloud" : "#d8ebfa",
	     "moon": '#646464',
	     'fog': '#f4f7f0',
	     'fogbank': '#809fb4',
	     'snow': '#6989af',
	     'leaf': '#3a5f0b',
	     'rain': '#5f8dbe',
	     'sun': '#fdb813'
	   }
	   });
	var weatherCond = data.currently.icon;

	//Updating Weather Icon
	$('.skycons-label').html(weatherCond)
	icons.set("skycons",weatherCond)
	icons.play();

	//Updating Temperature
	var todayTemp = data.currently.apparentTemperature;
	$('#day-temperature').html(todayTemp+"<sup>&deg;F</sup>")

	//Updating WindSpeed
	$('.windSpeed').html(data.currently.windSpeed + " mph")

	//Updating Addtional Info
	$(".humidity").html(data.currently.humidity)
	$(".precipProbability").html(data.currently.precipProbability)
	$(".cloudCover").html(data.currently.cloudCover)
	$(".visibility").html(data.currently.visibility)
	$(".moonPhase-data").html(data.daily.data[0].moonPhase)
	$(".humidity").html(data.currently.humidity)


}
function getWeekDays(data){

    var eventCon = $('#week-view')
    //get the 5 days
    for(var i = 0; i < 7; i++){
    	//Create card Container
    	var cardCon = $('<div>');
    	cardCon.addClass('card week');

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
    	var temp = $('<p>')
    	temp.addClass('forecast temp center')
    	temp.html(data.daily.data[i].apparentTemperatureMin+" - "+data.daily.data[i].apparentTemperatureMax +"<sup>&deg;F</sup>")
    	var moon = $('<img>')
    	moon.addClass('forecast moonPhase')
    	moon.attr('src',moonPhase(data,i))	
    	cardCon.append(temp)
    	infoCon.append(moon)

    	//add modal button
    	modalBtn = $('<a>');
    	modalBtn.addClass('expand-event weekly-event')
    	modalBtn.attr('data-num',i)
    	modalBtn.attr('href','#modal1')
    	modalBtn.html('<i class="material-icons">view_list</i></a>')
    	infoCon.append(modalBtn);
    	cardCon.append(infoCon);

    	//append to event Container
    	eventCon.append(cardCon)
    }

    $("#day-view").fadeToggle('fast')
}

//get weekly Info

$('#week-view').on('click','.weekly-event',function(){


	var dayNum = $(this).attr('data-num')
	console.log(dayNum)

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

				var modal = $('#modal1');
				var modalContent = $('.modal-content');
				modalContent.empty()
				// add weather content
				// add header

				var head  = '<h4>Predicted Weather<h4><hr>'
				// head.html('<h4>Predicted Weather<h4>')
				modalContent.append(head)

				var weather = $('<table>');
				weather.addClass("striped")
				weather.css('margin-bottom','20px')
					// add body
					conList = $('<tbody>')

					//conditions from API

					var tempMin = data.daily.data[dayNum].apparentTemperatureMin;
					var tempMax = data.daily.data[dayNum].apparentTemperatureMax;
					var humidity = data.daily.data[dayNum].humidity;
					var precipProbability = data.daily.data[dayNum].precipProbability;
					var precipType = data.daily.data[dayNum].precipType;
					var cloudCover = data.daily.data[dayNum].cloudCover;
					var moonPhase = data.daily.data[dayNum].moonPhase;

					// add weather conditions
					var row1 = $('<tr>');
					row1.html('<td> Temperature </td>'
							+  '<td class="modal-weekly-weather">' + tempMin + " - " + tempMax + '</td>'
							+  '<td> Humidity </td>'
							+  '<td class="modal-weekly-weather">' + humidity + '</td>'
							)

					var row2 = $('<tr>');
					row2.html('<td> Precipitation Probability </td>'
							+  '<td class="modal-weekly-weather">' + precipProbability + '</td>'
							+  '<td> Precipitation Type </td>'
							+  '<td class="modal-weekly-weather">' + precipType + '</td>'
							)

					var row3 = $('<tr>');
					row3.html('<td> Cloud Cover </td>'
							+  '<td class="modal-weekly-weather">' + cloudCover + '</td>'
							+  '<td> Moon Phase </td>'
							+  '<td class="modal-weekly-weather">' + moonPhase + '</td>'
							)		

				conList.append(row1,row2,row3)
				weather.append(conList)
				var astroEvent = $('<div>');
					astroEvent.append('<h4>Astronomy Event</h4><hr>')

				modalContent.append(weather,astroEvent)
            },
            error: function(errorMessage){
                alert("Error" + errorMessage);
            }
        });

})

// Get news
function getNews(){
	var queryURL = 'https://content.guardianapis.com/search';
	var newsInput = $('#news-input').val().trim();
	if(newsInput === ''){
		var orderMethod = "newest"
	}else{ 	 		
		orderMethod = "relevance"}

	console.log(newsInput)
	queryURL += '?' + $.param({
			'q': newsInput + '&' + 'astronomy' ,
			'format': 'json',	
			"show-fields":'trailText,headline,body,shortUrl,thumbnail,byline,publication',
			'page-size':5,
			'section': 'science',
			'order-by': orderMethod,
			'show-element': 'image',
			'api-key': '7cad287c-e8cb-482f-a20a-6e2050f4b850'
		}) 
	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(data){
		console.log(data)

		var listCon = $('<ul>')
		listCon.css('display','none')

		for(i = 0; i < data.response.results.length;i++){
			var title = data.response.results[i].webTitle;
			var byline = data.response.results[i].fields.byline;
			var date = data.response.results[i].webPublicationDate;
			var trailText = data.response.results[i].fields.trailText;
			var webURL = data.response.results[i].webUrl;

			var item = $('<li>');
			item.addClass('collection-item');
			item.html('<p class="news-title">' + title +  '<p>'
				+	'<a href="' + webURL + '" target="_blank"><i class="material-icons right small view-news">open_in_new</i></a>'
				+	'<p class="news-byline">' + byline + '<p>'
				+	'<p class="news-date">' + date + '<p>'
				+	'<p class="news-trailText">' + trailText + '<p>'
				+ '<div><div>'
				);
			listCon.append(item);
		}
		$('#news-list').html(listCon);
		$(listCon).fadeToggle('fast')
	})
}

function cloudCover(data,i){
	var cloud = data.daily.data[i].cloudCover;
	var cloudImg;
	if(cloud < .20){
		cloudImg = "assets/image/Cloud-Cover/nskc.png"
	}
	else if(cloud < .40){
		cloudImg = "assets/image/Cloud-Cover/nfew.png"
	}
	else if(cloud < .60){
		cloudImg = "assets/image/Cloud-Cover/nsct.png"
	}
	else if(cloud < .80){
		cloudImg = "assets/image/Cloud-Cover/nbkn.png"
	}
	else{
		cloudImg = "assets/image/Cloud-Cover/novc.png"
	}
	return cloudImg
}

function moonPhase(data,i){
	var moon = data.daily.data[i].moonPhase;
	var moonImg;
	if(moon >= 0 && moon <= .1){
		moonImg = "assets/image/Moon-Phase/new.png"
	}else if(moon >.1 && moon <= .2){
		moonImg = "assets/image/Moon-Phase/new-crescent.png"
	}else if(moon >.2 && moon <= .3){
		moonImg = "assets/image/Moon-Phase/crescent.png"	
	}else if(moon >.3 && moon <= .45){
		moonImg = "assets/image/Moon-Phase/crescent-half.png"
	}else if(moon > .45 && moon <= .55){
		moonImg = "assets/image/Moon-Phase/half.png"
	}else if(moon > .55 && moon <= .65){
		moonImg = "assets/image/Moon-Phase/half-gibbous.png"
	}else if(moon > .65 && moon <= .75){
		moonImg = "assets/image/Moon-Phase/gibbous.png"
	}else if(moon > .75 && moon <= .85){
		moonImg = "assets/image/Moon-Phase/gibbous-full.png"
	}else if(moon < 1){
		moonImg = "assets/image/Moon-Phase/full.png"
	}

	return moonImg
}


function updateClock() {
  $('#clock').html(moment().format('HH:mm'));
}

// Html page interactions js 


setInterval(updateClock, 1000);

// Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  $('.collapsible').collapsible();

 // Toast js
$('.event-item').click(function(){
 Materialize.toast("Event added", 3000) // 4000 is the duration of the toast
})

 $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    
     getLocation();

  	$('#switch-view').click(function(){
  		if($('#day-view').css('display') === 'none'){
			$("#week-view").css("display","none");
			setTimeout(function(){$("#day-view").fadeToggle('slow'),500})
			$('#switch-view').text('view_week')
		}else{
			$("#day-view").css("display","none");
			setTimeout(function(){$("#week-view").fadeToggle('slow'),500})
			$('#switch-view').text('view_quilt')
	}
	})


	 // fade in tab
	 $('.tab').click(function(){
	 	$('.initial-indicator').remove()
	 	var tab = $(this).attr('tab-data');
	 	$('#'+tab).fadeIn('slow')
	 	if($(this).attr('tab-data') === 'tab-news'){
	 		getNews()
	 	}
	 })

	 // Search news
	 $('#news-search').click(function(){
	 		 getNews();
	 		$('#news-input').val('');
	 })

	 $('#news-input').keyup(function(e){
	 	if(e.keyCode === 13){
	 		$('#news-search').click();
	 	}
	 })

  });


