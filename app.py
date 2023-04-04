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
    return render_template("map.html")






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
                "propertyloss": tornado["property loss $"],
                "crop loss": tornado["crop loss"],
                "slat": tornado["starting latitude"],
                "slon": tornado["starting longitude"],
                "elatitude": tornado["ending latitude"],
                "elongitude": tornado["ending longitude"],
                "lmiles": tornado["length in miles"],
                "wyards": tornado["width in yards"],
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