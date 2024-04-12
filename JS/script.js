"use strict"

//GLOBAL OBJECT CAN BE USED BY ALL FUNCTIONS
const currentLocationObject = {
    latitude: 0,
    longitude: 0,
    status: "",
    timeZoneId: "",
    name: "",   
};
//API Keys Storage Object
const APIKeys ={
    googleAPIKey: "AIzaSyB2-Lhgprfg0zzJjoe54MBlUeO27U3PBw8",
    weatherApiKey: 'bf00d9d83cmshde9a54361856748p1d3d90jsn7ad4547f1474',  
    newsApiKey: 'pub_414313c92c14d5d8160676771ba86f7a440aa',     
};

/*******************************************************
    PAGE READY RUN CODE
******************************************************/
document.onreadystatechange = function () {   
        //Check the value on the DOM state - if it's 'interactive' then the DOM has loaded
        if (document.readyState === "interactive") {
            //When the page loads initMap - runs automatically from <script> tag in the HTML 
         
            //Set Up Light/Dark Mode Toggle
            darkLightToggle();   
            //Set up action for Click event on new Submission
            document.getElementById('getWeatherButton').addEventListener('click', updatePageWithUserInput);
       }//End DOM State Interactive
}; 
/*******************************************************
    FUNCTION DEFINITIONS 
******************************************************/
/**
 * Function: initMap90
 * @param {} mapElement 
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns 
 */
async function initMap() {
    //Get the element for the map
    const mapElement = document.getElementById('map');
    //This is zero be default and page load for both values
    const latitude =   Number(currentLocationObject.latitude);
    const longitude =  Number(currentLocationObject.longitude);

   //CHeck Latitude and Longitude values if valid
   if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
       console.error('Invalid coordinates for map initialization:', latitude, longitude);
       return;
   }
   //Create a map object
   const map = new google.maps.Map(mapElement, {
       center: { lat: latitude, lng: longitude },
       zoom: 10
   });
   //Add Traffic Layer to the map
   const trafficLayer = new google.maps.TrafficLayer();
   trafficLayer.setMap(map);
   //Set marker
   const marker = new google.maps.Marker({
       position: { lat: latitude, lng: longitude },
       map: map,
       title: 'City Location'
   });

   if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function (position) {
          let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
           map.setCenter(initialLocation);

          //Update global position
          currentLocationObject.latitude = position.coords.latitude;
          currentLocationObject.longitude = position.coords.longitude;

          //Update Draw Map
          updateMap(mapElement, currentLocationObject.latitude, currentLocationObject.longitude);
          //Update Weather 
          updatePageOnLoad(currentLocationObject.latitude,currentLocationObject.longitude);
         
       });
   } 
}              
/**
 * Function: updatePageOnLoad
 * @param {*} latitude 
 * @param {*} longitude 
 */
async function updatePageOnLoad(latitude, longitude) {

    /**DATA VARIABLES NEEDED */
    const locationInput = document.getElementById('location');
    const location = locationInput.value;

    //Get Weather Info using lat and long 
    const weatherInfoObject =  await getWeatherDataLatLong(latitude,longitude);

    //Update Weather UI information 
    writeWeatherDataToPage(weatherInfoObject); 

    //Get News data
    const newsInfoObject = await getNewsData();

   //Populate News Info on Page
    writeNewsInfoObject(newsInfoObject.results);
}
/**
 * Function: updatePageWithUserInput
 */
async function updatePageWithUserInput() {
    //DATA VARIABLES NEEDED 
    //Get user Input
    const locationInput = document.getElementById('location');
    const location = locationInput.value;

    const weatherInfoObject =  await getWeatherDataLocation(location);    

    writeWeatherDataToPage(weatherInfoObject);
    
    const mapElement = document.getElementById('map');
      
    updateMap(mapElement,weatherInfoObject.location.lat,weatherInfoObject.location.lon);

   //Get News data
   const newsInfoObject = await getNewsData();

   //Populate News Info on Page
   writeNewsInfoObject(newsInfoObject.results);
}
/**
 * Function: getWeatherDataLocation
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns 
 */
async function getWeatherDataLocation(location){

    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': APIKeys.weatherApiKey,
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };
    
  /**FETCH WEATHER DATA */
  try{
    const response = await fetch(url, options);
    const weatherResponse = await response.json();
    //Print Result
     return weatherResponse;
    }
    catch(error){
        
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please check your API keys and try again.');

    }
}
/**
 * Function: getWeatherDataLatLong
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns 
 */
async function getWeatherDataLatLong(latitude,longitude){

    //Weather.API
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': APIKeys.weatherApiKey,
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };
  /**FETCH WEATHER DATA */
  try{

    const response = await fetch(url, options);
    const weatherResponse = await response.json();
    //Print Result
     return weatherResponse;
}
catch(error){
    
    console.error('Error fetching data:', error);
    alert('Error fetching data. Please check your API keys and try again.');

}

}
/**
 * Function: writeWeatherDataToPage
 * @param {*} weatherDataObject 
 */
