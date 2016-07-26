//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~GET WEATHER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Next 3 functions are trying to get coordinates
function tryGeolocation() {
    if (navigator.geolocation) {
        // Successful: geolocation possible to access
        navigator.geolocation.getCurrentPosition(successful, failure); //
    } else {
        alert("Sorry, your browser does not support geolocation services.");
    }
}

var longVal = "";
var latVal = "";


function successful(position) {

    $('#longitudeRaw').text("longitude: " + position.coords.longitude);
    $('#latitudeRaw').text("latitude: " + position.coords.latitude);
    longVal = position.coords.longitude.toString();
    latVal = position.coords.latitude.toString();
    console.log("long: " + position.coords.longitude + " & lat: " + position.coords.latitude);

    //have to call this function within due to asynchronous
    getWeatherData(function (response) {
        //console.log(response);
        modifyFields(response);
    });

    getAddressFromCoordinates(function (response) {
        console.log(response.results[0].formatted_address);
        //$("#location").text(response.results[0].formatted_address); //can just use openweather to get city name instead of full address
    });
}

function failure() {
    console.log("Could not obtain location");
}



//Get weather from coordinates
function getWeatherData(callback) {

    url = "http://api.openweathermap.org/data/2.5/weather?lat=" + latVal + "&lon=" + longVal + "&appid=6abb32904cbeebea6cf45132db398c17";
    console.log(url);


    $.ajax({
        url: url,
        jsonp: "callback",
        dataType: 'jsonp',
        xhrFields: {
            withCredentials: false
        },
        success: callback
    });
}


