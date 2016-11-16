"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	} 

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function(config) {
		config = config || {};

		function createMenuItem(label, url) {
			return {
				label: label,
				url: url,
				click: function {
					location.hash = url;
				}
			}
		}

		var menu = [
			createMenuItem("My Portfolio", "#/profile"),
			createMenuItem("Trade", "#/trade"),
			createMenuItem("Charts", "#/charts")
		];

		var resource = ko.observable(null);
		var symbol = ko.observable(null);
		const var baseRoute = "localhost:8888"

		Sammy(function() {
			this.get("#/profile", function() {
				resource("profile");
				symbol(null);
			});

			this.get("#/trade", function() {
				resource("trade");
				symbol(null);
			});

			this.get("#/charts", function() {
				resource("charts");
				symbol(null);
			});

			this.get("#/charts/:symbol", function() {
				console.log("a chart should be here with: " + symbol);
				symbol(this.params);
			});

			this.get("", function() {
				console.log("Root is okay");
			});	
		}).run();

		return {
			menu: menu,
			resource: resource,
			symbol: symbol
		};
	};
};