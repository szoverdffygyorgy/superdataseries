# superdataseries
To run mongoDB, navigate to MongoDB directory and use the command:
```
	mongod --dbpath="C:\Diploma\userdata"
```

To start influxDB navigate to InfluxDB directory and type the console command:
```
	influxd.exe
```

To run a python service navigate to the folder containing the script and use
the command below:
```
	>> set FLASK_APP=<the script file + extension>
	>> python -m flask run
	or
	>> flask run -h <hostname> -p <port number> // this is seems to be better
```
