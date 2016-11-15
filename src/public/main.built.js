(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = c3.generate({
	bindto: '#forex_chart',
	data: {
		x: 'x',
		xFormat: '%Y-%m-%d %H:%M:%S',
		mimeType: 'csv',
		url: './chart_data/forex_data_test',
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
"use strict";

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
			url: './chart_data/test_data'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2ZvcmV4LWNoYXJ0LmpzIiwic3JjL3B1YmxpYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjMy5nZW5lcmF0ZSh7XHJcblx0YmluZHRvOiAnI2ZvcmV4X2NoYXJ0JyxcclxuXHRkYXRhOiB7XHJcblx0XHR4OiAneCcsXHJcblx0XHR4Rm9ybWF0OiAnJVktJW0tJWQgJUg6JU06JVMnLFxyXG5cdFx0bWltZVR5cGU6ICdjc3YnLFxyXG5cdFx0dXJsOiAnLi9jaGFydF9kYXRhL2ZvcmV4X2RhdGFfdGVzdCcsXHJcblx0XHRncm91cHM6IFtcclxuXHRcdFx0WydIVUYvVVNEJ11cclxuXHRcdF0sXHJcblx0XHRrZXlzOiB7XHJcblx0XHRcdHhGb3JtYXQ6ICclWS0lbS0lZCAlSDolTTolUydcclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHRheGlzOiB7XHJcblx0XHR5OiB7XHJcblx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0dGV4dDogJ1ByaWNlJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ291dGVyLW1pZGRsZSdcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHg6IHtcclxuXHRcdFx0dHlwZTogJ3RpbWVzZXJpZXMnLFxyXG5cdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdHRleHQ6ICdUaW1lJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ21pZGRsZSdcclxuXHRcdFx0fSxcclxuXHRcdFx0dGljazoge1xyXG5cdFx0XHRcdGZvcm1hdDogJyVIOiVNOiVTJ1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBmb3JleF9jaGFydCA9IHJlcXVpcmUoXCIuL2ZvcmV4LWNoYXJ0XCIpO1xyXG5cclxuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRmb3JleF9jaGFydC56b29tKFtcclxuXHRcdCcyMDE2LTEwLTAyIDE3OjA0OjE3JyxcclxuXHRcdCcyMDE2LTEwLTAyIDE3OjA3OjIxJ1xyXG5cdFx0XSk7XHJcbn0sIDIwMDApO1xyXG5cclxudmFyIGNoYXJ0ID0gYzMuZ2VuZXJhdGUoe1xyXG5cdFx0YmluZHRvOiAnI2NoYXJ0JyxcclxuXHRcdGRhdGE6IHtcclxuXHRcdFx0dXJsOiAnLi9jaGFydF9kYXRhL3Rlc3RfZGF0YSdcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0LypkYXRhOiB7XHJcblx0XHRcdGNvbHVtbnM6IFtcclxuXHRcdFx0WydkYXRhMScsIDMwLCAyMDAsIDEwMCwgNDAwLCAxNTAsIDI1MF0sXHJcblx0XHRcdFsnZGF0YTInLCA1MCwgMjAsIDEwLCA0MCwgMTUsIDI1XVxyXG5cdFx0XHRdLFxyXG5cdFx0XHRheGVzOiB7XHJcblx0XHRcdFx0ZGF0YTI6ICd5MidcclxuXHRcdFx0fSxcclxuXHRcdFx0dHlwZXM6IHtcclxuXHRcdFx0XHRkYXRhMjogJ2JhcidcclxuXHRcdFx0fVxyXG5cdH0sXHJcblx0YXhpczoge1xyXG5cdFx0eDoge1xyXG5cdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdHRleHQ6ICdYIExhYmVsJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ21pZGRsZSdcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHk6IHtcclxuXHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHR0ZXh0OiAnWSBMYWJlbCcsXHJcblx0XHRcdFx0cG9zaXRpb246ICdvdXRlci1taWRkbGUnXHJcblx0XHRcdH0sXHJcblx0XHRcdHRpY2s6IHtcclxuXHRcdFx0XHRmb3JtYXQ6IGQzLmZvcm1hdChcIiQsXCIpXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR5Mjoge1xyXG5cdFx0XHRzaG93OiB0cnVlLFxyXG5cdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdHRleHQ6ICdUZXN0IExhYmVsJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ291dGVyLW1pZGRsZSdcclxuXHRcdFx0fSxcclxuXHRcdFx0dGljazoge1xyXG5cdFx0XHRcdGZvcm1hdDogZDMuZm9ybWF0KFwiJCxcIilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSk7Ki9cclxuXHJcbi8qY2hhcnQubGVnZW5kLnNob3coWydkYXRhMScsICdkYXRhMiddKTtcclxuY2hhcnQubGVnZW5kLnNob3coKTtcclxuXHJcbnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0Y2hhcnQuem9vbShbMSwgNF0pO1xyXG59LCAyMDAwKTsqLyJdfQ==
