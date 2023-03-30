from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import csv
import sqlite3
import pandas as pd
from sqlalchemy import create_engine

# import json

app = Flask(__name__)





# web route
@app.route('/')
def home():
    return render_template("index.html")








# API routes

@app.route("/api/test")
def test():
        # Path to SQLite file
    database_path = "data/tornado_db.sqlite"

    # Creating the SQL database
    engine = create_engine(f"sqlite:///{database_path}")

    # Establisting a connection to our database
    conn = engine.connect()

    
    
    tornado_df = pd.read_sql("SELECT date, mag from tornado", conn)[0:10]

    response = tornado_df.to_dict(orient="records")

    return jsonify(response)



if __name__ == '__main__':
    app.run(debug=True)