//Self explanatory
function getAddressFromCoordinates(callback) {

    url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latVal + "," + longVal + "&sensor=true";


    $.ajax({
        url: url,
        success: callback
            /*or you could iterate the components for only the city and state*/
    });
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//BREAK
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~INPUT TEXT + METRIC/IMPERIAL + CHANGE ICON & BACKGROUND~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function modifyFields(weatherData) {
    console.log(weatherData.main.temp - 273.15);

    //Input text fields
    $("#temp").text(Math.round(weatherData.main.temp - 273.15) + String.fromCharCode(176) + "C"); //CELSIUS
    $("#wind").text(Math.round(weatherData.wind.speed * 3.6) + "km/h"); //KILOMETERS
    $("#location").text(weatherData.name); //Refer to function: getAddressFromCoordinates
    console.log("converted to metric main");

    removeLoader();

    //Rotate Dial
    windRotate(weatherData);

    //animationIcon
    animationIcon(weatherData);

    //Convert to FAHRENHEIT and MILES
    $("#imperial").click(function () {
        if (!$("#imperial").hasClass("bolder")) {
            imperial(weatherData);
            $("#imperial").addClass("bolder");
            $("#metric").removeClass("bolder");
            console.log("bolded imperial");
        } else if ($("#imperial").hasClass("bolder")) {
            console.log("do nothing to imperial");
        }
    });

    //Convert back to CELSIUS AND KILOMETERS
    $("#metric").click(function () {
        if (!$("#metric").hasClass("bolder")) {
            metric(weatherData);
            $("#metric").addClass("bolder");
            $("#imperial").removeClass("bolder");
            console.log("bolded metric");
        } else if ($("#metric").hasClass("bolder")) {
            console.log("do nothing to metric");
        }
    });
};

function imperial(weatherData) {
    $("#temp").text(Math.round((weatherData.main.temp - 273.15) * 1.8 + 32) + String.fromCharCode(176) + "F"); // FAHRENHEIT
    $("#wind").text(Math.round((weatherData.wind.speed * 3.6) / 1.609344) + "mph"); //MILES
    console.log("converted to imperial");
};

function metric(weatherData) {
    $("#temp").text(Math.round(weatherData.main.temp - 273.15) + String.fromCharCode(176) + "C"); //CELSIUS
    $("#wind").text(Math.round(weatherData.wind.speed * 3.6) + "km/h"); //KILOMETERS
    console.log("converted to metric");
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//BREAK
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~WIND DIRECTION~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function windRotate(weatherData) {
    $("#dial").addClass("wi wi-wind towards-" + weatherData.wind.deg + "-deg");
    console.log("rotated " + weatherData.wind.deg);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//BREAK
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOADER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function textLoader() {

    setInterval(function () {
        if ($("#loadingText").text().length < 10) {
            $("#loadingText").append(".")
        } else {
            $("#loadingText").text("Loading");
        }
    }, 500)
}

function removeLoader() {
    //    $("#coverLeft").removeAttr("class");
    //    $("#coverRight").removeAttr("class");
    $("#coverLeft").fadeOut(1000);
    $("#coverRight").fadeOut(1000);
    $("#spinnerOne").remove();
    $("#spinnerTwo").remove();
    $("#spinnerThree").remove();
    $("#loadingText").remove();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//BREAK
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ANIMATION ICON~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function animationIcon(weatherData) {



    console.log(weatherData);
    var iconID = weatherData.weather[0].id;
    var iconCode = weatherData.weather[0].icon;
    var partDescription = weatherData.weather[0].main;
    var mainDescription = weatherData.weather[0].description;

    var iconRawData = {
        "01d": "wi wi-day-sunny",
        "02d": "wi wi-day-cloudy",
        "03d": "wi wi-cloud",
        "04d": "wi wi-cloudy",
        "09d": "wi wi-rain",
        "10d": "wi wi-day-rain",
        "11d": "wi wi-day-thunderstorm",
        "13d": "wi wi-day-snow",
        "50d": "wi wi-day-fog",
        "01n": "wi wi-night-clear",
        "02n": "wi wi-night-alt-cloudy",
        "03n": "wi wi-cloud",
        "04n": "wi wi-cloudy",
        "09n": "wi wi-rain",
        "10n": "wi wi-night-alt-rain",
        "11n": "wi wi-night-alt-thunderstorm",
        "13n": "wi wi-night-alt-snow",
        "50n": "wi wi-night-fog",
    };

    var iconRawBackground = {
        "01d": "http://www.pixelstalk.net/wp-content/uploads/2016/04/Green-Mountain-Computer-Wallpaper-HD.jpg",
        "02d": "https://wallpaperscraft.com/image/coast_gloomy_darkness_cloudy_55573_1680x1050.jpg",
        "03d": "http://randomwallpapers.net/beautiful-green-field-in-the-cloudy-sky-nature-2560x1600-wallpaper340092.jpg",
        "04d": "http://www.thewallpapers.org/photo/22310/cloudy-day.jpg",
        "09d": "http://webneel.com/wallpaper/sites/default/files/images/04-2013/creative-rain_0.jpg",
        "10d": "https://i.ytimg.com/vi/MR47cSm4OWk/maxresdefault.jpg",
        "11d": "http://cdn.pcwallart.com/images/thunderstorm-wallpaper-2.jpg",
        "13d": "https://wallpaperscraft.com/image/trail_trees_snow_frost_day_winter_47984_1920x1080.jpg",
        "50d": "http://feelgrafix.com/data_images/out/7/804705-fog-wallpapers.jpg",
        "01n": "http://i.imgur.com/HF3Xxg1.jpg",
        "02n": "http://wallpapers-hd-wide.com/wp-content/uploads/2016/01/Beautiful-cloudy-night-full-moon-moonlight-1920x1080.jpg",
        "03n": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Reading_The_Night_Sky%3B_Is_There_Love_In_Space_by_Dean_Kavanagh.jpg",
        "04n": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Reading_The_Night_Sky%3B_Is_There_Love_In_Space_by_Dean_Kavanagh.jpg",
        "09n": "http://7-themes.com/data_images/out/71/7016563-rain-at-night.jpg",
        "10n": "http://7-themes.com/data_images/out/71/7016563-rain-at-night.jpg",
        "11n": "http://duncan.co/wp-content/uploads/2015/06/Duncan-Rawlinson-Photo-246534-Thunderstorm-Jennifer-Kateryna-Kovalskyj-Park-Toronto-Ontario-Canada-20150623-IMG_2300-CN-Tower-Ligtning-02.jpg",
        "13n": "http://cdn.pcwallart.com/images/yosemite-winter-night-wallpaper-1.jpg",
        "50n": "http://i.imgur.com/unPFVBx.jpg",
    }

    var iconIDData = {
        //Atmosphere
        "701": "wi wi-windy",
        "711": "wi wi-smoke",
        "721": "wi wi-day-haze",
        "731": "wi wi-dust",
        "741": "wi wi-fog",
        "751": "wi wi-dust",
        "761": "wi wi-dust",
        "762": "wi wi-volcano",
        "771": "wi wi-strong-wind",
        "781": "wi wi-tornado",
        //Extreme
        "900": "wi wi-tornado",
        "901": "wi wi-hurricane",
        "902": "wi wi-hurricane",
        "903": "wi wi-snowflake-cold",
        "904": "wi wi-thermometer",
        "905": "wi wi-strong-wind",
        "906": "wi wi-sleet",
        //Additional
        "951": "wi wi-wind-beaufort-0",
        "952": "wi wi-wind-beaufort-1",
        "953": "wi wi-wind-beaufort-2",
        "954": "wi wi-wind-beaufort-3",
        "955": "wi wi-wind-beaufort-4",
        "956": "wi wi-wind-beaufort-5",
        "957": "wi wi-wind-beaufort-6",
        "958": "wi wi-wind-beaufort-7",
        "959": "wi wi-wind-beaufort-8",
        "960": "wi wi-wind-beaufort-9",
        "961": "wi wi-wind-beaufort-10",
        "962": "wi wi-hurricane",
    };

    $("#icon").addClass(iconRawData[iconCode]); //Add icon
    //    $("#backgroundBody").attr("background-image", "url('" + iconRawBackground[iconCode] + "')");
    $("#backgroundBody").css("background-image", "url('" + iconRawBackground[iconCode] + "')");
    console.log(partDescription);
    console.log(iconCode);
    console.log(iconRawData[iconCode]);

    $("#description").text(mainDescription);


};


$(document).ready(function () {
    textLoader();
    tryGeolocation();

    //can't call getWeatherData here due to asynchronous

});