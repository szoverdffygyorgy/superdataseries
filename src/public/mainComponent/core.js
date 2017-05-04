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

		const baseRoute = "localhost:8888";
		const seriesQueryUrl = "/seriesNames";
		const algorithmQueryUrl = "./algorithmNames";
		const seriesUrl = "dataPoints";
		const runAlgorithm = "./runAlgorithm";
		const tradingHistoryQueryUrl = "./tradingHistory/";

		let symbols = {
			chartChooser: ko.observableArray([]),
			traderComponent: ko.observableArray([])
		};
		let selectedSymbol = ko.observable(null);
		let selectedAlgorithm = ko.observable(null);

	 	let errorMessage = ko.observable(null);

		let resource = ko.observable(null);
		let symbol = ko.observable(null);
		let user = ko.observable(null);

		let tradingHistory = ko.observableArray([]);

		let getSeries = new XMLHttpRequest();
		getSeries.open("GET", seriesQueryUrl, true);
		getSeries.onreadystatechange = () => {
			if(getSeries.readyState === 4/* && getSeries.status == 200*/) {
				let responseObject = JSON.parse(getSeries.responseText);

				if(!responseObject.ok) {
					errorMessage(responseObject.error);
				} else {
					errorMessage(null);
					JSON.parse(responseObject.result).forEach((series) => {
						symbols.chartChooser.push({
							label: series,
							value: series.toUpperCase()
						});
						symbols.traderComponent.push({
							label: series,
							value: series.toUpperCase()
						});
					});
				}

				console.log(symbols.chartChooser());
				console.log(symbols.traderComponent());
			}
		}

		getSeries.send(null);

		let algorithms = ko.observableArray([]);

		let getAlgorithms = new XMLHttpRequest();
		getAlgorithms.open("GET", algorithmQueryUrl, true);
		getAlgorithms.onreadystatechange = () => {
			if(getAlgorithms.readyState == 4/* && getAlgorithms.status == 200*/) {
				let responseObject = JSON.parse(getAlgorithms.responseText);

				if(!responseObject.ok) {
					errorMessage(responseObject.error);
				} else {
					errorMessage(null);
					algorithms(responseObject.result);
				}
			}
		}

		getAlgorithms.send(null);

		function createMenuItem(label, url) {
			return {
				label: label,
				url: url,
				visible: ko.observable(true),
				click: function() {
					if(user() === null) {
						location.hash = "#/login";
					} else if(user() !== null && label === "My Portfolio") {
						url = "#/users/" + user().userName;
						location.hash = url;
					} else {
						location.hash = url;
					}
				}
			}
		}

		var menu = [
			createMenuItem("Login", "#/login"),
			{
				label: "Logout",
				url: "#/login",
				visible: ko.observable(false),
				click: function() {
					user(null);
					menu[0].visible(true);
					menu[1].visible(false);
					location.hash = "#/login";
				}
			},
			createMenuItem("My Portfolio", "#/users/:profileId"), //think about solution for logged in profiles
			createMenuItem("Trade", "#/trade"),
			createMenuItem("Charts", "#/charts")
		];

		Sammy(function() {
			this.get("#/login", function() {
				resource("login");
				symbol(null);
				console.log(resource());
			});

			this.get("#/users/:profileId", function() {
				resource("profile");
				symbol(null);
				console.log(resource());
			});

			this.get("#/trade", function() {
				resource("trade");
				symbol(null);
				console.log(resource());
			});

			this.get("#/charts", function() {
				resource("charts");
				symbol(null);
				console.log(resource());
			});

			this.get("#/charts/:symbol", function() {
				symbol(this.params.symbol);
				console.log("a chart should be here with: " + symbol());
			});

			this.get("", function() {
				console.log("Root lol");
			});
		}).run();

		return {
			menu: menu,
			resource: resource,
			symbol: symbol,
			selectedSymbol: selectedSymbol,
			symbols: symbols,
			baseRoute: baseRoute,
			user: user,
			seriesQueryUrl: seriesQueryUrl,
			seriesUrl: seriesUrl,
			tradingHistory: tradingHistory,
			tradingHistoryQueryUrl: tradingHistoryQueryUrl,
			errorMessage: errorMessage
		};
	};
};
