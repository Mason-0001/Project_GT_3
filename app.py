from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo

# import json

app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_app")

# @app.route('/')


if __name__ == '__main__':
    app.run(debug=True)