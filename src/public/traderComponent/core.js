"use strict";

module.exports = function(dependencies) {
	dependencies = dependencies || {};

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function(config) {
		config = config || {};

		const header = "Trade";
		const symbolLabel = "Symbol ";
		const transactionLabel = "Transaction ";
		const transactionQuantity = "Quantity ";

		var symbolsDropdown = {
			selectedSymbol: ko.observable(null),
			selectedSymbolIdx: ko.observable(null),
			symbols: ko.observableArray([
				{
					label: "Google",
					value: "GOOG"
				},
				{
					label: "Apple",
					value: "AAPL"
				},
				{
					label: "Verzion",
					value: "VZ"
				}
			])
		};

		var transactionValue = ko.observable(0);
		
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
				console.log("Attempting to " + optionsDropdown.selectedOption().value + " " + transactionValue() + " stocks" +
				 " from " + symbolsDropdown.selectedSymbol().label() + " with the symbol: " + symbolsDropdown.selectedSymbol().value);
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
			transactionValue: transactionValue
		};
	};
};