function writeWeatherDataToPage(weatherDataObject)
{    
        //Variables
        const latitude = Number(weatherDataObject.location.lat);
        const longitude = Number(weatherDataObject.location.lon);
        const mapElement = document.getElementById('map');
        
        //Set Name
        currentLocationObject.name = weatherDataObject.location.name;

        //Split string to get time from Date
        const myDateTimeArray = weatherDataObject.location.localtime.split(" ");              
        let localTime = militaryToStandardTime(myDateTimeArray[1]);

        //Set Time
        const elTimeElement = document.getElementById('time');
        elTimeElement.textContent = `${localTime}`;

        const elDescript = document.getElementById('weatherDesc');
        elDescript.textContent = `${weatherDataObject.current.condition.text}`;             

        const elTempF = document.getElementById('tempF');
        elTempF.textContent = `${weatherDataObject.current.temp_f}°F`;

        const elTempC = document.getElementById('tempC');
        elTempC.textContent = `${weatherDataObject.current.temp_c} °C`;

        const elHum = document.getElementById('humidity');
        elHum.textContent = `${weatherDataObject.current.humidity} %`; 

        const elUV = document.getElementById('uvIndex');
        elUV.textContent = `${weatherDataObject.current.uv}`;              

        const elWinSpeedMPH = document.getElementById('windSpeedMPH');
        elWinSpeedMPH.textContent = `${weatherDataObject.current.wind_mph} mp/h`; 

        const elWinSpeedKMH = document.getElementById('windSpeedKMH');
        elWinSpeedKMH.textContent = `${weatherDataObject.current.wind_kph} km/h`; 

        const nameElement = document.getElementById('nameId');
        nameElement.textContent = `${weatherDataObject.location.name}`;

        const locationElement = document.getElementById('regionId');
        locationElement.textContent = `${weatherDataObject.location.region}`;

        const countryElement = document.getElementById('countryId');
        countryElement.textContent = `${weatherDataObject.location.country}`;
}
/**
 * Function: updateMap
 * @param {} mapElement 
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns 
 */
async function updateMap(mapElement, latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
        console.error('Invalid coordinates for map initialization:', latitude, longitude);
        return;
    }

    const map = new google.maps.Map(mapElement, {
        center: { lat: latitude, lng: longitude },
        zoom: 10
    });

    // Add Traffic Layer to the map
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'City Location'
    });

    const $info = document.getElementById('info');
    $info.textContent = `Lat: ${latitude.toFixed(5)} Lng: ${longitude.toFixed(5)}`;
}
/**
 * Function: updateNews
 */
async function getNewsData()
{
    var url = `https://newsdata.io/api/1/news?apikey=${APIKeys.newsApiKey}&qInMeta=${currentLocationObject.name}&language=en`;
    
    var options = {
        method: 'GET',
        headers: {
        'Accept': 'application/json'
        }
    }
  
    try{
            const newsResponse = await fetch(url, options);
            const localNewsData = await newsResponse.json();
            //Print Result
            return localNewsData;         
    }
    catch(error){        
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please check your API keys and try again.');
    }
}
/**
 * Function: writeNewsInfoObjects
 * @param {} articles 
 */
function  writeNewsInfoObject(articles) {

    console.log(articles);

    const newsElement = document.getElementById('news');
    newsElement.innerHTML = '';

    if (articles.length > 0) {
        const newsList = document.createElement('ul');

        articles.forEach(article => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${article.title}</strong><br>${article.description}<br><a href="${article.link}" target="_blank">Read more</a>`;
            newsList.appendChild(listItem);
        });

        newsElement.appendChild(newsList);
    } else {
        newsElement.innerHTML = 'No news available for the selected location.';
    }
}
/*******************************************************
   HELPER FUNCTIONS
******************************************************/
/**
 * Function: militaryToStandardTime
 * @param {} militaryTime 
 * @returns 
 */
function militaryToStandardTime(militaryTime) {
    var timeArray = militaryTime.split(":");
    var hours = Number(timeArray[0]);
    var minutes = timeArray[1];

    // Calculate standard time
    var timeValue;
    if (hours > 0 && hours <= 12) {
        timeValue = "" + hours;
    } else if (hours > 12) {
        timeValue = "" + (hours - 12);
    } else if (hours === 0) {
        timeValue = "12";
    }

    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;

    // Add AM or PM
    timeValue += (hours >= 12) ? " P.M." : " A.M.";

    return timeValue;
}
/**
 * Function: darkLightToggle
 */
function darkLightToggle()
{
    const checkbox = document.getElementById("checkbox")
    checkbox.addEventListener("change", () => {
        if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
            document.documentElement.setAttribute('data-bs-theme','light')
        }
        else {
            document.documentElement.setAttribute('data-bs-theme','dark')
        }
    
    })
}
