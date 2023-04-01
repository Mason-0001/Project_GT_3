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

    
    
    tornado_df = pd.read_sql("SELECT * from tornado where [yr] > 2015", conn)

    response = tornado_df.to_dict(orient="records")

        # Create a GeoJSON FeatureCollection
    features = []
    for tornado in response:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [tornado["elon"], tornado["elat"]]
            },
            "properties": {
                "closs": tornado["closs"],
                "date": tornado["date"],
                "dy": tornado["dy"],
                "elat": tornado["elat"],
                "elon": tornado["elon"],
                "f1": tornado["f1"],
                "f2": tornado["f2"],
                "f3": tornado["f3"],
                "f4": tornado["f4"],
                "fat": tornado["fat"],
                "fc": tornado["fc"],
                "index": tornado["index"],
                "inj": tornado["inj"],
                "len": tornado["len"],
                "loss": tornado["loss"],
                "mag": tornado["mag"],
                "mo": tornado["mo"],
                "ns": tornado["ns"],
                "om": tornado["om"],
                "sg": tornado["sg"],
                "slat": tornado["slat"],
                "slon": tornado["slon"],
                "sn": tornado["sn"],
                "st": tornado["st"],
                "stf": tornado["stf"],
                "stn": tornado["stn"],
                "time": tornado["time"],
                "tz": tornado["tz"],
                "wid": tornado["wid"],
                "yr": tornado["yr"]
            }
        }
        features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    return jsonify(geojson)



if __name__ == '__main__':
    app.run(debug=True)