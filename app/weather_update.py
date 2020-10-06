from data import dark_sky_api_key
from get_json import get_json
import datetime

url = 'https://api.darksky.net/forecast/8bd8d54b4b0561468f1f52090d22bc45/51.68186,-1.40617/?units=uk2'

def get_forecast(url):
    
    forecast = get_json(url)

    return forecast

def get_current_conditions(forecast):

    summary = forecast['currently']['summary']
    temperature = int(round(forecast['currently']['temperature'],0))
    out = "Currently: {}°, {}.".format(temperature, summary)

    return out

def next_hour(forecast):

    minutely = forecast['minutely']['summary']

    return minutely

def next_day(forecast):

    hourly = forecast['hourly']['summary']

    return hourly

def next_week(forecast):

    formatted = {}

    for i in range(1,6):
        day = {}
        time = forecast['daily']['data'][i]['time']
        day['name'] = datetime.datetime.utcfromtimestamp(time).strftime('%a')
        day['min_temp'] = int(round(forecast['daily']['data'][i]['temperatureLow'], 0))
        day['max_temp'] = int(round(forecast['daily']['data'][i]['temperatureHigh'], 0))
        day['icon'] = get_icon(forecast = forecast, icon = forecast['daily']['data'][i]['icon'], day_or_night='day')[1]
        day['rain_prob'] = int(forecast['daily']['data'][i]['precipProbability'] * 100)
        day['wind_speed'] = int(round(forecast['daily']['data'][i]['windSpeed'], 0))
        formatted['{}'.format(i)] = day

    return formatted

def get_icon(forecast = None, icon = None, day_or_night = 'auto'):

    prefix = "../static/icons2/"

    if icon == None:
        icon = forecast['currently']['icon']

    if day_or_night == 'auto':
        current_time = forecast['currently']['time']
        sunrise_time = forecast['daily']['data'][0]['sunriseTime']
        sunset_time = forecast['daily']['data'][0]['sunsetTime']
        if current_time < sunset_time and current_time > sunrise_time:
            day_or_night = 'day'
        else: day_or_night = 'night'

    image_selector = {'day'  :{'clear-day'           : 'sunny_day.png',
                                'rain'                : 'heavy_rain.png',
                                'snow'                : 'heavy_snow.png',
                                'sleet'               : 'sleet.png',
                                'wind'                : 'white_cloud_day.png',
                                'fog'                 : 'fog.png',
                                'cloudy'              : 'white_cloud_day.png',
                                'partly-cloudy-day'   : 'sunny_intervals_day.png',
                                'partly-cloudy-night' : 'partly_cloudy_night.png'},
                        'night':{'clear-night'         : 'clear_sky.png',
                                'rain'                : 'heavy_rain_shower_night.png',
                                'snow'                : 'heavy_snow_shower_night.png',
                                'sleet'               : 'sleet_shower_night.png',
                                'wind'                : 'white_cloud_day.png',
                                'fog'                 : 'fog.png',
                                'cloudy'              : 'partly_cloudy_night.png',
                                'partly-cloudy-day'   : 'sunny_intervals_day.png',
                                'partly-cloudy-night' : 'partly_cloudy_night.png'}}

    try:
        image = image_selector[day_or_night][icon]
    except KeyError:
        image = "nodata.png"
    
    path = prefix + image

    return icon, path
        
def test():

    f = get_forecast(url)
    c = get_current_conditions(f)
    print(c)
    d = next_day(f)
    print(d)
    w = next_week(f)
    print(w)
    i = get_icon(forecast=f)
    print(i)
    
if __name__ == '__main__':
    test()