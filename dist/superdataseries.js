(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.superdataseries = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = function(dependencies) {
	dependencies = dependencies || {};

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function(config) {
		config = config || {};

		var chart = c3.generate({
			bindto: '#test_chart',
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
			},
			zoom: {
				enabled: true
			}
		});

		var zoomButton = {
			label: "Test Zoom",
			click: function() {
				setTimeout(function() {
					chart.zoom([
						'2016-10-02 17:04:17',
						'2016-10-02 17:07:21']);
				}, 2000);
			}
		};

		return {
			chart: chart,
			zoomButton: zoomButton
		};
	};
};
},{}],2:[function(require,module,exports){
module.exports = '<div>\n	<div id="test_chart"></div>\n	<knob-button params="\n		label: zoomButton.label,\n		click: zoomButton.click">		\n	</knob-button>\n</div>';
},{}],3:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var chartComponentCore = require("./core");

module.exports = chartComponentCore({
	ko: ko
});
},{"./core":1}],4:[function(require,module,exports){
"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory");
	}

	var ko = dependencies.ko;

	return function createLoginSurface(config) {
		config = config || {};

		if(!config) {
			throw new Error("config is mandatory!");
		}

		var userInput = {
			placeholder: "UserName",
			value: ko.observable(null)
		};

		var passwordInput = {
			placeholder: "password",
			value: ko.observable(null)
		};

		var loginButton = {
			label: "Login",
			click: function() {
				console.log(userInput.value() + " attempting to log in with password: " + passwordInput.value());
			}
		};

		return {
			userInput: userInput,
			passwordInput: passwordInput,
			loginButton: loginButton
		};
	};
};
},{}],5:[function(require,module,exports){
module.exports = '<div>\n	<knob-input params="\n		value: userInput.value,\n		placeholder: userInput.placeholder\n	"></knob-input>\n</div>\n<div>\n	<knob-input params="\n		value: passwordInput.value,\n		placeholder: passwordInput.placeholder,\n		type: \'password\'\n	"></knob-input>\n</div>\n<div>\n	<knob-button params="\n		label: loginButton.label,\n		click: loginButton.click\n	"></knob-button>\n</div>';
},{}],6:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var loginSurfaceCore = require("./core");

