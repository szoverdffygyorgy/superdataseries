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
		const seriesQueryUrl = "./seriesNames";
		const algorithmQueryUrl = "./algorithmNames";
		const seriesUrl = "dataPoints";
		const runAlgorithm = "./runAlgorithm";

		let symbols = ko.observableArray([]);
		let selectedSymbol = ko.observable(null);

		let algorithms = ko.observableArray([]);
		let selectedAlgorithm = ko.observable(null);

		ko.computed(() => {
			console.log(selectedSymbol())
		})

		let xhr = new XMLHttpRequest();
		xhr.open("GET", seriesQueryUrl);
		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4 && xhr.status === 200) {
				let parsedData = JSON.parse(xhr.responseText);

				parsedData.forEach((series) => {
					symbols.push({
						label: series,
						value: series.toUpperCase()
					});
				});
			}
		}

		xhr.send(null);

		xhr = new XMLHttpRequest();
		xhr.open("GET", algorithmQueryUrl);
		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4 && xhr.status === 200) {
				let parsedData = JSON.parse(xhr.responseText);
				algorithms(parsedData);
			}
		}

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

		var resource = ko.observable(null);
		var symbol = ko.observable(null);
		var user = ko.observable(null);

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
			seriesUrl: seriesUrl
		};
	};
};
