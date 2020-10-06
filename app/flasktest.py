from flask import Flask, render_template
import data
import train_update
import weather_update
import isis_update

app = Flask(__name__)

line_ids = ['bakerloo', 'circle','central',  'district', 'hammersmith-city', 'jubilee', 'metropolitan', 'northern', 'piccadilly', 'victoria', 'waterloo-city']
weather_url = 'https://api.darksky.net/forecast/8bd8d54b4b0561468f1f52090d22bc45/51.68186,-1.40617/?units=uk2'

@app.route('/')
def all():

    return render_template('home.html')
    
if __name__ == '__main__':
    app.run()