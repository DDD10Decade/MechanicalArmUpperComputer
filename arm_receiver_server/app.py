from flask import Flask, request
import json
import time

from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# @app.route('/')
# def hello_world():  # put application's code here
#     return 'Hello World!'


if __name__ == '__main__':
    app.run()
