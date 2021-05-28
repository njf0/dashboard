from flask import Flask, render_template
import data

app = Flask(__name__)

@app.route('/')
def all():

    return render_template('home.html')
    
if __name__ == '__main__':
    app.run()