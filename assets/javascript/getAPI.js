// specify globals for the benefit of ESLint
/* global $, firebase, moment, Skycons, Materialize, google */

//VARIABLES
var longitude = "";
var latitude = "";
var todaysDate;
var cityName;
var countryCode;
var days = [];

var calDescriptionTag = " (from Night by Night)";

var database = firebase.database();


//FUNCTIONS

// Gather current location in coordinate

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition)
	} else {
		console.log("Error: Geolocation is not supported by this browser.");
	}

}

// Convert current location to longitude and latitude

function showPosition(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;

	console.log("Latitude: " + latitude + " Longitude: " + longitude);

	getWeather();

}

// Gather reverse geolocate long + lat to output city name and zip code

function reverseGeo(long, lat) {
	var apiKey = "AIzaSyD4ya-QQ9KFOYVNcp-ejxBwaY_NeZ0txBE";
	var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=" + apiKey;

	//ajax call
	$.ajax({
		type: "GET",
		url: url,
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			cityName = data.results[0].address_components[0].long_name;
			countryCode = data.results[0].address_components[4].short_name;

			console.log(cityName + ", " + countryCode);
		},
		error: function (errorMessage) {
			console.log("Error" + errorMessage);
		}
	})
}

// using long + lat, gather weather information

function getWeather() {
	//CORS prefix
	var cors = "https://cors-anywhere.herokuapp.com/";
	//API URL
	var url = cors + "https://api.darksky.net/forecast/ef8d2f0e9af37edb6fa8639b613e662d/" + latitude + "," + longitude;

	//ajax call
	$.ajax({
		type: "GET",
		url: url,
		async: true,
		dataType: "json",
		success: function (data) {
			console.log(data);
			// update day-view weather
			updateTodayWeather(data)

			// update week-view weather
			getWeekDays(data);

			// update week-view modal weather 
			getWeeklyUpdate(data);
			rankNights(data);

			// // get constellation based on long + lat
			// getConstellation(longitude,latitude)

			// fade out preloader after gathered all information
			$('.preloader-wrapper').fadeOut('fast')
			$(".container").animate({ opacity: 1 }, 'slow')
		},
		error: function (errorMessage) {
			console.log("Error" + errorMessage);
		}
	});
}

// update day-view weather

function updateTodayWeather(data) {

	// Change skycons css color
	var icons = new Skycons({
		"monochrome": false,
		"colors": {
			"cloud": "#d8ebfa",
			"moon": '#646464',
			'fog': '#f4f7f0',
			'fogbank': '#809fb4',
			'snow': '#6989af',
			'leaf': '#3a5f0b',
			'rain': '#5f8dbe',
			'sun': '#fdb813'
		}
	});

	// Pick appropriate skycon icon from getWeather ajax
	var weatherCond = data.currently.icon;

	//Updating Weather Icon
	$('.skycons-label').html(weatherCond)
	icons.set("skycons", weatherCond)
	icons.play();

	//Updating Temperature
	var todayTemp = data.currently.apparentTemperature;
	$('#day-temperature').html('<div id="today-current-temp">' + todayTemp.toFixed(0) + "<sup>&deg;F</sup></div>" + '<a id="convert-unit" href="#/"><p style="margin:0">&deg;C</p></a>')
	$('#convert-unit').attr('data-f', todayTemp.toFixed(0))
	var celcius = (todayTemp - 32) * 5 / 9;
	celcius = celcius.toFixed(0)
	$('#convert-unit').attr('data-c', celcius)
	$('#convert-unit').attr('data-state', 'f')
	//Updating WindSpeed
	$('.windSpeed').html(data.currently.windSpeed + " mph")

	//Updating Addtional Info
	$(".humidity").html((data.currently.humidity * 100).toFixed(0) + "%");
	$(".precipProbability").html((data.currently.precipProbability * 100).toFixed(0) + "%");
	$(".cloudCover").html((data.currently.cloudCover * 100).toFixed(0) + "%");
	$(".visibility").html(data.currently.visibility.toFixed(0) + " mi");
	$(".moonPhase-data").html((data.daily.data[0].moonPhase * 100).toFixed(0) + "%");

}

//gets Astronomical Picture Of the Day
function getAPOD() {
	var apiKey = "FMWfaT1C1igzEgHUsZOK4ZUlCGACf42bmV2i9GYM";
	var url = "https://api.nasa.gov/planetary/apod?api_key=" + apiKey;

	//ajax call
	$.ajax({
		type: "GET",
		url: url,
		async: false,
		dataType: "json",
		success: function (apodData) {
			console.log(apodData);
			var img = $("<img class='apod-img materialboxed'>");
			var p = $("<p class='truncate tooltipped'>");
			img.attr("src", apodData.url);
			p.text(apodData.explanation);
			p.attr("data-tooltip", apodData.explanation);
			$("#imageOfTheDay").append(img, p);
			// reinitialize .materialbox
			$('.materialboxed').materialbox();
			// reinitialize tooltips
			$('.tooltipped').tooltip({ delay: 50 });
		},
		error: function (errorMessage) {
			console.log("Error" + errorMessage);
		}
	});
}

