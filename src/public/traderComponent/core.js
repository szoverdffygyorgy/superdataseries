"use strict";

module.exports = function(dependencies) {
	dependencies = dependencies || {};

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function(config) {
		config = config || {};

		if(!config.user && typeof config.user !== "function") {
			throw new Error("config.user is mandatory and should be a knockout observable!");
		}

		if(!config.symbols && typeof config.symbols !== "array") {
			throw new Error("config.symbols is mandatory and should be an array!");
		}

		var user = config.user;
		var symbols = config.symbols;

		const header = "Trade";
		const symbolLabel = "Symbol ";
		const transactionLabel = "Transaction ";
		const transactionQuantity = "Quantity ";

		var symbolsDropdown = {
			selectedSymbol: ko.observable(null),
			selectedSymbolIdx: ko.observable(null),
			symbols: symbols
		};

		var quantity = ko.observable(0);

		var optionsDropdown = {
			selectedOption: ko.observable(null),
			selectedOptionIdx: ko.observable(null),
			options : ko.observableArray([
				{
					label: "Buy",
					value: "buy"
				},
				{
					label: "Sell",
					value: "sell"
				}
			])
		};

		var transactionButton = {
			label: "Make transaction",
			click: function() {
				console.log("Attempting to " + optionsDropdown.selectedOption().value +
				 " " + quantity() + " stocks" +
				 " from " + symbolsDropdown.selectedSymbol().label() + " with the symbol: " +
				  symbolsDropdown.selectedSymbol().value);

				var post = new XMLHttpRequest();
				 post.open("POST", "./transaction", true);

				 post.onreadystatechange = function() {
				 	if(post.readyState == 4, post.status == 200) {
						let responseObject = JSON.parse(post.responseText);

						if(!responseObject.ok) {
							console.log(responseObject.error);
						} else {
							user(responseObject.result);
						}
				 	}
				 }

				 post.setRequestHeader("Content-type", "application/json");
				 post.send(JSON.stringify({
					 user: user().userName,
					 transactionType: optionsDropdown.selectedOption().value,
					 quantity: quantity(),
					 seriesName: symbolsDropdown.selectedSymbol().label()
				 }));
			}
		};

		return {
			header: header,
			symbolLabel: symbolLabel,
			transactionLabel: transactionLabel,
			transactionQuantity: transactionQuantity,
			symbolsDropdown: symbolsDropdown,
			optionsDropdown: optionsDropdown,
			transactionButton: transactionButton,
			quantity: quantity
		};
	};
};
