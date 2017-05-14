"use strict";

module.exports = function(dependencies) {
	dependencies = dependencies || {};

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	if(dependencies.c3) {
		var c3 = dependencies.c3;
	}

	var ko = dependencies.ko;

	return function(config) {
		config = config || {};

		if(!config.seriesUrl || typeof config.seriesUrl !== "string") {
			throw new Error("config.seriesUrl is mandatory and should be a string!");
		}

		if(!config.divId || typeof config.divId !== "string") {
			throw new Error("config.divId is mandatory and should be a string!");
		}

		if(!config.baseRoute || typeof config.baseRoute !== "string") {
			throw new Error("config.baseRoute is mandatory and should be a string!");
		}

		if(!config.selectedSymbol || typeof config.selectedSymbol !== "function") {
			throw new Error("config.selectedSymbol is mandatory and should be a knockout observable!");
		}

		//var chartUrl = config.url;
		var selectedSymbol = config.selectedSymbol;
		var divId = config.divId;
		var seriesUrl = config.seriesUrl;
		var baseRoute = config.baseRoute;

		var chartUrl = "./" + seriesUrl + "/" + selectedSymbol().label();

		var chart = c3.generate({
			bindto: "#" + divId,
			data: {
				//x: "testSeries",
				//xFormat: "%Y-%m-%d %H:%M:%S",
				url: chartUrl,
				mimeType: "json",
				/*groups: [
					["HUF/USD"]
				],*/
				keys: {
					x: "time",
					value: [selectedSymbol().label()]
					//xFormat: "%Y-%m-%d %H:%M:%S"
				}

			},
			axis: {
				y: {
					label: {
						text: "Price",
						position: "outer-middle"
					}
				},
				x: {
					type: "timeseries",
					label: {
						text: "Time",
						position: "middle"
					},
					tick: {
						format: "%Y-%m-%d %H:%M:%S", //"%M:%S",
						culling: {
							max: 7
						}
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
						"2016-10-02 17:04:17",
						"2016-10-02 17:07:21"]);
				}, 2000);
				//chart.load(chartUrl);
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
			divId: divId,
			resetButton: resetButton,
			zoomButton: zoomButton
		};
	};
};
