from get_json import get_json
import datetime
import data

appended = '?app_id=' + data.tfl_app_id + '&app_key=' + data.tfl_app_key

def all_line_ids():
    ids = []
    '''
    Get a list of all line ids for all lines on the tube
    '''
    json_result = get_json('https://api.tfl.gov.uk/Line/Mode/tube/'+appended)
    lines = json_result
    # Extract line id for each line in json_result
    ids = [i['id'] for i in lines]
    return(ids)

def mode_status(ids):
    line_statuses = {}
    disruption_message = ''
    json_result = get_json('https://api.tfl.gov.uk/Line/Mode/tube/Status')
    # Create dictionary of status descriptors for each line
    for line in ids:
        idx = ids.index(line)
        name = json_result[idx]['name']
        status_description = json_result[idx]['lineStatuses'][0]['statusSeverityDescription']
        line_statuses['{}'.format(name)] = '{}'.format(status_description)
        try:
            disruption_message += json_result[idx]['lineStatuses'][0]['reason']
        except KeyError:
            pass 
    return line_statuses, disruption_message

def next_trains(station_naptan, destination_naptan, num_to_get):
    """Retrieve time to next n trains between given stations based on their
        NaPTAN (National Public Transport Access Node) id.

    Parameters
    ----------
    station_naptan : str
        NaPTAN id of starting station
    
    destination_naptan : str
        NaPTAN id of destination station

    num_to_get : int
        Number of next trains to fetch (up to 9)

    Returns
    -------
    message : str
        Message containing countdown to next trains in minutes, in the format of:
        "Trains to {destination name}: {time 0}, {time 2}, ... , {time n-1} minutes."
    """
    arrival_times = []
    next_trains_message = ''
    json_result = get_json('https://api.tfl.gov.uk/Line/jubilee/Arrivals/{}?direction=outbound&destinationStationId={}'.format(station_naptan, destination_naptan))
    try:
        destination_name = json_result[0]['towards']
    except IndexError:
        next_trains_message = "Unable to fetch next trains."
        return next_trains_message
    # Find number of seconds to station for all trains in next 30 mins
    for train in range(len(json_result)):
        arrival_time = json_result[train]['timeToStation']
        arrival_times.append(arrival_time)
    # Sort trains based on arrival time and next n closest trains
    sorted_times = sorted(arrival_times)
    next_n_trains = sorted_times[0:num_to_get]
    # List of arrival times in minutes
    minutes_to_station = [int(i/60) for i in next_n_trains]
    for i in minutes_to_station:
        if i == 0:
            minutes_to_station[i] = 'Due'
    # Final message
    next_trains_message = "Trains to {}: {}, {}, {} minutes.".format(destination_name, 
                                                        minutes_to_station[0],
                                                        minutes_to_station[1],
                                                        minutes_to_station[2])
    return next_trains_message

def main():

    ids = ['bakerloo', 'circle', 'central', 'district', 'hammersmith-city', 'jubilee', 'metropolitan', 'northern', 'piccadilly', 'victoria', 'waterloo-city']
    ids = all_line_ids()
    print(ids)
    test1, test2 = mode_status(ids)
    #next_train = next_trains(data.from_station, data.to_station, 3)
    #print(next_train)
    print(test1)
    print(test2)

if __name__ == '__main__':
    main()