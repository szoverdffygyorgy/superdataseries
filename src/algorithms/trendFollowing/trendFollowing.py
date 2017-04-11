import pymongo
import pprint
import pandas
import matplotlib
import numpy
from bson.objectid import ObjectId
from datetime import datetime
from flask import Flask, request, make_response
import json
import math

app = Flask("Trend Following Microservice")

@app.route("/runAlgorithm", methods = ["POST"])
def runAlgorithm():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database = client["users"]
    print(database.collection_names())
    dataPoints = database["datapoints"]
    users = database["users"]


    for key in list(request.__dict__["environ"]["werkzeug.request"].__dict__):
        print(key, request.__dict__["environ"]["werkzeug.request"].__dict__[key])

    print(request.get_data())

    userName = request.form["user"]
    seriesName = request.form["series"]
    window1 = int(request.form["window1"])
    window2 = int(request.form["window2"])
    print(userName)
    print(seriesName)
    print(window1)
    print(window2)

    user = users.find_one({"userName": userName})
    user["_id"] = str(user["_id"])
    #for (attr, value) in user.items():
    #    print(attr, value)
    #print(json.dumps(user))
    data = {}

    for datapoint in dataPoints.find({"seriesName": seriesName}):
        data[datetime.fromtimestamp(datapoint["timeStamp"])
        .strftime("%Y-%m-%d %H:%M:%S")] = datapoint["price"]

    series = pandas.Series(data)

    #window1 = 5
    #window2 = 10

    if window2 < window2:
        temp = window1
        window1 = window2
        window2 = temp

    window1Series = series.rolling(window = int(window1))
    window2Series = series.rolling(window = int(window2))

    series1 = window1Series.mean();
    series2 = window2Series.mean();

    series.plot(style="k")
    series1.plot(style="r")
    series2.plot(style="b")

    matplotlib.pyplot.show()

    #for (attr, value) in window1Series.obj.__dict__.items():
    #    print(attr, value)
    #series1 = pandas.Series(window1Series)
    #series2 = pandas.Series(window2Series)
    #pandas.Series.asobject.tolist()

    #pprint.pprint(window1Series.obj)

    #user = {
    #    "balance": 10000,
    #    "numOfStocks": 0
    #}
    series = list(series.iteritems())
    series1 = list(series1.iteritems())
    series2 = list(series2.iteritems())

    #print(window1)
    #print(series1)
    #print(window2)
    #print(series2)
    prev = False
    if series1[window2 - 1] > series2[window2 - 1]:
        prev = True

    if str(seriesName) not in user["portfolio"]:
        user["portfolio"][str(seriesName)] = 0

    for i in range(window2, len(series)):
        if series1[i][1] > series2[i][1] and prev is False:
            print("BUYING")
            print(json.dumps(user))
            user["portfolio"][str(seriesName)] += math.floor(user["balance"] / series[i][1])
            user["balance"] -= user["portfolio"][str(seriesName)] * series[i][1]
            prev = True
            print(json.dumps(user))

        if series2[i][1] > series1[i][1] and prev is True:
            print("SELLING")
            print(json.dumps(user))
            user["balance"] += user["portfolio"][str(seriesName)] * series[i][1]
            user["portfolio"][str(seriesName)] = 0
            prev = False
            print(json.dumps(user))

        users.update_one(
        {
            "_id": ObjectId(user["_id"])
        },{
            "$set": {
                "portfolio": user["portfolio"],
                "balance": user["balance"]
            }
        })

    return make_response(json.dumps(user), 200)


    #return make_response(json.dumps({
    #    "window1": series1,
    #    "window2": series2
    #}), 200)
