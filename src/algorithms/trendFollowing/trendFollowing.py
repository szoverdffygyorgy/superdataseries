from pymongo import MongoClient
import pprint
import pandas as pd
import matplotlib
from datetime import datetime
from flask import Flask, request, make_response
import json

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

    series1 = window1Series.mean();
    series2 = window2Series.mean();

    series.plot(style="k")
    series1.plot(style="r")
    series2.plot(style="b")

    matplotlib.pyplot.show()

    #for (attr, value) in window1Series.obj.__dict__.items():
    #    print(attr, value)
    #series1 = pd.Series(window1Series)
    #series2 = pd.Series(window2Series)
    #pandas.Series.asobject.tolist()

    #pprint.pprint(window1Series.obj)
    series1 = list(series1.iteritems())
    series2 = list(series2.iteritems())

    return make_response(json.dumps({
        "window1": series1,
        "window2": series2
    }), 200)
