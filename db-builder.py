import pandas as pd
from sqlalchemy import create_engine

# Path to SQLite file
database_path = "data/tornado_db.sqlite"

# Creating the SQL database
engine = create_engine(f"sqlite:///{database_path}")

# Establisting a connection to our database
conn = engine.connect()



tornado_df = pd.read_csv('data/1950-2021_actual_tornadoes.csv')

tornado_df.to_sql("tornado", conn)








engine.dispose()