// Get week-view update
function getWeekDays(data) {

	var eventCon = $('#week-view')

	//get the 5 days
	for (var i = 0; i < 7; i++) {
		//Create card Container
		var cardCon = $('<div>');
		cardCon.addClass('card week');

		//Create day of week div
		var currentDay = moment().add(1 * i, 'days').format('dddd');
		var cardDate = $('<p>');
		cardDate.addClass('day card-title truncate');
		cardDate.attr("id", "day" + i);
		cardDate.text(currentDay);
		cardCon.append(cardDate);

		//Create image condition
		var imgCon = $('<div>');
		imgCon.addClass('card-image activator waves-effect waves-block waves-light');
		var img = $('<img>');
		img.addClass('cloudImg')
		img.attr('src', cloudCover(data, i))
		imgCon.append(img);
		cardCon.append(imgCon);

		// add card content/weather info
		var infoCon = $('<div>');
		infoCon.addClass('card-content center')
		var infoTitle = $('<p>');

		// Weather info
		var temp = $('<p>')
		temp.addClass('forecast temp center')
		temp.html(data.daily.data[i].apparentTemperatureMin.toFixed(0) + " - " + data.daily.data[i].apparentTemperatureMax.toFixed(0) + "<sup>&deg;F</sup>")
		var moon = $('<img>')
		moon.addClass('forecast moonPhase')
		moon.attr('src', moonPhase(data, i))
		cardCon.append(temp)
		infoCon.append(moon)

		//add modal button
		var modalBtn = $('<a>');
		modalBtn.addClass('expand-event weekly-event')
		modalBtn.attr('data-num', i)
		modalBtn.attr('href', '#modal1')
		modalBtn.html('<i class="material-icons">view_list</i></a>')
		infoCon.append(modalBtn);
		cardCon.append(infoCon);

		//append to event Container
		eventCon.append(cardCon)
	}
}

//get weekly Info

$('#week-view').on('click', '.weekly-event', function () {
	// Display appropriate content for selected day
	var modal = $('#modal1')
	$('#modal1').empty();
	var dayNum = $(this).attr('data-num');
	$('#week-content-' + dayNum).clone().prependTo(modal);
	addModalfooter()
})

function addModalfooter() {
	// add a footer
	var footer = $("<div>");
	footer.addClass('modal-footer');
	footer.append('<a href="#!" class="modal-action modal-close waves-effect btn-flat">Close</a>')
	$('#modal1').append(footer)
}

// weekly weather info modals

function getWeeklyUpdate(data) {
	console.log(data)
	var modalContentContainer = $('<div>');
	modalContentContainer.addClass('modal-content-container');
	modalContentContainer.css('display', 'none')

	for (var i = 0; i < data.daily.data.length; i++) {
		// var modal = $('<div>');
		// modal.attr('id', 'modal-'i);
		var modalContent = $("<div>")
		modalContent.attr('id', 'week-content-' + i)
		modalContent.addClass('modal-content');
		// add weather content
		// add header

		var head = '<h4>Predicted Weather<h4><hr>'
		// head.html('<h4>Predicted Weather<h4>')
		modalContent.append(head)

		var weather = $('<table>');
		weather.addClass("striped")
		weather.css('margin-bottom', '20px')
		// add body
		var conList = $('<tbody>')

		//conditions from API

		var tempMin = data.daily.data[i].apparentTemperatureMin.toFixed(0);
		var tempMax = data.daily.data[i].apparentTemperatureMax.toFixed(0);
		var humidity = (data.daily.data[i].humidity * 100).toFixed(0) + "%";
		var precipProbability = (data.daily.data[i].precipProbability * 100).toFixed(0) + "%";
		var precipType = data.daily.data[i].precipType;
		var cloudCover = (data.daily.data[i].cloudCover * 100).toFixed(0) + "%";
		var moonPhase = (data.daily.data[i].moonPhase * 100).toFixed(0) + "%";

		// add weather conditions
		var row1 = $('<tr>');
		row1.html('<td> Temperature </td>'
			+ '<td class="modal-weekly-weather">' + tempMin + " - " + tempMax + "<sup>&deg;F</sup>" + '</td>'
			+ '<td> Humidity </td>'
			+ '<td class="modal-weekly-weather">' + humidity + '</td>'
		)

		var row2 = $('<tr>');
		row2.html('<td> Precipitation Probability </td>'
			+ '<td class="modal-weekly-weather">' + precipProbability + '</td>'
			+ '<td> Precipitation Type </td>'
			+ '<td class="modal-weekly-weather">' + precipType + '</td>'
		)

		var row3 = $('<tr>');
		row3.html('<td> Cloud Cover </td>'
			+ '<td class="modal-weekly-weather">' + cloudCover + '</td>'
			+ '<td> Moon Phase </td>'
			+ '<td class="modal-weekly-weather">' + moonPhase + '</td>'
		)

		conList.append(row1, row2, row3)
		weather.append(conList)
		var astroEvent = $('<div>');
		astroEvent.append('<h4>Astronomy Event</h4><hr>')

		modalContent.append(weather, astroEvent)
		modalContentContainer.append(modalContent)
	}

	$('body').append(modalContentContainer)
}

