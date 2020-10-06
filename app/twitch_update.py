from get_json import get_json

client_id = 'jmdwv418zevx1gyqz77u607z69lw1z'

print(get_json('https://api.twitch.tv/helix/streams/?client_id={}'.format(client_id)))