from pymongo import MongoClient
import pprint
import pandas as pd
import matplotlib
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")
database = client["users"]
collection = database["datapoints"]

data = {};

for datapoint in collection.find({"seriesName": "HUFUSD"}):
    data[datetime.fromtimestamp(datapoint["timeStamp"])
    .strftime("%Y-%m-%d %H:%M:%S")] = datapoint["price"]

series = pd.Series(data)

window1Series = series.rolling(window = 5)
window2Series = series.rolling(window = 10)

series.plot(style="k")
window1Series.mean().plot(style="r")
window2Series.mean().plot(style="b")

matplotlib.pyplot.show();