// rank nightly stargazing score
function rankNights(data) {
	var days = data.daily.data;
	for (var i = 0; i < 7; i++) {
		var today = days[i];
		// cloud ranking is the inverse of cloud cover--80% cloud cover = 20% ranking
		var cloudRanking = 1 - today.cloudCover;
		var moonRanking = 1 - today.moonPhase;
		var precipRanking;
		var precipMaxTime = moment.unix(today.precipIntensityMaxTime).format("H");
		var sunset = moment.unix(today.sunsetTime).format("H");
		var sunrise = moment.unix(today.sunriseTime).format("H");

		// if there is a precipitation time predicted, and it falls between sunset and sunrise...
		if ((precipMaxTime > sunset || precipMaxTime < sunrise) && today.precipIntensityMax > 0.1) {
			precipRanking = 1 - today.precipProbability;
		} else {
			precipRanking = 1;
		}
		var tempRanking;
		// : if it's below freezing, goes down progressively
		if (today.temperatureMin > 20) {
			tempRanking = 1;
		} else if (today.temperatureMin / 20 > 0) {
			tempRanking = today.temperatureMin / 20;
		} else {
			tempRanking = 0;
		}
		var totalRanking = (cloudRanking * 0.6) + (moonRanking * 0.2) + (precipRanking * 0.15) + (tempRanking * 0.05);

		// display score in week view:
		var dayRankLine = $("<div>");
		var rating = $("<span class=rating>"); // happens
		rating.text(Math.round(totalRanking * 100) + "%"); // happens
		dayRankLine.html("Score: "); // happens
		dayRankLine.append(rating); // doesn't happen on 0. (does on others)
		$("#day" + i).after(dayRankLine); // happens (even on 0)

		// display score in day view, for today only:
		if (i === 0) {
			var scoreLine = $("<div class='score-line weather-info-container'>");
			var stars = $("<div id=star-container>");
			// convert rating to base-5 for stars and round to the nearest half-star:
			var starNum = Number.parseFloat((Math.round(totalRanking * 10) / 2).toFixed(1));
			// show as many whole stars as the integer part of that number,
			// as many half stars as the decimal part, if it exists,
			// and as many empty stars as 5 - the number - any half star
			var wholeStars = 0;
			var halfStar = 0;
			var emptyStars = 0;
			while (wholeStars < Math.floor(starNum)) {
				stars.append('<i class="material-icons">star</i>');
				wholeStars++;
			}
			while (halfStar < Math.ceil(starNum % 1)) {
				stars.append('<i class="material-icons">star_half</i>');
				halfStar++;
			}
			while (emptyStars < (5 - wholeStars - halfStar)) {
				stars.append('<i class="material-icons">star_border</i>');
				emptyStars++;
			}
			scoreLine.text("Tonight's stargazing score: ");
			scoreLine.append(rating.clone(), stars)
			$("#weather-display").after(scoreLine);
		}
	}
}

// Get news
function getNews() {

	// Guardian API setup
	var queryURL = 'https://content.guardianapis.com/search';
	var newsInput = $('#news-input').val().trim();
	if (newsInput === '') {
		var orderMethod = "newest"
	} else {
		orderMethod = "relevance"
		$('#news-search-method').html('Search By: <b>Relevance</b>')
	}

	queryURL += '?' + $.param({
		'q': newsInput + '&' + 'astronomy',
		'format': 'json',
		"show-fields": 'trailText,headline,body,shortUrl,thumbnail,byline,publication',
		'page-size': 5,
		'section': 'science',
		'order-by': orderMethod,
		'show-element': 'image',
		'api-key': '7cad287c-e8cb-482f-a20a-6e2050f4b850'
	})
	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function (data) {
		console.log(data)

		var listCon = $('<ul>')
		listCon.css('display', 'none')

		for (var i = 0; i < data.response.results.length; i++) {

			// gather desired information
			var title = data.response.results[i].webTitle;
			var byline = data.response.results[i].fields.byline;
			var date = data.response.results[i].webPublicationDate;
			var trailText = data.response.results[i].fields.trailText;
			var webURL = data.response.results[i].webUrl;

			// create new list and append the appropriate info
			var item = $('<li>');
			item.addClass('collection-item');
			item.html('<p class="news-title">' + title + '<p>'
				+ '<a href="' + webURL + '" target="_blank"><i class="material-icons right small view-news">open_in_new</i></a>'
				+ '<p class="news-byline">' + byline + '<p>'
				+ '<p class="news-date">' + date + '<p>'
				+ '<p class="news-trailText">' + trailText + '<p>'
				+ '<div><div>'
			);
			listCon.append(item);
		}

		// append list item to list container
		$('#news-list').html(listCon);

		// fade in list container
		$(listCon).fadeIn('fast')
	})
}

function getConstellation() {

	if ($('#ecEq').is(':checked')) {
		var ecEq = '&coords=on'
	} else {
		var ecEq = ''
	} console.log(ecEq)
	if ($('#moPlan').is(':checked')) {
		var moPlan = '&moonp=on'
	} else {
		var moPlan = ''
	}
	if ($('#deObj').is(':checked')) {
		var deObj = '&deep=on'
	} else {
		var deObj = ''
	}
	if ($('#constell-outlines').is(':checked')) {
		var outlines = '&consto=on'
	} else {
		var outlines = ''
	}
	if ($('#constell-names').is(':checked')) {
		var names = '&constn=on'
	} else {
		var names = ''
	}
	if ($('#constell-boundaries').is(':checked')) {
		var boundaries = '&constb=on'
	} else {
		var boundaries = ''
	}

	var theme = $('#constell-theme').find(':selected').attr('value')

	var p = {
		long: longitude,
		lat: latitude,
		ecEq: ecEq,
		moPlan: moPlan,
		deObj: deObj,
		outlines: outlines,
		names: names,
		boundaries: boundaries,
		theme: theme
	}
	var img = $("<img>");
	img.attr('id', 'constell-img')
	var src = 'https://www.fourmilab.ch/cgi-bin/Yoursky?date=0&utc=1998%2F02%2F06+12%3A42%3A40&jd=2450851.02963&lat=' + p.lat + '%B0&ns=North&lon=' + p.long + '%B0&ew=East' + p.ecEq + p.moPlan + p.deObj + '&deepm=2.5' + p.outlines + p.names + p.boundaries + '&limag=5.5&starnm=2.0&starbm=2.5&imgsize=550&dynimg=y&fontscale=1.0&scheme=' + p.theme + '&elements='
	img.attr('src', src)
	$('#constell-display').html(img)
}


