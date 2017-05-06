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

		if(!config.runAlgorithmUrl && typeof config.runAlgorithmUrl !== "string") {
			throw new Error("config.runAlgorithmUrl is mandatory and should be a string!");
		}

		if(!config.findAlgorithmUrl && typeof config.findAlgorithmUrl !== "string") {
			throw new Error("config.findAlgorithmUrl is mandatory and should be a string!");
		}

		if(!config.errorMessage && typeof config.errorMessage !== "function") {
			throw new Error("config.errorMessage is mandatory and should be a knockout observable!");
		}

		if(!config.algorithms && typeof config.algorithms !== "function") {
			throw new Error("config.algorithms is mandatory and should be a knockout observable!");
		}

		if(!config.selectedAlgorithm && typeof config.selectedAlgorithm !== "function") {
			throw new Error("config.selectedAlgorithm is mandatory and should be a knockout observable!");
		}

		var user = config.user;
		var symbols = config.symbols;
		var errorMessage = config.errorMessage;
		var algorithms = config.algorithms;
		var selectedAlgorithm = config.selectedAlgorithm;
		var runAlgorithmUrl = config.runAlgorithmUrl;
		var findAlgorithmUrl = config.findAlgorithmUrl;

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
				 	if(post.readyState === XMLHttpRequest.DONE/* && post.status === 200*/) {
						console.log("RESPONSE", post.responseText);
						let responseObject = JSON.parse(post.responseText);

						if(!responseObject.ok) {
							errorMessage(responseObject.error);
						} else {
							user(responseObject.result);
							errorMessage(null);
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

		var algorithmParams = ko.observableArray([]);
		ko.computed(() => {
				if(!selectedAlgorithm()) {
				algorithmParams([]);
				return;
			}

			var getAlgorithmParams = new XMLHttpRequest();
			getAlgorithmParams.open("GET", findAlgorithmUrl + selectedAlgorithm().value, true);
			getAlgorithmParams.onreadystatechange = () => {
				if(getAlgorithmParams.readyState === 4) {
					var responseObject = JSON.parse(getAlgorithmParams.responseText);

					if(!responseObject.ok) {
						errorMessage(responseObject.error);
					} else {
						errorMessage(null);
						algorithmParams([]);
						for(var prop in responseObject.result.params) {
							algorithmParams.push({
								param: prop,
								type: responseObject.result.params[prop]
							});
						}
						console.log(algorithmParams());
					}
				}
			}

			getAlgorithmParams.send(null);
		});

		var algorithmParamObservables = ko.computed(() => {
			var observables = [];

			for(var idx = 0; idx < algorithmParams().length; idx += 1) {
				if(algorithmParams()[idx]["param"] === "user" || algorithmParams()[idx]["param"] === "series") {
					continue;
				} else {
					observables.push({
						param: algorithmParams()[idx]["param"],
						value: ko.observable(null)
					});
				}
			}

			return observables;
		});

		var formVisible = ko.observable(false);
		var algorithmForm = {
			showButton: {
				label: "Advanced Options",
				click: () => {
					formVisible(true);
				}
			},
			hideButton: {
				label: "Hide Advanced",
				click: () => {
					formVisible(false);
				}
			},
			header: "Try an algorithm",
			algorithmDropdown: {
				selectedAlgorithm: selectedAlgorithm,
				selectedAlgorithmIdx: ko.observable(null),
				algorithms: algorithms
			},
			algorithmParams: algorithmParams,
			algorithmParamObservables: algorithmParamObservables,
			startAlgorithmButton: {
				click: () => {
					if(!selectedAlgorithm()) {
						errorMessage("Please select an algorithm!");
						return;
					}

					var startAlgorithm = new XMLHttpRequest();
					startAlgorithm.open("POST", runAlgorithmUrl, true);
					startAlgorithm.onreadystatechange= () => {
						if(startAlgorithm.readyState === 4) {
							//console.log("RESPONSE!", startAlgorithm.responseText);
							var responseObject = JSON.parse(startAlgorithm.responseText);
								if(responseObject.ok) {
									user(JSON.parse(responseObject.result));
								} else {
									errorMessage(responseObject.error);
								}
						}
					}

					startAlgorithm.setRequestHeader("Content-type", "application/json");

					var params = {};
					for(var idx = 0; idx < algorithmParamObservables().length; idx += 1) {
						console.log(algorithmParamObservables()[idx].value());
						params[algorithmParamObservables()[idx].param] = algorithmParamObservables()[idx].value();
					}

					params.user = user().userName;
					params.series = symbolsDropdown.selectedSymbol().label();

					startAlgorithm.send(JSON.stringify({
						algorithmName: selectedAlgorithm().label(),
						params: params
					}));
				},
				label: "Start Algorithm"
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
			quantity: quantity,
			formVisible: formVisible,
			algorithmForm: algorithmForm
		};
	};
};
