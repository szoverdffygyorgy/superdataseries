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

		function createMenuItem(label, url) {
			return {
				label: label,
				url: url,
				click: function() {
					console.log(menu());
					location.hash = url;
				}
			}
		}

		function updateProfieButton(profileButton, userName) {
			console.log(userName, "!!!!!!!44");
			profileButton.url = "#/users/" + userName;
		}

		var menu = ko.observableArray([
			createMenuItem("Login", "#/login"),
			createMenuItem("My Portfolio", "#/users/:profileId"), //think about solution for logged in profiles
			createMenuItem("Trade", "#/trade"),
			createMenuItem("Charts", "#/charts")
		]);

		var resource = ko.observable(null);
		var symbol = ko.observable(null);
		var user = ko.observable(null);

		ko.computed(function() {
			if(user() !== null) {
				console.log("TRIGGERED");
				menu()[1].url = updateProfieButton(menu()[1], user().userName);
				console.log(menu());
			}
		});

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
			baseRoute: baseRoute,
			user: user
		};
	};
};