function getModalConstellation() {

	if ($('#modal-ecEq').is(':checked')) {
		var ecEq = '&coords=on'
	} else {
		var ecEq = ''
	} console.log(ecEq)
	if ($('#modal-moPlan').is(':checked')) {
		var moPlan = '&moonp=on'
	} else {
		var moPlan = ''
	}
	if ($('#modal-deObj').is(':checked')) {
		var deObj = '&deep=on'
	} else {
		var deObj = ''
	}
	if ($('#constell-modal-outlines').is(':checked')) {
		var outlines = '&consto=on'
	} else {
		var outlines = ''
	}
	if ($('#constell-modal-names').is(':checked')) {
		var names = '&constn=on'
	} else {
		var names = ''
	}
	if ($('#constell-modal-boundaries').is(':checked')) {
		var boundaries = '&constb=on'
	} else {
		var boundaries = ''
	}

	var theme = $('#constell-modal-theme').find(':selected').attr('value')
	console.log(theme)
	var p = {
		long: longitude,
		lat: latitude,
		ecEq: ecEq,
		moPlan: moPlan,
		deObj: deObj,
		outlines: outlines,
		names: names,
		boundaries: boundaries,
		theme: theme
	}
	var img = $("<img>");
	img.attr('id', 'constell-img')
	var src = 'https://www.fourmilab.ch/cgi-bin/Yoursky?date=0&utc=1998%2F02%2F06+12%3A42%3A40&jd=2450851.02963&lat=' + p.lat + '%B0&ns=North&lon=' + p.long + '%B0&ew=East' + p.ecEq + p.moPlan + p.deObj + '&deepm=2.5' + p.outlines + p.names + p.boundaries + '&limag=5.5&starnm=2.0&starbm=2.5&imgsize=550&dynimg=y&fontscale=1.0&scheme=' + p.theme + '&elements='
	img.attr('src', src)
	$('#constell-modal-display').html(img)
}

// Get Modal Constellation Map

function createConstellModal() {
	var modal = $('<div>');
	modal.attr('id', 'constell-modal')
	modal.addClass('modal');

	var row = $('<div>');
	row.addClass("row");
	modal.append(row)

	var constellDisplay = $('<div>');
	constellDisplay.addClass("col s9 ");
	row.append(constellDisplay);

	var constellPara = $('<div>');
	constellPara.addClass('col s3');
	row.append(constellPara);

	constellDisplay.html('<div id="constell-modal-display" class="center"></div>')

	constellPara.append('<form class="switch">'
		+ '<p>Ecliptic &amp; Equator</p>'
		+ '<label>'
		+ 'Off'
		+ '<input id="modal-ecEq" class="constell-modal-input" type="checkbox" checked>'
		+ '<span class="lever"></span>'
		+ 'On'
		+ '</label>'

		+ '<p>Moon &amp; Planets</p>'
		+ '<label>'
		+ 'Off'
		+ '<input id="modal-moPlan" class="constell-modal-input" type="checkbox">'
		+ '<span class="lever"></span>'
		+ 'On'
		+ '</label>'

		+ '<p>Deep Sky Objects</p>'
		+ '<label>'
		+ 'Off'
		+ '<input id="modal-deObj" class="constell-modal-input" type="checkbox">'
		+ '<span class="lever"></span>'
		+ 'On'
		+ '</label>'
		+ '</form>'

		+ '<form action="#" class="checkboxes">'
		+ '<p>Constellation</p>'
		+ '<p>'
		+ '<input class="constell-modal-input" type="checkbox" id="constell-modal-outlines" checked>'
		+ '<label for="constell-modal-outlines">Outlines</label>'
		+ '</p>'
		+ '<p>'
		+ '<input class="constell-modal-input" type="checkbox" id="constell-modal-names">'
		+ '<label for="constell-modal-names">Names</label>'
		+ '</p>'
		+ '<p>'
		+ '<input class="constell-modal-input" type="checkbox" id="constell-modal-boundaries">'
		+ '<label for="constell-modal-boundaries">Boundaries</label>'
		+ '</p>'

		+ '<div id="constell-modal-theme" class="input-field constell-modal-input">'
		+ '<select id="constell-modal-theme-select" class="constell-modal-input">'
		+ '<option class="constell-modal-theme-option" value="0">Colour</option>'
		+ '<option class="constell-modal-theme-option" value="1">Black on White</option>'
		+ '<option class="constell-modal-theme-option" value="2" selected="selected">White on Black</option>'
		+ '<option class="constell-modal-theme-option" value="3">Infrared</option>'
		+ '</select>'
		+ '<label>Themes</label>'
		+ '</div>'
		+ '</form>')

	var footer = $("<div>");
	footer.addClass('modal-footer');
	footer.append('<a href="#!" class=" modal-action modal-close waves-effect btn-flat constell-modal-close">Close</a>')
	constellPara.append(footer)
	$('#constell-modal-btn').attr('href', '#constell-modal')

	$('body').prepend(modal)
	modal.modal()

	$('select').material_select();
	getModalConstellation();
}


// Logics to determine the appropriate image to cloud cover
function cloudCover(data, i) {

	// gather cloud cover information from API 
	var cloud = data.daily.data[i].cloudCover;
	var cloudImg;

	if (cloud < .20) {
		cloudImg = "assets/image/Cloud-Cover/nskc.png"
	}
	else if (cloud < .40) {
		cloudImg = "assets/image/Cloud-Cover/nfew.png"
	}
	else if (cloud < .60) {
		cloudImg = "assets/image/Cloud-Cover/nsct.png"
	}
	else if (cloud < .80) {
		cloudImg = "assets/image/Cloud-Cover/nbkn.png"
	}
	else {
		cloudImg = "assets/image/Cloud-Cover/novc.png"
	}

	// return image path 
	return cloudImg
}

