import pandas as pd
from sqlalchemy import create_engine

# Path to SQLite file
database_path = "data/tornado_db.sqlite"

# Creating the SQL database
engine = create_engine(f"sqlite:///{database_path}")

# Establisting a connection to our database
conn = engine.connect()

tornado_df = pd.read_csv('data/1950-2021_actual_tornadoes.csv')

tornado_clean = tornado_df[['yr', 'mo', 'dy', 'date', 'time', 'st', 'mag', 'inj', 'fat', 'loss', 'closs', 'slat', 'slon', 
                            'elat', 'elon', 'len', 'wid']]

tornado_clean = tornado_clean[tornado_clean['yr'] >= 2007] 

tornado_clean = tornado_clean[tornado_clean['mag'] != -9] 

tornado_clean.columns = ['year', 'month', 'day', 'date', 'time', 'state', 'EF scale', 'injuries', 'fatalities', 'property loss $M', 'crop loss', 'starting latitude', 'starting longitude', 
                         'ending latitude', 'ending longitude', 'length in miles', 'width in yards']

tornado_clean.to_sql("tornado", conn)







engine.dispose()


