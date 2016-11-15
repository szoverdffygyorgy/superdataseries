"use strict";

var knob = require("knob-js");

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