// Logics to determine the appropriate image to moon phase
function moonPhase(data, i) {

	// gather cloud cover information from API 
	var moon = data.daily.data[i].moonPhase;
	var moonImg;
	if (moon >= 0 && moon <= .1) {
		moonImg = "assets/image/Moon-Phase/new.png"
	} else if (moon > .1 && moon <= .2) {
		moonImg = "assets/image/Moon-Phase/new-crescent.png"
	} else if (moon > .2 && moon <= .3) {
		moonImg = "assets/image/Moon-Phase/crescent.png"
	} else if (moon > .3 && moon <= .45) {
		moonImg = "assets/image/Moon-Phase/crescent-half.png"
	} else if (moon > .45 && moon <= .55) {
		moonImg = "assets/image/Moon-Phase/half.png"
	} else if (moon > .55 && moon <= .65) {
		moonImg = "assets/image/Moon-Phase/half-gibbous.png"
	} else if (moon > .65 && moon <= .75) {
		moonImg = "assets/image/Moon-Phase/gibbous.png"
	} else if (moon > .75 && moon <= .85) {
		moonImg = "assets/image/Moon-Phase/gibbous-full.png"
	} else if (moon < 1) {
		moonImg = "assets/image/Moon-Phase/full.png"
	}

	// return image path
	return moonImg
}

// create a functional clock for UI

function updateClock() {
	$('#clock').html(moment().format('HH:mm'));
}


/*-----------------------------------------------------------------------------------------------*/
var long;
var lat;
var map;
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

<<<<<<< HEAD
function initMap(){
    var uluru = {lat: parseFloat(lat), lng: parseFloat(long)};
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: uluru
    });
    var icon = "assets/image.satellite.png";

    var marker = new google.maps.Marker({
        postition: uluru,
        icon: icon,
        map: map
    });
    }

/*google.maps.event.addDomListener(window, 'load', initMap);*/

$("#spaceStation").on("shown.bs.collapse", function(e){
    
       google.maps.event.trigger(map, "resize");
});

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

