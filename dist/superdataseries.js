(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = function(dependencies) {
	dependencies = dependencies || {};

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

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

var knob = (window.knob);

function init() {
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
},{"./chartComponent/template.html":2,"./chartComponent/vm":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q29tcG9uZW50L3RlbXBsYXRlLmh0bWwiLCJzcmMvcHVibGljL2NoYXJ0Q29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0dmFyIGNoYXJ0ID0gYzMuZ2VuZXJhdGUoe1xyXG5cdFx0XHRiaW5kdG86ICcjdGVzdF9jaGFydCcsXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHR4OiAneCcsXHJcblx0XHRcdFx0eEZvcm1hdDogJyVZLSVtLSVkICVIOiVNOiVTJyxcclxuXHRcdFx0XHRtaW1lVHlwZTogJ2NzdicsXHJcblx0XHRcdFx0dXJsOiAnLi9jaGFydF9kYXRhL2ZvcmV4X2RhdGFfdGVzdCcsXHJcblx0XHRcdFx0Z3JvdXBzOiBbXHJcblx0XHRcdFx0XHRbJ0hVRi9VU0QnXVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0a2V5czoge1xyXG5cdFx0XHRcdFx0eEZvcm1hdDogJyVZLSVtLSVkICVIOiVNOiVTJ1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdGF4aXM6IHtcclxuXHRcdFx0XHR5OiB7XHJcblx0XHRcdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiAnUHJpY2UnLFxyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogJ291dGVyLW1pZGRsZSdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHg6IHtcclxuXHRcdFx0XHRcdHR5cGU6ICd0aW1lc2VyaWVzJyxcclxuXHRcdFx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6ICdUaW1lJyxcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdtaWRkbGUnXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0dGljazoge1xyXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICclSDolTTolUydcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciB6b29tQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJUZXN0IFpvb21cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRjaGFydC56b29tKFtcclxuXHRcdFx0XHRcdFx0JzIwMTYtMTAtMDIgMTc6MDQ6MTcnLFxyXG5cdFx0XHRcdFx0XHQnMjAxNi0xMC0wMiAxNzowNzoyMSddKTtcclxuXHRcdFx0XHR9LCAyMDAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRjaGFydDogY2hhcnQsXHJcblx0XHRcdHpvb21CdXR0b246IHpvb21CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGRpdiBpZD1cInRlc3RfY2hhcnRcIj48L2Rpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHpvb21CdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiB6b29tQnV0dG9uLmNsaWNrXCI+XHRcdFxcblx0PC9rbm9iLWJ1dHRvbj5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBjaGFydENvbXBvbmVudENvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydENvbXBvbmVudENvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbm9iID0gKHdpbmRvdy5rbm9iKTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImNoYXJ0LWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi9jaGFydENvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vY2hhcnRDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5pdDtcclxuXHJcbi8qdmFyIGZvcmV4X2NoYXJ0ID0gcmVxdWlyZShcIi4vZm9yZXgtY2hhcnRcIik7XHJcblxyXG5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdGZvcmV4X2NoYXJ0Lnpvb20oW1xyXG5cdFx0JzIwMTYtMTAtMDIgMTc6MDQ6MTcnLFxyXG5cdFx0JzIwMTYtMTAtMDIgMTc6MDc6MjEnXHJcblx0XHRdKTtcclxufSwgMjAwMCk7XHJcblxyXG52YXIgY2hhcnQgPSBjMy5nZW5lcmF0ZSh7XHJcblx0XHRiaW5kdG86ICcjY2hhcnQnLFxyXG5cdFx0ZGF0YToge1xyXG5cdFx0XHR1cmw6ICcuL2NoYXJ0X2RhdGEvdGVzdF9kYXRhJ1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRkYXRhOiB7XHJcblx0XHRcdGNvbHVtbnM6IFtcclxuXHRcdFx0WydkYXRhMScsIDMwLCAyMDAsIDEwMCwgNDAwLCAxNTAsIDI1MF0sXHJcblx0XHRcdFsnZGF0YTInLCA1MCwgMjAsIDEwLCA0MCwgMTUsIDI1XVxyXG5cdFx0XHRdLFxyXG5cdFx0XHRheGVzOiB7XHJcblx0XHRcdFx0ZGF0YTI6ICd5MidcclxuXHRcdFx0fSxcclxuXHRcdFx0dHlwZXM6IHtcclxuXHRcdFx0XHRkYXRhMjogJ2JhcidcclxuXHRcdFx0fVxyXG5cdH0sXHJcblx0YXhpczoge1xyXG5cdFx0eDoge1xyXG5cdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdHRleHQ6ICdYIExhYmVsJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ21pZGRsZSdcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHk6IHtcclxuXHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHR0ZXh0OiAnWSBMYWJlbCcsXHJcblx0XHRcdFx0cG9zaXRpb246ICdvdXRlci1taWRkbGUnXHJcblx0XHRcdH0sXHJcblx0XHRcdHRpY2s6IHtcclxuXHRcdFx0XHRmb3JtYXQ6IGQzLmZvcm1hdChcIiQsXCIpXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR5Mjoge1xyXG5cdFx0XHRzaG93OiB0cnVlLFxyXG5cdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdHRleHQ6ICdUZXN0IExhYmVsJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ291dGVyLW1pZGRsZSdcclxuXHRcdFx0fSxcclxuXHRcdFx0dGljazoge1xyXG5cdFx0XHRcdGZvcm1hdDogZDMuZm9ybWF0KFwiJCxcIilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSk7Ki9cclxuXHJcbi8qY2hhcnQubGVnZW5kLnNob3coWydkYXRhMScsICdkYXRhMiddKTtcclxuY2hhcnQubGVnZW5kLnNob3coKTtcclxuXHJcbnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0Y2hhcnQuem9vbShbMSwgNF0pO1xyXG59LCAyMDAwKTsqLyJdfQ==
