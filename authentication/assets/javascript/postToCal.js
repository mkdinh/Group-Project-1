/*
  IMPORTANT: include this script at the bottom of the main HTML page
  to load Google API:
    <script async defer src="https://apis.google.com/js/api.js"></script>
*/

/*
  See https://developers.google.com/google-apps/calendar/v3/reference/events/insert#examples
  for examples of request formatting
*/

// Client ID and API key from the Developer Console
var CLIENT_ID = '684241832249-bjgaqjvt9408fvm3iokba1fj0mdabiht.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

/**
 *  On load, called to load the auth2 library and API client library.
 */
$(window).ready(function () {
  gapi.load('client:auth2', initClient);
});

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  });
}


/*
  Formatting for these parameters:
    (see googleCalDemo.html for examples, and also for function for formatting dates)
  summary: string (this will be the event "title")
  description: string
  start: an object. 
    For all-day events, it contains key 'date' with value formatted yyyy-mm-dd. 
    For time-specific events, it contains key 'dateTime' 
    with value formatted yyyy-mm-ddThh:mm:ss{time zone, format eg -05:00}
    e.g.:
      'start': {
        'dateTime': '2017-07-08T14:00:00-04:00'
      }
  end: an object, same as start
  location: string, preferably valid address; 
    for best results include country, e.g. "US"
*/

function postToCal(summary, description, start, end) {
  var event = {
    'summary': summary,
    'description': description,
    'start': start,
    'end': end,
  }
  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });
  
  gapi.auth2.getAuthInstance().signIn().then(function(){
    request.execute(function(event) {
      $("#output").append("Event created: <a>" + event.htmlLink + "</a>");
    });
  });
}