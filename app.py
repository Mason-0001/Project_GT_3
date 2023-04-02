from flask import Flask, render_template, redirect, jsonify
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

@app.route("/api/geojson")
def test():
        # Path to SQLite file
    database_path = "data/tornado_db.sqlite"

    # Creating the SQL database
    engine = create_engine(f"sqlite:///{database_path}")

    # Establisting a connection to our database
    conn = engine.connect()
    
    tornado_df = pd.read_sql("SELECT * from tornado where [year] > 2006", conn)

    response = tornado_df.to_dict(orient="records")

        # Create a GeoJSON FeatureCollection
    features = []
    for tornado in response:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [tornado["starting latitude"], tornado["starting longitude"]]
            },
            "properties": {
                "year": tornado["year"],
                "month": tornado["month"],
                "day": tornado["day"],
                "date": tornado["date"],
                "state": tornado["state"],
                "EFscale": tornado["EF scale"],
                "injuries": tornado["injuries"],
                "fatalities": tornado["fatalities"],
                "property loss $": tornado["property loss $"],
                "crop loss": tornado["crop loss"],
                "slat": tornado["starting latitude"],
                "slon": tornado["starting longitude"],
                "ending latitude": tornado["ending latitude"],
                "ending longitude": tornado["ending longitude"],
                "length in miles": tornado["length in miles"],
                "width in yards": tornado["width in yards"],
            }
        }
        features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    return jsonify(geojson)


@app.route("/api/json")
def statistics():
        # Path to SQLite file
    database_path = "data/tornado_db.sqlite"

    # Creating the SQL database
    engine = create_engine(f"sqlite:///{database_path}")

    # Establisting a connection to our database
    conn = engine.connect()
   
    tornado_df = pd.read_sql("SELECT year, date, injuries, property loss $, EF scale, fatalities, width in yards, length in miles from tornado where [year] > 2006", conn)

    response = tornado_df.to_dict(orient="records")
    return jsonify(response)


@app.route("/api/time")
def timechart():
        # Path to SQLite file
    database_path = "data/tornado_db.sqlite"

    # Creating the SQL database
    engine = create_engine(f"sqlite:///{database_path}")

    # Establisting a connection to our database
    conn = engine.connect()
 
    tornado_df = pd.read_sql("SELECT year as Year, count(EF scale) as Tornados, avg(EF scale) as Magnitude, avg(property loss $) as Loss from tornado where [year] > 2006 group by year order by year", conn)

    response = tornado_df.to_dict(orient="records")
    return jsonify(response)


@app.route("/api/state")
def statechart():
        # Path to SQLite file
    database_path = "data/tornado_db.sqlite"

    # Creating the SQL database
    engine = create_engine(f"sqlite:///{database_path}")

    # Establisting a connection to our database
    conn = engine.connect()

    
    
    tornado_df = pd.read_sql("SELECT year as Year, state as State, count(EF scale) as Tornados, avg(EF scale) as Magnitude, avg(property loss $) as Loss from tornado where [year] >= 2007 group by year, state order by year", conn)

    response = tornado_df.to_dict(orient="records")
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
