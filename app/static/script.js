function get_weather() {
    var darksky_url = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/8bd8d54b4b0561468f1f52090d22bc45/51.68186,-1.40617/?units=uk2"
    fetch(darksky_url, {mode: "cors"})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var time = response.currently.time;
            var t = new Date();
            var prefix = "../static/icons2/";
            var sunrise = response.daily.data[0].sunriseTime;
            var sunset = response.daily.data[0].sunsetTime;
            var d_or_n = day_or_night(time, sunrise, sunset);
            var image_selector = { "day"  :{"clearday"           : "sunny_day.png",
                                            "rain"                : "heavy_rain.png",
                                            "snow"                : "heavy_snow.png",
                                            "sleet"               : "sleet.png",
                                            "wind"                : "white_cloud_day.png",
                                            "fog"                 : "fog.png",
                                            "cloudy"              : "white_cloud_day.png",
                                            "partlycloudyday"   : "sunny_intervals_day.png",
                                            "partlycloudynight" : "partly_cloudy_night.png"},
                                "night":{"clearnight"         : "clear_sky.png",
                                            "rain"                : "heavy_rain_shower_night.png",
                                            "snow"                : "heavy_snow_shower_night.png",
                                            "sleet"               : "sleet_shower_night.png",
                                            "wind"                : "white_cloud_day.png",
                                            "fog"                 : "fog.png",
                                            "cloudy"              : "partly_cloudy_night.png",
                                            "partlycloudyday"   : "sunny_intervals_day.png",
                                            "partlycloudynight" : "partly_cloudy_night.png"}};

            /* Today now */
            var dsicon = response.currently.icon;
            var formatted = dsicon.replace(/-/g, "");
            var time_selector = (d_or_n == "morning" ? 'night' : d_or_n);
            var image = image_selector[time_selector][formatted];
            var path = prefix + image;

            document.getElementById("today-icon").src = path;
            var now_tem = Math.round(response.currently.temperature);
            var now_sum = response.currently.summary;
            var now_mes = now_tem + "°C, " + now_sum + ".";
            document.getElementById("today-now").innerText = now_mes;
            var hourly = response.hourly.summary;
            document.getElementById("today-desc").innerText = hourly;
            /* Today other */
            var tod_feel = Math.round(response.currently.apparentTemperature);

            if (d_or_n == "morning") {
                var ton_min = Math.round(response.daily.data[0].temperatureLow);
                var ton_min_time = response.daily.data[0].temperatureLowTime;
                if (ton_min_time > time) {
                    is_was = 'is'
                }
                else {is_was = 'was'}
                var sun_rise = convert_date(response.daily.data[0].sunriseTime);
                document.getElementById("today-minmax").innerHTML = `Tonight's low ${is_was} <strong>${ton_min}°</strong>.`;
                document.getElementById("today-sun").innerHTML = `Sunrise is at <strong>${sun_rise}</strong>.`;
            }
            else if (d_or_n == "day") {
                var tod_max = Math.round(response.daily.data[0].temperatureHigh);
                var sun_set = convert_date(response.daily.data[0].sunsetTime);
                var tod_max_time = response.daily.data[0].temperatureHighTime;
                if (tod_max_time > time) {
                    is_was = 'is'
                }
                else {is_was = 'was'}
                document.getElementById("today-minmax").innerHTML = `Today's high ${is_was} <strong>${tod_max}°</strong>.`;
                document.getElementById("today-sun").innerHTML = `Sunset is at <strong>${sun_set}</strong>.`;
            }
            else if (d_or_n == "night") {
                var ton_min = Math.round(response.daily.data[1].temperatureLow);
                var sun_rise = convert_date(response.daily.data[1].sunriseTime);
                var ton_min_time = response.daily.data[1].temperatureLowTime;
                if (ton_min_time > time) {
                    is_was = 'is'
                }
                else {is_was = 'was'}
                document.getElementById("today-minmax").innerHTML = `Tonight's low ${is_was} <strong>${ton_min}°</strong>.`;
                document.getElementById("today-sun").innerHTML = `Sunrise is at <strong>${sun_rise}</strong>.`;
            }

            var tod_rain = Math.round(response.currently.precipProbability * 100);
            var tod_wind = Math.round(response.currently.windSpeed);
            var tod_wind_bearing = get_bearing(response.daily.data[0].windBearing);
            document.getElementById("today-feel").innerHTML = `Feels like <strong>${tod_feel}°</strong>.`;
            document.getElementById("today-rain").innerHTML = `Chance of rain: <strong>${tod_rain}</strong>%.`;
            document.getElementById("today-wind").innerHTML = `Wind speed: <strong>${tod_wind}</strong>mph, <strong>${tod_wind_bearing}</strong>.`;  
        
            /* Forecast */
            var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            for (var i = 1; i <= 5; i++) {
                console.log(response.daily.data[i].summary);
                var daynum = t.getDay();
                var min_temp = Math.round(response.daily.data[i].temperatureLow);
                var max_temp = Math.round(response.daily.data[i].temperatureHigh);
                var dsicon = response.daily.data[i].icon;
                var formatted = dsicon.replace(/-/g, "");
                var image = image_selector['day'][formatted];
                var tod_rain = Math.round(response.daily.data[i].precipProbability * 100);
                var tod_wind = Math.round(response.daily.data[i].windSpeed);
                var path = prefix + image;
                var div_prefix = `day${i}`;
                document.getElementById(`${div_prefix}-name`).innerHTML = days[(daynum + i)%7];
                document.getElementById(`${div_prefix}-minmax`).innerHTML = `${min_temp}/<strong>${max_temp}</strong>`;
                document.getElementById(`${div_prefix}-icon`).src = path;
                document.getElementById(`${div_prefix}-rain`).innerHTML = `<strong>${tod_rain}</strong>%`;
                document.getElementById(`${div_prefix}-wind`).innerHTML = `<strong>${tod_wind}</strong>mph`;
            }
        });
    setTimeout(get_weather, 30000);
    }

