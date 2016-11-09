(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = c3.generate({
	bindto: '#forex_chart',
	data: {
		x: 'x',
		xFormat: '%Y-%m-%d %H:%M:%S',
		mimeType: 'csv',
		url: './forex_data_test',
		groups: [
			['HUF/USD']
		],
		keys: {
			xFormat: '%Y-%m-%d %H:%M:%S'
		}

	},
	axis: {
		y: {
			label: {
				text: 'Price',
				position: 'outer-middle'
			}
		},
		x: {
			type: 'timeseries',
			label: {
				text: 'Time',
				position: 'middle'
			},
			tick: {
				format: '%H:%M:%S'
			}
		}
	}
});
},{}],2:[function(require,module,exports){
var forex_chart = require("./forex-chart");

setTimeout(function() {
	forex_chart.zoom([
		'2016-10-02 17:04:17',
		'2016-10-02 17:07:21'
		]);
}, 2000);

var chart = c3.generate({
		bindto: '#chart',
		data: {
			url: './test_data'
		}
	});

	/*data: {
			columns: [
			['data1', 30, 200, 100, 400, 150, 250],
			['data2', 50, 20, 10, 40, 15, 25]
			],
			axes: {
				data2: 'y2'
			},
			types: {
				data2: 'bar'
			}
	},
	axis: {
		x: {
			label: {
				text: 'X Label',
				position: 'middle'
			}
		},
		y: {
			label: {
				text: 'Y Label',
				position: 'outer-middle'
			},
			tick: {
				format: d3.format("$,")
			}
		},
		y2: {
			show: true,
			label: {
				text: 'Test Label',
				position: 'outer-middle'
			},
			tick: {
				format: d3.format("$,")
			}
		}
	}
});*/

/*chart.legend.show(['data1', 'data2']);
chart.legend.show();

setTimeout(function() {
	chart.zoom([1, 4]);
}, 2000);*/
},{"./forex-chart":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2ZvcmV4LWNoYXJ0LmpzIiwic3JjL3B1YmxpYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGMzLmdlbmVyYXRlKHtcclxuXHRiaW5kdG86ICcjZm9yZXhfY2hhcnQnLFxyXG5cdGRhdGE6IHtcclxuXHRcdHg6ICd4JyxcclxuXHRcdHhGb3JtYXQ6ICclWS0lbS0lZCAlSDolTTolUycsXHJcblx0XHRtaW1lVHlwZTogJ2NzdicsXHJcblx0XHR1cmw6ICcuL2ZvcmV4X2RhdGFfdGVzdCcsXHJcblx0XHRncm91cHM6IFtcclxuXHRcdFx0WydIVUYvVVNEJ11cclxuXHRcdF0sXHJcblx0XHRrZXlzOiB7XHJcblx0XHRcdHhGb3JtYXQ6ICclWS0lbS0lZCAlSDolTTolUydcclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHRheGlzOiB7XHJcblx0XHR5OiB7XHJcblx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0dGV4dDogJ1ByaWNlJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ291dGVyLW1pZGRsZSdcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHg6IHtcclxuXHRcdFx0dHlwZTogJ3RpbWVzZXJpZXMnLFxyXG5cdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdHRleHQ6ICdUaW1lJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ21pZGRsZSdcclxuXHRcdFx0fSxcclxuXHRcdFx0dGljazoge1xyXG5cdFx0XHRcdGZvcm1hdDogJyVIOiVNOiVTJ1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59KTsiLCJ2YXIgZm9yZXhfY2hhcnQgPSByZXF1aXJlKFwiLi9mb3JleC1jaGFydFwiKTtcclxuXHJcbnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0Zm9yZXhfY2hhcnQuem9vbShbXHJcblx0XHQnMjAxNi0xMC0wMiAxNzowNDoxNycsXHJcblx0XHQnMjAxNi0xMC0wMiAxNzowNzoyMSdcclxuXHRcdF0pO1xyXG59LCAyMDAwKTtcclxuXHJcbnZhciBjaGFydCA9IGMzLmdlbmVyYXRlKHtcclxuXHRcdGJpbmR0bzogJyNjaGFydCcsXHJcblx0XHRkYXRhOiB7XHJcblx0XHRcdHVybDogJy4vdGVzdF9kYXRhJ1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQvKmRhdGE6IHtcclxuXHRcdFx0Y29sdW1uczogW1xyXG5cdFx0XHRbJ2RhdGExJywgMzAsIDIwMCwgMTAwLCA0MDAsIDE1MCwgMjUwXSxcclxuXHRcdFx0WydkYXRhMicsIDUwLCAyMCwgMTAsIDQwLCAxNSwgMjVdXHJcblx0XHRcdF0sXHJcblx0XHRcdGF4ZXM6IHtcclxuXHRcdFx0XHRkYXRhMjogJ3kyJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR0eXBlczoge1xyXG5cdFx0XHRcdGRhdGEyOiAnYmFyJ1xyXG5cdFx0XHR9XHJcblx0fSxcclxuXHRheGlzOiB7XHJcblx0XHR4OiB7XHJcblx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0dGV4dDogJ1ggTGFiZWwnLFxyXG5cdFx0XHRcdHBvc2l0aW9uOiAnbWlkZGxlJ1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0eToge1xyXG5cdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdHRleHQ6ICdZIExhYmVsJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ291dGVyLW1pZGRsZSdcclxuXHRcdFx0fSxcclxuXHRcdFx0dGljazoge1xyXG5cdFx0XHRcdGZvcm1hdDogZDMuZm9ybWF0KFwiJCxcIilcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHkyOiB7XHJcblx0XHRcdHNob3c6IHRydWUsXHJcblx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0dGV4dDogJ1Rlc3QgTGFiZWwnLFxyXG5cdFx0XHRcdHBvc2l0aW9uOiAnb3V0ZXItbWlkZGxlJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR0aWNrOiB7XHJcblx0XHRcdFx0Zm9ybWF0OiBkMy5mb3JtYXQoXCIkLFwiKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59KTsqL1xyXG5cclxuLypjaGFydC5sZWdlbmQuc2hvdyhbJ2RhdGExJywgJ2RhdGEyJ10pO1xyXG5jaGFydC5sZWdlbmQuc2hvdygpO1xyXG5cclxuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRjaGFydC56b29tKFsxLCA0XSk7XHJcbn0sIDIwMDApOyovIl19
