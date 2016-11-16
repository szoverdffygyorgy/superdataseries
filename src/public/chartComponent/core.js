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
				enabled: true,
				rescale: true
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

		var resetButton = {
			label: "Reset Chart",
			click: function() {
				chart.unzoom();
			}
		}

		return {
			chart: chart,
			resetButton: resetButton,
			zoomButton: zoomButton
		};
	};
};