function get_tube_status() {

    var tube_url = "https://api.tfl.gov.uk/Line/Mode/tube/Status";
    fetch(tube_url, {mode: "cors"})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var line_ids = ["bakerloo", "central", "circle", "district", "hammersmith-city", "jubilee", "metropolitan", "northern", "piccadilly", "victoria", "waterloo-city"];
            var mode_status = "";
            for (var i = 0; i < line_ids.length; i++) {
                var name = response[i].id;
                var status = response[i].lineStatuses[0].statusSeverityDescription;
                var div = document.getElementById(`${name}-status`);
                div.innerHTML = status;
                if (status == "Good Service") {
                    div.classList.add("good-service");
                }
                else if (status == "Minor Delays" ||
                    status == "Part Suspended" ||
                    status == "Special Service") {
                    div.classList.add("minor-delays");
                }
                else if (status == "Severe Delays" ||
                    status == "Part Closure" ||
                    status == "Suspended" ||
                    status == "Planned Closure" || 
                    status == "Service Closed") {
                    div.classList.add("severe-delays");
                }
                var status_description = response[i].lineStatuses[0].reason;
                if (status_description == undefined) {
                    continue
                }
                else {mode_status += status_description};
            document.getElementById("mode-status").innerHTML = `<span>${mode_status}</span>`;
            }
    setInterval(get_tube_status, 30000);
})}

function convert_date(unix_timestamp) {

    var t = new Date(unix_timestamp * 1000);
    var hours = t.getHours();
    hours = (hours < 10 ? "0" : "") + hours;
    var minutes = t.getMinutes();
    minutes = (minutes < 10 ? "0" : "") + minutes;
    var timestr  = hours + ":" + minutes;

    return timestr;
}

function get_bearing(angle) {

    if (angle <= 22.5 || angle > 337.5) {bearing = "N";}
    else if (angle <= 67.5) {bearing = "NE";}
    else if (angle <= 67.5) {bearing = "NE";}
    else if (angle <= 112.5) {bearing = "E";}
    else if (angle <= 157.5) {bearing = "SE";}
    else if (angle <= 202.5) {bearing = "S";}
    else if (angle <= 247.5) {bearing = "SW";}
    else if (angle <= 292.5) {bearing = "W";}
    else if (angle <= 337.5) {bearing = "NW";}

    return bearing;
}

function day_or_night(now, sunrise, sunset) {
    if (now < sunrise)  {
        verdict = "morning";
    }
    if (now > sunrise && now < sunset)  {
        verdict = "day";
    }
    else if (now > sunset) {verdict = "night";}

    return verdict;
}

function get_and_format_datetime() {
    var d = new Date();

    var i = d.getDate();
    var j = String(i % 10), k = String(i % 100);
    if (j == 1 && k != 11) {
        var daynum = String(i) + "<sup>st</sup> ";
    }
    else if (j == 2 && k != 12) {
        var daynum = String(i) + "<sup>nd</sup> ";
    }
    else if (j == 3 && k != 13) {
        var daynum = String(i) + "<sup>rd</sup> ";
    }
    else {
        var daynum = String(i) + "<sup>th</sup> ";
    }
    
    var monthnames = ["January ", "February ", "March ", "April ", "May ", "June ", "July ", "August ", "September ", "October ", "November ", "December "];
    var monthname = monthnames[d.getMonth()];
    var weekdays = ["Sunday, ", "Monday, ", "Tuesday, ", "Wednesday, ", "Thursday, ", "Friday, ", "Saturday, "];
    var dayname = weekdays[d.getDay()];
    var year = String(d.getFullYear());
    
    document.getElementById("date").innerHTML = dayname + daynum + monthname + year;

    var hours = d.getHours();
    hours = (hours < 10 ? "0" : "") + hours;
    var minutes = d.getMinutes();
    minutes = (minutes < 10 ? "0" : "") + minutes;
    var seconds = d.getSeconds();
    seconds = (seconds < 10 ? "0" : "") + seconds;
    var timestr  = hours + ":" + minutes + ":" + seconds

    document.getElementById("time").innerText = timestr
    setInterval(get_and_format_datetime, 1000)

}
/*
function get_events() {
    
    var d = new Date();
    day = d.getDay();
    month = d.getMonth();
    fetch(`https://byabbe.se/on-this-day/${month}/${day}/events.json`)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var str = '';

        for (i = 0; i < response.length; i++) {
            str += `<b>${response[0].events[i].year}</b>: ${response[0].events[i].description} `;
        }

        document.getElementById("onthisday").innerText = str;
        console.log(str);
})}
*/

function main() {
    get_and_format_datetime();
    get_tube_status();
    get_weather();
}

window.onload = main;