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

app = Flask("Mean Reversion Microservice")

@app.route("/runAlgorithm", methods = ["POST"])
def runAlgorithm():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database = client["users"]
    print(database.collection_names())
    dataPoints = database["datapoints"]
    users = database["users"]
    tradingHistories = database["trading histories"]

    print(json.dumps(request.form))

    userName = request.form["user"]
    seriesName = request.form["series"]
    window = int(request.form["window"])

    #userName = "user1"
    #seriesName = "HUFUSD"
    #window = 5

    user = users.find_one({"userName": userName})
    user["_id"] = str(user["_id"])

    data = {}

    for datapoint in dataPoints.find({"seriesName": seriesName}):
        data[datetime.fromtimestamp(datapoint["timeStamp"])
        .strftime("%Y-%m-%d %H:%M:%S")] = datapoint["price"]

    series = pandas.Series(data)

    windowSeries = series.rolling(window = int(window))

    meanSeries = windowSeries.mean()
    deviationSeries = windowSeries.std()
    #deviationSeriesDict = {}

    seriesList = list(series.iteritems())
    meanSeriesList = list(meanSeries.iteritems())
    deviationSeriesDict = dict(deviationSeries.iteritems())

    #for index in range(len(meanSeries)):
    #    if numpy.isnan(meanSeriesList[index][1]):
    #        deviationSeriesDict[meanSeriesList[index][0]] = numpy.nan
    #
    #    deviationSeriesDict[meanSeriesList[index][0]] = abs(seriesList[index][1]
    #    - meanSeriesList[index][1])

    upperBound = {}
    lowerBound = {}

    #print(deviationSeriesDict)

    for index in range(len(meanSeriesList)):
        if numpy.isnan(deviationSeriesDict[meanSeriesList[index][0]]):
            upperBound[meanSeriesList[index][0]] = numpy.nan
            lowerBound[meanSeriesList[index][0]] = numpy.nan

        upperBound[meanSeriesList[index][0]] = meanSeriesList[index][1] + (deviationSeriesDict[meanSeriesList[index][0]] * 2)
        lowerBound[meanSeriesList[index][0]] = meanSeriesList[index][1] - (deviationSeriesDict[meanSeriesList[index][0]] * 2)

    upperBoundSeries = pandas.Series(upperBound)
    lowerBoundSeries = pandas.Series(lowerBound)

    print(seriesList)
    #print(upperBound)
    #print(lowerBound)

    #meanSeries = windowSeries.mean()

    series.plot(style = "k")
    meanSeries.plot(style = "b")
    upperBoundSeries.plot(style = "r")
    lowerBoundSeries.plot(style = "g")

    matplotlib.pyplot.show()

    for index in range(window, len(series)):
        if seriesList[index][1] > upperBound[seriesList[index][0]]:
            print("SELLING")
            tradingHistories.insert_one({
                "user": user,
                "series": seriesName,
                "price": seriesList[i][1],
                "amountOfInstrument": user["portfolio"][str(seriesName)],
                "transactionType": "sell"
            })
            user["balance"] += user["portfolio"][str(seriesName)] * seriesList[i][1]
            user["portfolio"][str(seriesName)] = 0
            print(json.dumps(user))

        if seriesList[index][1] < lowerBound[seriesList[index][0]]:
            print("BUYING")
            ableToBuy = math.floor(user["balance"] / seriesList[index][1])
            user["portfolio"][str(seriesName)] += math.floor(user["balance"] / series[i][1])
            user["balance"] -= ableToBuy * seriesList[i][1]
            tradingHistories.insert_one({
                "user": user,
                "series": seriesName,
                "price": seriesList[index][1],
                "amountOfInstrument": ableToBuy,
                "transactionType": "buy"
            })
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

#runAlgorithm()