module.exports = loginSurfaceCore({
	ko: ko
});
},{"./core":4}],7:[function(require,module,exports){
"use strict";

var knob = (window.knob);

function init() {
	knob.registerComponent("login-surface", require("./loginSurface/vm"), require("./loginSurface/template.html"));
	knob.registerComponent("chart-component", require("./chartComponent/vm"), require("./chartComponent/template.html"));
}

module.exports = init;

/*var forex_chart = require("./forex-chart");

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

	data: {
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
},{"./chartComponent/template.html":2,"./chartComponent/vm":3,"./loginSurface/template.html":5,"./loginSurface/vm":6}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q29tcG9uZW50L3RlbXBsYXRlLmh0bWwiLCJzcmMvcHVibGljL2NoYXJ0Q29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2UvY29yZS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL3RlbXBsYXRlLmh0bWwiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS92bS5qcyIsInNyYy9wdWJsaWMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHR2YXIgY2hhcnQgPSBjMy5nZW5lcmF0ZSh7XHJcblx0XHRcdGJpbmR0bzogJyN0ZXN0X2NoYXJ0JyxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHg6ICd4JyxcclxuXHRcdFx0XHR4Rm9ybWF0OiAnJVktJW0tJWQgJUg6JU06JVMnLFxyXG5cdFx0XHRcdG1pbWVUeXBlOiAnY3N2JyxcclxuXHRcdFx0XHR1cmw6ICcuL2NoYXJ0X2RhdGEvZm9yZXhfZGF0YV90ZXN0JyxcclxuXHRcdFx0XHRncm91cHM6IFtcclxuXHRcdFx0XHRcdFsnSFVGL1VTRCddXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRrZXlzOiB7XHJcblx0XHRcdFx0XHR4Rm9ybWF0OiAnJVktJW0tJWQgJUg6JU06JVMnXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSxcclxuXHRcdFx0YXhpczoge1xyXG5cdFx0XHRcdHk6IHtcclxuXHRcdFx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6ICdQcmljZScsXHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiAnb3V0ZXItbWlkZGxlJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0eDoge1xyXG5cdFx0XHRcdFx0dHlwZTogJ3RpbWVzZXJpZXMnLFxyXG5cdFx0XHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogJ1RpbWUnLFxyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogJ21pZGRsZSdcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHR0aWNrOiB7XHJcblx0XHRcdFx0XHRcdGZvcm1hdDogJyVIOiVNOiVTJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0em9vbToge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IHRydWVcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIHpvb21CdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIlRlc3QgWm9vbVwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGNoYXJ0Lnpvb20oW1xyXG5cdFx0XHRcdFx0XHQnMjAxNi0xMC0wMiAxNzowNDoxNycsXHJcblx0XHRcdFx0XHRcdCcyMDE2LTEwLTAyIDE3OjA3OjIxJ10pO1xyXG5cdFx0XHRcdH0sIDIwMDApO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGNoYXJ0OiBjaGFydCxcclxuXHRcdFx0em9vbUJ1dHRvbjogem9vbUJ1dHRvblxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8ZGl2IGlkPVwidGVzdF9jaGFydFwiPjwvZGl2Plxcblx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRsYWJlbDogem9vbUJ1dHRvbi5sYWJlbCxcXG5cdFx0Y2xpY2s6IHpvb21CdXR0b24uY2xpY2tcIj5cdFx0XFxuXHQ8L2tub2ItYnV0dG9uPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNoYXJ0Q29tcG9uZW50Q29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0Q29tcG9uZW50Q29yZSh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRpZighZGVwZW5kZW5jaWVzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnlcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiBjcmVhdGVMb2dpblN1cmZhY2UoY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZykge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdXNlcklucHV0ID0ge1xyXG5cdFx0XHRwbGFjZWhvbGRlcjogXCJVc2VyTmFtZVwiLFxyXG5cdFx0XHR2YWx1ZToga28ub2JzZXJ2YWJsZShudWxsKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgcGFzc3dvcmRJbnB1dCA9IHtcclxuXHRcdFx0cGxhY2Vob2xkZXI6IFwicGFzc3dvcmRcIixcclxuXHRcdFx0dmFsdWU6IGtvLm9ic2VydmFibGUobnVsbClcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGxvZ2luQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJMb2dpblwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2codXNlcklucHV0LnZhbHVlKCkgKyBcIiBhdHRlbXB0aW5nIHRvIGxvZyBpbiB3aXRoIHBhc3N3b3JkOiBcIiArIHBhc3N3b3JkSW5wdXQudmFsdWUoKSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0dXNlcklucHV0OiB1c2VySW5wdXQsXHJcblx0XHRcdHBhc3N3b3JkSW5wdXQ6IHBhc3N3b3JkSW5wdXQsXHJcblx0XHRcdGxvZ2luQnV0dG9uOiBsb2dpbkJ1dHRvblxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJcXG5cdFx0dmFsdWU6IHVzZXJJbnB1dC52YWx1ZSxcXG5cdFx0cGxhY2Vob2xkZXI6IHVzZXJJbnB1dC5wbGFjZWhvbGRlclxcblx0XCI+PC9rbm9iLWlucHV0PlxcbjwvZGl2PlxcbjxkaXY+XFxuXHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJcXG5cdFx0dmFsdWU6IHBhc3N3b3JkSW5wdXQudmFsdWUsXFxuXHRcdHBsYWNlaG9sZGVyOiBwYXNzd29yZElucHV0LnBsYWNlaG9sZGVyLFxcblx0XHR0eXBlOiBcXCdwYXNzd29yZFxcJ1xcblx0XCI+PC9rbm9iLWlucHV0PlxcbjwvZGl2PlxcbjxkaXY+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiBsb2dpbkJ1dHRvbi5sYWJlbCxcXG5cdFx0Y2xpY2s6IGxvZ2luQnV0dG9uLmNsaWNrXFxuXHRcIj48L2tub2ItYnV0dG9uPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGxvZ2luU3VyZmFjZUNvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsb2dpblN1cmZhY2VDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga25vYiA9ICh3aW5kb3cua25vYik7XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJsb2dpbi1zdXJmYWNlXCIsIHJlcXVpcmUoXCIuL2xvZ2luU3VyZmFjZS92bVwiKSwgcmVxdWlyZShcIi4vbG9naW5TdXJmYWNlL3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJjaGFydC1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vY2hhcnRDb21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL2NoYXJ0Q29tcG9uZW50L3RlbXBsYXRlLmh0bWxcIikpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGluaXQ7XHJcblxyXG4vKnZhciBmb3JleF9jaGFydCA9IHJlcXVpcmUoXCIuL2ZvcmV4LWNoYXJ0XCIpO1xyXG5cclxuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRmb3JleF9jaGFydC56b29tKFtcclxuXHRcdCcyMDE2LTEwLTAyIDE3OjA0OjE3JyxcclxuXHRcdCcyMDE2LTEwLTAyIDE3OjA3OjIxJ1xyXG5cdFx0XSk7XHJcbn0sIDIwMDApO1xyXG5cclxudmFyIGNoYXJ0ID0gYzMuZ2VuZXJhdGUoe1xyXG5cdFx0YmluZHRvOiAnI2NoYXJ0JyxcclxuXHRcdGRhdGE6IHtcclxuXHRcdFx0dXJsOiAnLi9jaGFydF9kYXRhL3Rlc3RfZGF0YSdcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0ZGF0YToge1xyXG5cdFx0XHRjb2x1bW5zOiBbXHJcblx0XHRcdFsnZGF0YTEnLCAzMCwgMjAwLCAxMDAsIDQwMCwgMTUwLCAyNTBdLFxyXG5cdFx0XHRbJ2RhdGEyJywgNTAsIDIwLCAxMCwgNDAsIDE1LCAyNV1cclxuXHRcdFx0XSxcclxuXHRcdFx0YXhlczoge1xyXG5cdFx0XHRcdGRhdGEyOiAneTInXHJcblx0XHRcdH0sXHJcblx0XHRcdHR5cGVzOiB7XHJcblx0XHRcdFx0ZGF0YTI6ICdiYXInXHJcblx0XHRcdH1cclxuXHR9LFxyXG5cdGF4aXM6IHtcclxuXHRcdHg6IHtcclxuXHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHR0ZXh0OiAnWCBMYWJlbCcsXHJcblx0XHRcdFx0cG9zaXRpb246ICdtaWRkbGUnXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR5OiB7XHJcblx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0dGV4dDogJ1kgTGFiZWwnLFxyXG5cdFx0XHRcdHBvc2l0aW9uOiAnb3V0ZXItbWlkZGxlJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR0aWNrOiB7XHJcblx0XHRcdFx0Zm9ybWF0OiBkMy5mb3JtYXQoXCIkLFwiKVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0eTI6IHtcclxuXHRcdFx0c2hvdzogdHJ1ZSxcclxuXHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHR0ZXh0OiAnVGVzdCBMYWJlbCcsXHJcblx0XHRcdFx0cG9zaXRpb246ICdvdXRlci1taWRkbGUnXHJcblx0XHRcdH0sXHJcblx0XHRcdHRpY2s6IHtcclxuXHRcdFx0XHRmb3JtYXQ6IGQzLmZvcm1hdChcIiQsXCIpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0pOyovXHJcblxyXG4vKmNoYXJ0LmxlZ2VuZC5zaG93KFsnZGF0YTEnLCAnZGF0YTInXSk7XHJcbmNoYXJ0LmxlZ2VuZC5zaG93KCk7XHJcblxyXG5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdGNoYXJ0Lnpvb20oWzEsIDRdKTtcclxufSwgMjAwMCk7Ki8iXX0=
