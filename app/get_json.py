import requests

def get_json(url):
    '''
    Gets json output from API url
    '''
    # Sometimes req.json() returns an error, this sequence repeats until it works
    json_result = None
    while json_result is None:
        try:
            req = requests.get(url)
            json_result = req.json()
        except:
            pass
    return json_result