function initMap() {
	var uluru = { lat: parseFloat(lat), lng: parseFloat(long) };
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
function getISS() {
	var url = "https://api.wheretheiss.at/v1/satellites/25544/";

	//ajax call
	$.ajax({
		type: "GET",
		url: url,
		async: false,
		dataType: "json",
		success: function (data) {
			long = data.longitude;
			lat = data.latitude;
		},
		error: function (errorMessage) {
			console.log("Error" + errorMessage);
		}
	});
}

function getMeteorShower() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();


	month++;

	switch (month) {
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

	for (var i = 0; i < Object.keys(meteorShowers).length; i++) {
		var activeSplit = meteorShowers[i].active.split(" ");
		var activeStartMonth = activeSplit[0];
		var activeDay1 = activeSplit[1];
		var activeEndMonth = activeSplit[3];
		var activeDay2 = activeSplit[4];
		var yearly = meteorShowers[i].yearly;

		// for Google Calendar
		var peakSplit = meteorShowers[i].peakNight.split("-");
		var peakStart = {
			date: moment(peakSplit[0], "MMM D").format("YYYY-MM-DD")
		}
		// get month from beginning of string and 
		var peakEnd = {
			date: moment(peakSplit[0].split(" ")[0] + peakSplit[1], "MMMD").format("YYYY-MM-DD")
		}
		var summary = meteorShowers[i].name;
		var description = summary + " meteor shower" + calDescriptionTag;
		var calObj = JSON.stringify({
			summary: summary,
			description: description,
			start: peakStart,
			end: peakEnd
		});

		// day view
		if (month === activeStartMonth && day <= activeDay1 || month === activeEndMonth && day <= activeDay2) {

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
			headings.html("<th>Name</th><th>Peak viewing nights</th><th>Velocity</th><th>Parent Object</th><th>Wikipedia</th><th>Add to Google Calendar</th>");

			thead.append(headings);

			var information = $("<tr>");
			information.html("<td style='padding: 0 10px 0 10px'>" + meteorShowers[i].name + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].peakNight + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].Velocity + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].ParentObj + "</td><td style='padding: 0 10px 0 10px' id='dayMeteorWiki" + i + "'></td><td><a class='waves-effect waves-light btn cal-btn' data-cal='" + calObj + "'><i class='material-icons left'>date_range</i></a></td>");

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

		if (month === activeStartMonth || month === activeEndMonth) {
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

			headings.html("<th>Name</th><th>Peak viewing nights</th><th>Velocity</th><th>Parent Object</th><th>Wikipedia</th><th>Add to Google Calendar</th>");

			thead.append(headings);

			var information = $("<tr>");
			information.html("<td style='padding: 0 10px 0 10px'>" + meteorShowers[i].name + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].peakNight + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].Velocity + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].ParentObj + "</td><td style='padding: 0 10px 0 10px' id='monthMeteorWiki" + i + "'></td><td><a class='waves-effect waves-light btn cal-btn' data-cal='" + calObj + "'><i class='material-icons left'>date_range</i></a></td>");

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
		if (yearly === true) {
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
			headings.html("<th>Name</th><th>Peak viewing nights</th><th>Velocity</th><th>Parent Object</th><th>Wikipedia</th><th>Add to Google Calendar</th>");

			thead.append(headings);

			var information = $("<tr>");
			information.html("<td style='padding: 0 10px 0 10px'>" + meteorShowers[i].name + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].peakNight + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].Velocity + "</td><td style='padding: 0 10px 0 10px'>" + meteorShowers[i].ParentObj + "</td><td style='padding: 0 10px 0 10px' id='yearMeteorWiki" + i + "'></td><td><a class='waves-effect waves-light btn cal-btn' data-cal='" + calObj + "'><i class='material-icons left'>date_range</i></a></td>");
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
function getSolar() {
	var coords = [longitude, latitude];
	var d = new Date();
	var year = d.getFullYear();

	var url = "http://api.usno.navy.mil/eclipses/solar?year=" + year;

	//ajax call
	$.ajax({
		type: "GET",
		url: url,
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			var i = 0;
			$.each(data.eclipses_in_year, function () {
				var d = new Date()
				var day = d.getDate();
				var month = d.getMonth();
				var year = d.getFullYear();
				var table = $("<table>");
				var h3 = $("<h3>");
				var eMonth = data.eclipses_in_year[i].month;
				switch (eMonth) {
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
				if (data.eclipses_in_year[i].year === year) {
					console.log("year view meets if statement");
					var li = $("<li>");
					var headerDiv = $("<div>");
					var bodyDiv = $("<div>");
					var span = $("<span>");
					var thead = $("<thead>");
					var tbody = $("<tbody>");

					// for Google Calendar
					var calObj = JSON.stringify({
						summary: data.eclipses_in_year[i].event,
						description: data.eclipses_in_year[i].event + calDescriptionTag,
						start: {
							date: data.eclipses_in_year[i].year + "-" + moment(data.eclipses_in_year[i].month, "M").format("MM") + "-" + moment(data.eclipses_in_year[i].day, "D").format("DD")
						},
						end: {
							date: data.eclipses_in_year[i].year + "-" + moment(data.eclipses_in_year[i].month, "M").format("MM") + "-" + moment(data.eclipses_in_year[i].day, "D").format("DD")
						}
					});

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

					headings.html("<th>Event</th><th>Wikipedia</th><th>Add to Google Calendar</th>");

					thead.append(headings);

					var information = $("<tr>");
					information.html("<td style='padding: 0 10px 0 10px'>" + data.eclipses_in_year[i].event + "</td><td style='padding: 0 10px 0 10px' id='daySolarWiki" + i + "'></td><td><a class='waves-effect waves-light btn cal-btn' data-cal='" + calObj + "'><i class='material-icons left'>date_range</i></a></td>");

					tbody.append(information);
					table.append(thead);
					table.append(tbody);
					span.append(table);
					bodyDiv.append(span);
					li.append(bodyDiv);
					console.log(li);

					$("#accordion5").append(li);
					wiki(data.eclipses_in_year[i].event, ($("#daySolarWiki" + i)));
				}

				//set up month view
				if (data.eclipses_in_year[i].month === month && data.eclipses_in_year[i].year === year) {
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

					headings.html("<th>Event</th><th>Wikipedia</th><th>Add to Google Calendar");

					thead.append(headings);

					var information = $("<tr>");
					information.html("<td style='padding: 0 10px 0 10px'>" + data.eclipses_in_year[i].event + "</td><td style='padding: 0 10px 0 10px' id='monthSolarWiki" + i + "'></td><td><a class='waves-effect waves-light btn cal-btn' data-cal='" + calObj + "'><i class='material-icons left'>date_range</i></a></td>");

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
				if (data.eclipses_in_year[i].day === day && data.eclipses_in_year[i].month === month && data.eclipses_in_year[i].year === year) {
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

					headings.html("<th>Event</th><th>Wikipedia</th><th>Add to Google Calendar</th>");

					thead.append(headings);

					var information = $("<tr>");
					information.html("<td style='padding: 0 10px 0 10px'>" + data.eclipses_in_year[i].event + "</td><td style='padding: 0 10px 0 10px' id='yearSolarWiki" + i + "'></td><td><a class='waves-effect waves-light btn cal-btn' data-cal='" + calObj + "'><i class='material-icons left'>date_range</i></a></td>");

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
		error: function (errorMessage) {
			console.log("Error", errorMessage);
		}
	});
}


//gets information for asteroids close to earth from todays date through 7 days
function getAsteroids() {
	var date = new Date();
	var dd = date.getDate();
	var mm = date.getMonth();
	var yyyy = date.getFullYear();
	var startDate = yyyy + "-" + (mm + 1) + "-" + dd;
	var endDate = yyyy + "-" + (mm + 1) + "-" + (dd + 6);
	var apiKey = "FMWfaT1C1igzEgHUsZOK4ZUlCGACf42bmV2i9GYM";
	var url = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + startDate + "&end_date=" + endDate + "&api_key=" + apiKey;

	var dayEvents = [];
	var weekEvents = [];
	var dates = [];
	var calObj = {};

	//ajax call
	$.ajax({
		type: "GET",
		url: url,
		async: false,
		dataType: "json",
		success: function (data) {
			var day = 0;
			var nearObject = data.near_earth_objects;
			var keys = Object.keys(nearObject);

			keys.sort();

			$.each(keys, function () {
				var date = keys[day];
				var dateFormat = "YYYY/MM/DD";
				var convertedDate = moment(date, dateFormat);
				var newDate = convertedDate.format("MMMM Do YYYY");

				//create an object with information needed about asteroids
				var currentObj = nearObject[date];
				console.log(currentObj, "on", date);
				for (var i = 0; i < nearObject[date].length; i++) {

					calObj.summary = currentObj[i].name;
					calObj.description = "Near Earth object " + currentObj[i].name + " passes" + calDescriptionTag;
					calObj.start = {
						date: date
					}
					calObj.end = {
						date: date
					}
					var calObjStr = JSON.stringify(calObj);

					var info = {
						date: newDate,
						name: currentObj[i].name,
						missEarth: Math.round(currentObj[i].close_approach_data[0].miss_distance.miles).toLocaleString("en-US", { minimumFractionDigits: 0 }),
						speed: Math.round(currentObj[i].close_approach_data[0].relative_velocity.miles_per_hour).toLocaleString("en-US", { minimumFractionDigits: 0 }),
						diameterMax: Math.round(currentObj[i].estimated_diameter.feet.estimated_diameter_max).toLocaleString("en-US", { minimumFractionDigits: 0 }),
						diameterMin: Math.round(currentObj[i].estimated_diameter.feet.estimated_diameter_min).toLocaleString("en-US", { minimumFractionDigits: 0 }),
						danger: currentObj[i].is_potentially_hazardous_asteroid,
						calObj: calObjStr
					}

					if (info.date === todaysDate) {

						dayEvents.push(info);
					}

					weekEvents.push(info);
				}
				day++;
			});

		},
		error: function (errorMessage) {
			console.log("Error" + errorMessage);
		}
	});

	//completes accordion for day view
	for (var k = 0; k < dayEvents.length; k++) {
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

		headings.html("<th>Missing Earth (Miles)</th><th>Speed (MPH)</th><th>Max Diameter (Miles)</th><th>Min Diameter (Miles)</th><th>Dangerous</th><th>Add to Google Calendar</th>");

		thead.append(headings);

		var information = $("<tr>");
		information.html("<td>" + dayEvents[k].missEarth + "</td><td>" + dayEvents[k].speed + "</td><td>" + dayEvents[k].diameterMax + "</td><td>" + dayEvents[k].diameterMin + "</td><td>" + dayEvents[k].danger + "</td><td><a class='waves-effect waves-light btn cal-btn' data-cal='" + dayEvents[k].calObj + "'><i class='material-icons left'>date_range</i></a></td>");


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
	for (var i = 0; i < weekEvents.length; i++) {
		var li = $("<li>");
		var headerDiv = $("<div>");
		var bodyDiv = $("<div>");
		var span = $("<span>");
		var cap = i + 1;
		var thead = $("<thead>");
		var tbody = $("<tbody>");

		if (cap === weekEvents.length) {
			cap = i;
		}

		if (weekEvents[i].date !== weekEvents[cap].date) {


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


			headings.html("<th>Name</th><th>Missing Earth (Miles)</th><th>Speed (MPH)</th><th>Max Diameter (Miles)</th><th>Min Diameter (Miles)</th><th>Dangerous</th><th>Add to Google Calendar</th>");

			thead.append(headings);

			for (var j = 0; j < weekEvents.length; j++) {
				if (weekEvents[j].date === headerDiv.text()) {

					var information = $("<tr>");
					information.html("<td>" + weekEvents[j].name + "</td><td>" + weekEvents[j].missEarth + "</td><td>" + weekEvents[j].speed + "</td><td>" + weekEvents[j].diameterMax + "</td><td>" + weekEvents[j].diameterMin + "</td><td>" + weekEvents[j].danger + "</td><td><a class='waves-effect waves-light btn cal-btn' data-cal='" + weekEvents[j].calObj + "'><i class='material-icons left'>date_range</i></a></td>");

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

function getTodaysDate() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	var nDate = year + "/" + (month + 1) + "/" + day;
	var dateFormat = "YYYY/MM/DD";
	var convertedDate = moment(nDate, dateFormat);

	switch (month) {
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

function getMoonPhases() {
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth();
	var year = d.getFullYear();

	var dateFormat = (month + 1) + "/" + day + "/" + year;


	var url = "http://api.usno.navy.mil/moon/phase?date=" + dateFormat + "&nump=7";

<<<<<<< HEAD
                var headings = $("<tr>");
                headings.html("<th>Phase</th><th>Wikipedia</th>");
                
                thead.append(headings);
                
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'" + data.phasedata[i].phase + "</td><td style='padding: 0 10px 0 10px' id = 'dayMoonWiki" + i + "'></td>");
                
                tbody.append(information);
                table.append(thead);
                table.append(tbody);
                span.append(table);
                bodyDiv.append(span);
                li.append(bodyDiv); 
                $("#accordion9").append(li); 
                
                wiki(data.phasedata[i].phase, ($("#dayMoonWiki" + i)));
            } 
                    
            //week view 
            if(moonMonth == month && moonDay >= day && moonDay <= (day + 6)){
                
                var li = $("<li>");
                var headerDiv = $("<div>");
                var bodyDiv = $("<div>");
                var span = $("<span>");
                var thead = $("<thead>");
                var tbody = $("<tbody>");

	//ajax call
	$.ajax({
		type: "GET",
		url: url,
		async: false,
		dataType: "json",
		success: function (data) {
			var i = 0;
			$.each(data.phasedata, function () {
				var d = new Date()
				var day = d.getDate();
				var month = d.getMonth();
				month++;
				var year = d.getFullYear();
				var moonDate = data.phasedata[i].date.split(" ");
				var moonDay = moonDate[2];
				var moonMonth = moonDate[1];
				var moonYear = moonDate[0];

				switch (month) {
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

				//day view
				if (moonMonth === month && moonDay === day && moonYear === year) {
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

					wiki(data.phasedata[i].phase, ($("#dayMoonWiki" + i)));
				}

				//week view 
				if (moonMonth == month && moonDay >= day && moonDay <= (day + 6)) {

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

					wiki(data.phasedata[i].phase, ($("#weekMoonWiki" + i)));
				}


				//month view
				if (moonMonth == month && moonYear == year) {


                var headings = $("<tr>");
                headings.html("<th>Phase</th><th>Wikipedia</th>");
                
                thead.append(headings);
                
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.phasedata[i].phase + "</td><td style='padding: 0 10px 0 10px' id = 'weekMoonWiki" + i + "'></td>");
                
                tbody.append(information);
                table.append(thead);
                table.append(tbody);
                span.append(table);
                bodyDiv.append(span);
                li.append(bodyDiv);
                $("#accordion10").append(li); 
                
                wiki(data.phasedata[i].phase, ($("#weekMoonWiki" + i)));
            } 
               
            
            //month view
            if(moonMonth == month && moonYear == year){
                
                var li = $("<li>");
                var headerDiv = $("<div>");
                var bodyDiv = $("<div>");
                var span = $("<span>");
                var thead = $("<thead>");
                var tbody = $("<tbody>");

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


                table.attr("border", 1);
                table.attr("frame", "void");
                table.attr("rules", "all");
                
                var headings = $("<tr>");
                headings.html("<th>Phase</th><th>Wikipedia</th>");
                
                thead.append(headings);
                
                var information = $("<tr>");
                information.html("<td style='padding: 0 10px 0 10px'>" + data.phasedata[i].phase + "</td><td style='padding: 0 10px 0 10px' id = 'monthMoonWiki" + i + "'></td>");
                
                tbody.append(information);
                table.append(thead);
                table.append(tbody);
                span.append(table);
                bodyDiv.append(span);
                li.append(bodyDiv);
                $("#accordion11").append(li);
                
                wiki(data.phasedata[i].phase + "moon phase", ($("#monthMoonWiki" + i)));
                
                console.log(data.phasedata[i].phase);
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
            a.text("More Information");
            a.attr("href", data[3][0]);
            a.attr("target", "_blank");
            location.append(a);

        },
        error: function(errorMessage){
            alert("Error" + errorMessage);
        }
    });

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

					wiki(data.phasedata[i].phase, ($("#monthMoonWiki" + i)));
				}


				i++;
			})

		},
		error: function (errorMessage) {
			console.log("Error" + errorMessage);
		}
	});
}

function wiki(search, location) {
	var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + search + "&format=json&callback=?";


	//ajax call
	$.ajax({
		type: "GET",
		url: url,
		async: false,
		dataType: "json",
		success: function (data) {
			var a = $("<a>");
			a.text("More information");
			a.attr("href", data[3][0]);
			a.attr("target", "_blank");
			location.append(a);

		},
		error: function (errorMessage) {
			console.log("Error" + errorMessage);
		}
	});

}



/*-----------------------------------------------------------------------------------------------*/


// Html page interactions js 

$(document).ready(function(){
    
    getSolar();
    getMeteorShower();
    getMoonPhases();
    getISS();
    getTodaysDate();
    getAsteroids();
    

$(document).ready(function () {
	console.log("document.ready function run");
	getSolar();
	getMeteorShower();
	getMoonPhases();
	getISS();
	getTodaysDate();
	getAsteroids();



	// update clock every 1 second
	setInterval(updateClock, 1000);

	// Initialize collapse button
	$(".button-collapse").sideNav();
	// Initialize collapsible
	$('.collapsible').collapsible();

	// initialize .materialbox
	$('.materialboxed').materialbox();

	// click on .event-item initiate toast js with "event added" as text 
	$('.event-item').click(function () {
		Materialize.toast("Event added", 3000) // 3000 is the duration of the toast
	})
	// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
	$('.modal').modal();

	// initialize tooltips
	$('.tooltipped').tooltip({ delay: 50 });

	getLocation();
	getAPOD();

	// when click on #switch view...
	$('#switch-view').click(function () {

		// if day-view is hidden -> make week-view hidden, day-view visible and change icon to view_week
		if ($('#day-view').css('display') === 'none') {
			$("#week-view").css("display", "none");
			setTimeout(function () { $("#day-view").fadeToggle('slow'), 500 })
			$('#switch-view').text('view_week')
		} else { // if day-view is visible -> make day-view hidden, week-view visible, and change icon to view_quilt
			$("#day-view").css("display", "none");
			setTimeout(function () { $("#week-view").fadeToggle('slow'), 500 })
			$('#switch-view').text('view_quilt')

		}
	})

	// fade in tab when clicked
	$('.tab').click(function () {
		var tab = $(this).attr('tab-data');
		$('#' + tab).fadeIn('slow')
		if ($(this).attr('tab-data') === 'tab-news') {
			getNews()
		}
	})

	// Search news if click on search icon with input
	$('#news-search').click(function () {
		getNews();
		$('#news-input').val('');
	})

	// click enter when focus on search input === click on search icon
	$('#news-input').keyup(function (e) {
		if (e.keyCode === 13) {
			$('#news-search').click();
		}
	})

	//convert units f <-> c

	$('#day-temperature').on('click', '#convert-unit', function () {
		if ($(this).attr('data-state') === 'f') {
			$('#today-current-temp').css('display', 'none')
			$('#today-current-temp').html($(this).attr('data-c') + "<sup>&deg;C</sup>")
			$('#today-current-temp').fadeIn('fast')
			$('#convert-unit').html("&deg;F")
			$(this).attr('data-state', 'c')
		} else if ($(this).attr('data-state') === 'c') {
			$('#today-current-temp').css('display', 'none')
			$('#today-current-temp').html($(this).attr('data-f') + "<sup>&deg;F</sup>")
			$('#today-current-temp').fadeIn('fast')
			$('#convert-unit').html("&deg;C")
			$(this).attr('data-state', 'f')
		}
	})

	// embded constellation when click on constellation tab
	$('#tab-id-constell').click(function () {
		getConstellation();
		createConstellModal();

		// $('#tab-constell').append('<div id="wwtControl"'
		// + ' data-settings="crosshairs=false,ecliptic=true,pictures=true,boundaries=true"'
		//    + ' data-aspect-ratio="8:5"></div>'

		//    + ' <script src="http://worldwidetelescope.org/embedded-webcontrol.js"></script>'
		//    )
	})

	$('select').material_select();

	$('.constell-input').click(function (e) {
		getConstellation()
	})

	$('body').on('click', '.constell-modal-input', function (e) {
		getModalConstellation()
	})

	// slider on constellation UI
	$('#constell-img-size').mousemove(function () {
		var size = $('#constell-img-size').val();
		$('#constell-display').css('width', size + '%')
	})

	$('#constell-theme').on('change', function () {
		getConstellation()
	})

	$('body').on('change', '#constell-modal-theme', function () {
		getModalConstellation()
	})


	// $('body').on('click','#constell-modal-display',function(){
	//    	console.log('hey')
	//        $('#constell-img').animate({ 'width': '200%' }, 400);
	//    });

});

// "add to calendar" click handler
$("body").on("click", ".cal-btn", function (e) { 
    e.preventDefault();
    var args = JSON.parse($(this).attr("data-cal"));
		console.log("click was passed:",args);
    postToCal(args.summary, args.description, args.start, args.end);
});