var express = require('express');
var fs = require('fs');

var app = express();

app.use(express.static('public'));


app.get('/test_data', function(req, res) {
	readContent('./data/csv_test.csv', function(err, content) {
    	if(err) {
    		throw err;
    	}

    	res.send(content);
	});
});

app.get('/forex_data_test', function(req, res) {
	readContent('./data/test_data.csv', function(err, content) {
		if(err) {
			throw err;
		}

		res.send(content);
	});
});

app.listen(8888, function(){
	console.log('Server is running on port 8888');
});

function readContent(filePath, callback) {
    fs.readFile(filePath, 'utf-8', function (err, content) {
        if (err) {
        	return callback(err);
        }

        callback(null, content);
    });
}