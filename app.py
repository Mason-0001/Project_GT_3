from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import csv
import sqlite3

# import json

app = Flask(__name__)

# Use PyMongo to establish Mongo connection
#mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_app")

conn = sqlite3.connect('tonados.db')
cur = conn.cursor()
cur.execute("""DROP TABLE IF EXISTS tornado""")
cur.execute("""CREATE TABLE tornado(
    tornado_num INT NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    day INT NOT NULL,
    date date NOT NULL,
    time datetime NOT NULL,
    time_zone INT NOT NULL,
    state VARCHAR(30) NOT NULL,
    state_fpis INT NOT NULL,
    station_num INT ,
    EF_scale INT NOT NULL,
    fatalities INT NOT NULL,
    injuries INT NOT NULL,
    property_loss INT NOT NULL,
    crop_loss INT NOT NULL,
    start_lat INT NOT NULL,
    start_lon INT NOT NULL,
    end_lat INT NOT NULL,
    end_lon INT NOT NULL,
    length INT NOT NULL,
    width INT NOT NULL,
    states_affected INT NOT NULL,
    state_tracking_num INT NOT NULL,
    segment_num INT NOT NULL,
    county1_fpis_code INT NOT NULL,
    county2_fpis_code INT NOT NULL,
    county3_fpis_code INT NOT NULL,
    county4_fpis_code INT NOT NULL,
    fc INT county1_fpis_code INT NOT NULL)""")

with open('data/1950-2021_actual_tornadoes.csv', 'r') as f:
    reader = csv.reader(f.readlines()[1:])  # exclude header line
    cur.executemany("""INSERT INTO tornado VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                    (row for row in reader))
conn.commit()
conn.close()
# @app.route('/')






if __name__ == '__main__':
    app.run(debug=True)