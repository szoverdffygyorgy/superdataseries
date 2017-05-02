"use strict";

module.exports = function(dependencies) {
	dependencies = dependencies || {};

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function(config) {
		config = config || {};

		if(!config.baseRoute && typeof config.baseRoute !== "string") {
			throw new Error("config.baseRoute is mandatory and should be a string!");
		}

		if(!config.symbols && typeof config.symbols !== "array") {
			throw new Error("config.symbols is mandatory and should be an array!");
		}

		if(!config.selectedSymbol && typeof config.selectedSymbol !== "function") {
			throw new Error("config.selectedSymbol is mandatory and should be a knockout observable!");
		}

		const dropdownLabel = "Stocks: ";
		const baseRoute = config.baseRoute;
		const seriesQueryUrl = config.seriesQueryUrl;
		let symbols = config.symbols;
		let selectedSymbol = config.selectedSymbol;
		/*var symbols = ko.observableArray([
			{
				label: "Google",
				value: "SYMBOL1"
			},
			{
				label: "Apple",
				value: "SYMBOL2"
			},
			{
				label: "Verzion",
				value: "SYMBOL3"
			}
		]);*/

		var selectedIdx = ko.observable(null);

		var loadChart = {
			label: "Select",
			click: function() {
				location.hash = location.hash + "/" + selectedSymbol().value;
			}
		}

		return {
			dropdownLabel: dropdownLabel,
			symbols: symbols,
			selectedSymbol: selectedSymbol,
			selectedIdx: selectedIdx,
			loadChart: loadChart
		};
	};
};
