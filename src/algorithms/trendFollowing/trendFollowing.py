from pymongo import MongoClient
import pprint
import pandas as pd
import matplotlib
from datetime import datetime
from flask import Flask, request, make_response

app = Flask("Trend Following Microservice")

@app.route("/runAlgorithm", methods = ["POST"])
def runAlgorithm():
    client = MongoClient("mongodb://localhost:27017/")
    database = client["users"]
    collection = database["datapoints"]

    data = {}

    for datapoint in collection.find({"seriesName": "HUFUSD"}):
        data[datetime.fromtimestamp(datapoint["timeStamp"])
        .strftime("%Y-%m-%d %H:%M:%S")] = datapoint["price"]

    series = pd.Series(data)

    window1Series = series.rolling(window = int(request.form["window1"]))
    window2Series = series.rolling(window = int(request.form["window2"]))

    series.plot(style="k")
    window1Series.mean().plot(style="r")
    window2Series.mean().plot(style="b")

    matplotlib.pyplot.show()

    series1 = pd.Series(window1Series)
    series2 = pd.Series(window2Series)

    print(series)
    return make_response("Success", 200)
