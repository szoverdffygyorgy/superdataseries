(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.superdataseries = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
module.exports = '<div>\n	<span data-bind="text: dropdownLabel"></span>\n	<span>\n		<knob-dropdown params="\n			selected: selectedSymbol,\n			items: symbols,\n			selectedIdx: selectedIdx,\n			rightIcon: \'#icon-expand-more\'\n		">\n		</knob-dropdown>\n	</span>\n</div>\n<div>\n	<knob-button params="\n		label: loadChart.label,\n		click: loadChart.click\n	">\n	</knob-button>\n</div>\n';
},{}],3:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var chartChooserCore = require("./core");

module.exports = chartChooserCore({
	ko: ko
});
},{"./core":1}],4:[function(require,module,exports){
"use strict";

module.exports = function(dependencies) {
	dependencies = dependencies || {};

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function(config) {
		config = config || {};

		if(!config.seriesUrl && typeof config.seriesUrl !== "string") {
			throw new Error("config.seriesUrl is mandatory and should be a string!");
		}

		if(!config.divId && typeof config.divId !== "string") {
			throw new Error("config.divId is mandatory and should be a string!");
		}

		if(!config.baseRoute && typeof config.baseRoute !== "string") {
			throw new Error("config.baseRoute is mandatory and should be a string!");
		}

		if(!config.selectedSymbol && typeof config.selectedSymbol !== "function") {
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

},{}],5:[function(require,module,exports){
module.exports = '<div>\n	<div data-bind= "attr: {\n	id: divId\n	}"></div>\n	<knob-button params="\n		label: zoomButton.label,\n		click: zoomButton.click">		\n	</knob-button>\n	<knob-button params="\n		label: resetButton.label,\n		click: resetButton.click\n	"></knob-button>\n</div>';
},{}],6:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var chartComponentCore = require("./core");

module.exports = chartComponentCore({
	ko: ko
});
},{"./core":4}],7:[function(require,module,exports){
"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory");
	}

	var ko = dependencies.ko;

	return function createLoginSurface(config) {
		config = config || {};

		if(!config) {
			throw new Error("config is mandatory!");
		}

		if(!config.user && typeof config.user !== "function") {
			throw new Error("config.user is mandatory and it should be a knockout observable!");
		}

		if(!config.errorMessage && typeof config.errorMessage !== "function") {
			throw new Error("config.errorMessage is mandatory and it should be a knockout observable!");
		}

		var user = config.user;
		var loginLabel = config.loginLabel;
		var menu = config.menu;
		let errorMessage = config.errorMessage;

		var userInput = {
			placeholder: "User",
			value: ko.observable(null)
		};

		var passwordInput = {
			placeholder: "Password",
			value: ko.observable(null)
		};

		var loginButton = {
			label: "Login",
			click: function() {
				var post = new XMLHttpRequest();

				post.open("POST", "./loginrequest", true);

				post.onreadystatechange = function() {
    				if(post.readyState == 4/* && post.status == 200*/) {
        				console.log(post.responseText);
								let responseObject = JSON.parse(post.responseText);

								if(!responseObject.ok) {
									user(null);
									errorMessage(responseObject.error);
								} else {
									user(responseObject.result);
									errorMessage(null);
									menu[0].visible(false);
									menu[1].visible(true);
									location.hash = "/users/" + user().userName;
								}
    				}
				}

				post.setRequestHeader("Content-type", "application/json");
				post.send(JSON.stringify({
					user: userInput.value(),
					pass: passwordInput.value()
				}));
			}
		};

		return {
			userInput: userInput,
			passwordInput: passwordInput,
			loginButton: loginButton
		};
	};
};

},{}],8:[function(require,module,exports){
module.exports = '<div>\n	<knob-input params="\n		value: userInput.value,\n		placeholder: userInput.placeholder\n	"></knob-input>\n</div>\n<div>\n	<knob-input params="\n		value: passwordInput.value,\n		placeholder: passwordInput.placeholder,\n		type: \'password\'\n	"></knob-input>\n</div>\n<div>\n	<knob-button params="\n		label: loginButton.label,\n		click: loginButton.click\n	"></knob-button>\n</div>\n';
},{}],9:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var loginSurfaceCore = require("./core");

module.exports = loginSurfaceCore({
	ko: ko
});
},{"./core":7}],10:[function(require,module,exports){
"use strict";

var knob = (window.knob);

function init() {
	knob.registerComponent("chart-chooser", require("./chartChooser/vm"), require("./chartChooser/template.html"));
	knob.registerComponent("profile-component", require("./profileComponent/vm"), require("./profileComponent/template.html"));
	knob.registerComponent("trader-component", require("./traderComponent/vm"), require("./traderComponent/template.html"));
	knob.registerComponent("login-surface", require("./loginSurface/vm"), require("./loginSurface/template.html"));
	knob.registerComponent("chart-component", require("./chartComponent/vm"), require("./chartComponent/template.html"));
	knob.registerComponent("main-component", require("./mainComponent/vm"), require("./mainComponent/template.html"));
}

module.exports = init;
},{"./chartChooser/template.html":2,"./chartChooser/vm":3,"./chartComponent/template.html":5,"./chartComponent/vm":6,"./loginSurface/template.html":8,"./loginSurface/vm":9,"./mainComponent/template.html":12,"./mainComponent/vm":13,"./profileComponent/template.html":15,"./profileComponent/vm":16,"./traderComponent/template.html":18,"./traderComponent/vm":19}],11:[function(require,module,exports){
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
		const findAlgorithmUrl = "./algorithms/";
		const seriesUrl = "dataPoints";
		const runAlgorithm = "./runAlgorithm";
		const tradingHistoryQueryUrl = "./tradingHistory/";
		const runAlgorithmUrl = "./runAlgorithm";

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
			if(getAlgorithms.readyState === 4/* && getAlgorithms.status == 200*/) {
				let responseObject = JSON.parse(getAlgorithms.responseText);

				if(!responseObject.ok) {
					errorMessage(responseObject.error);
				} else {
					errorMessage(null);
					algorithms([]);
					responseObject.result.forEach((algorithmName) => {
						let nameSplit = algorithmName.split(" ");
						algorithms.push({
							label: algorithmName,
							value: nameSplit[0] + "_" + nameSplit[1]
						});
					});
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
			runAlgorithmUrl: runAlgorithmUrl,
			findAlgorithmUrl: findAlgorithmUrl,
			algorithms: algorithms,
			selectedAlgorithm: selectedAlgorithm,
			errorMessage: errorMessage
		};
	};
};

},{}],12:[function(require,module,exports){
module.exports = '<div class="menu" data-bind="foreach: { data: menu, as: \'menuItem\'}">\n    <span>\n    	<knob-button class="menu-item" data-bind="visible: menuItem.visible" params="\n    		label: menuItem.label,\n    		click: menuItem.click\n    	"></knob-button>\n    </span>\n</div>\n<div data-bind="if: resource() === null">\n	<h1 data-bind="text: \'Welcome to the Virtual Stock Market!\'"></h1>\n</div>\n<div data-bind="if: resource() === \'login\' || user() === null">\n	<login-surface params="\n		user: user,\n		menu: menu,\n    errorMessage: errorMessage\n	"></login-surface>\n</div>\n<div data-bind="if: resource() === \'profile\' && user() !== null">\n	<profile-component params="\n		name: \'Defualt User\',\n		profilePictureUrl: \'http://www.mukeshambani.com/photo/default.jpg\',\n		balance: 10000,\n		user: user,\n    tradingHistory: tradingHistory,\n    tradingHistoryQueryUrl: tradingHistoryQueryUrl,\n    errorMessage: errorMessage\n	"></profile-component>\n</div>\n<div data-bind="if: resource() === \'trade\' && user() != null">\n	<trader-component params="\n		user: user,\n    symbols: symbols.traderComponent,\n    runAlgorithmUrl: runAlgorithmUrl,\n    findAlgorithmUrl: findAlgorithmUrl,\n    algorithms: algorithms,\n    selectedAlgorithm: selectedAlgorithm,\n    errorMessage: errorMessage\n	"></trader-component>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() == null && user() !== null">\n	<chart-chooser params="\n		user: user,\n		baseRoute: baseRoute,\n    symbols: symbols.chartChooser,\n    selectedSymbol: selectedSymbol,\n    errorMessage: errorMessage\n	"></chart-chooser>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() != null && user() != null">\n	<chart-component params="\n			user: user,\n			seriesUrl: seriesUrl,\n			divId: \'chart\',\n      baseRoute: baseRoute,\n      selectedSymbol: selectedSymbol,\n      errorMessage: errorMessage\n		"></chart-component>\n</div>\n<div data-bind = "text: errorMessage()" style = "color: red">\n</div>\n';
},{}],13:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var createMainComponent = require("./core");

module.exports = createMainComponent({
	ko: ko
});
},{"./core":11}],14:[function(require,module,exports){
"use strict";

module.exports = function(dependencies) {
	dependencies = dependencies || {};

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function(config) {
		config = config || {};

		if(!config.name && typeof config.name !== "string") {
			throw new Error("config.name is mandatory and should be a string!");
		}

		if(!config.profilePictureUrl && typeof config.profilePictureUrl !== "string") {
			throw new Error("config.profilePictureUrl is mandatory and should be a string!");
		}

		if(!config.balance && typeof config.balance !== "number") {
			throw new Error("config.balance is mandatory and should be a number!");
		}

		if(!config.user && typeof config.user !== "function") {
			throw new Error("config.user is mandatory and should be a knockout observable!");
		}

		if(!config.tradingHistory && typeof config.tradingHistory !== "function") {
			throw new Error("config.tradingHistory is mandatory and should be a knockout observableArray!");
		}

		if(!config.tradingHistoryQueryUrl && typeof config.tradingHistoryQueryUrl !== "string") {
			throw new Error("config.tradingHistory is mandatory and should be a string!");
		}

		if(!config.errorMessage && typeof config.errorMessage !== "function") {
			throw new Error("config.errorMessage is mandatory and should be a knockout observable!");
		}

		var name = config.name;
		var profilePictureUrl = config.profilePictureUrl;
		var balance = config.balance;
		var user = config.user;
		var tradingHistory = config.tradingHistory;
		var tradingHistoryQueryUrl = config.tradingHistoryQueryUrl;
		var errorMessage = config.errorMessage;

		var historyVisible = ko.observable(false);
		var historyButtons = {
			show: {
				label: "Show History",
				click: () => {
					historyVisible(true);
				}
			},
			hide: {
				label: "Hide History",
				click: () => {
					historyVisible(false);
				}
			}
		}

		let getHistory = new XMLHttpRequest();
		getHistory.open("GET", tradingHistoryQueryUrl + user().userName, true);
		getHistory.onreadystatechange = () => {
			if(getHistory.readyState === 4) {
				let responseObject = JSON.parse(getHistory.responseText);

				if(!responseObject.ok) {
					errorMessage(responseObject.error);
				} else {
					errorMessage(null);
					tradingHistory(responseObject.result);
				}
			}
		}

		getHistory.send(null);

		var portfolio = ko.computed(() => {
			if(!user()) {
				return [];
			}

			var returnable = [];
			for(var prop in user().portfolio) {
				console.log(prop ,user().portfolio);
				returnable.push({
					instrument: prop,
					amount: user().portfolio[prop]
				});
			}

			return returnable;
		});

		return {
			name: name,
			profilePictureUrl: profilePictureUrl,
			balance: balance,
			user: user,
			tradingHistory: tradingHistory,
			historyButtons: historyButtons,
			historyVisible: historyVisible,
			portfolio: portfolio
		};
	};
};

},{}],15:[function(require,module,exports){
module.exports = '<div>\n	<div>\n		<span data-bind="text: \'Username: \' + user().name"></span>\n		<img data-bind="attr: {src: user().profileUrl, height: 100, width: 100}">\n	</div>\n	<div>\n		<span data-bind="text: \'Balance: \' + user().balance + \'$\'"></span>\n	</div>\n	<div>\n		<h3 data-bind="text: \'Portfolio\'"></h3>\n		<div data-bind="foreach: {\n			data: portfolio,\n			as: \'item\'\n		}">\n			<div data-bind="text: item.instrument + \':\' + item.amount"></div>\n		</div>\n	</div>\n	<div>\n		<div data-bind="visible: !historyVisible()">\n			<knob-button params="\n				label: historyButtons.show.label,\n				click: historyButtons.show.click\n			"></knob-button>\n		</div>\n		<div data-bind="visible: historyVisible">\n			<knob-button params="\n				label: historyButtons.hide.label,\n				click: historyButtons.hide.click\n			"></knob-button>\n			<h3 data-bind="text: \'History\'"></h3>\n			<div data-bind="foreach: {\n				data: tradingHistory,\n				as: \'item\'\n			}">\n				<div data-bind="text: \'Instrument: \' + item.series +\n				 \', Price: \' + item.price + \', Amount: \' +\n				 amountOfInstrument + \', \' + item.transactionType +\n				  \', Time: \' + item.timeStamp">\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n';
},{}],16:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var createProfileComponent = require("./core");

module.exports = createProfileComponent({
	ko: ko
});
},{"./core":14}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
module.exports = '<div>\n	<h2 data-bind="text: header"></h2>\n	<span>\n		<span data-bind="text: symbolLabel"></span>\n		<knob-dropdown params="\n			selected: symbolsDropdown.selectedSymbol,\n			items: symbolsDropdown.symbols,\n			selectedIdx: symbolsDropdown.selectedSymbolIdx,\n			rightIcon: \'#icon-expand-more\'\n		"></knob-dropdown>\n	</span>\n	<div data-bind="visible: !formVisible()">\n		<span>\n			<span data-bind="text: transactionLabel"></span>\n			<knob-dropdown params="\n				selected: optionsDropdown.selectedOption,\n				items: optionsDropdown.options,\n				selectedIdx: optionsDropdown.selectedOptionIdx,\n				rightIcon: \'#icon-expand-more\'\n			"></knob-dropdown>\n		</span>\n		<span>\n			<span data-bind="text: transactionQuantity"></span>\n			<knob-input params="\n				value: quantity\n			"></knob-input>\n		</span>\n		<span>\n			<knob-button params="\n				label: transactionButton.label,\n				click: transactionButton.click\n			"></knob-button>\n		</span>\n		<knob-button params="\n			label: algorithmForm.showButton.label,\n			click: algorithmForm.showButton.click\n		"></knob-button>\n	</div>\n	<div data-bind="visible: formVisible()">\n		<knob-button params="\n			label: algorithmForm.hideButton.label,\n			click: algorithmForm.hideButton.click\n		"></knob-button>\n		<h3 data-bind="text: \'Advanced Options\'"></h3>\n		<span data-bind="text: \'Algorithms: \'"></span>\n		<knob-dropdown params="\n			selected: algorithmForm.algorithmDropdown.selectedAlgorithm,\n			items: algorithmForm.algorithmDropdown.algorithms,\n			selectedIdx: algorithmForm.algorithmDropdown.selectedAlgorithmIdx,\n			rightIcon: \'#icon-expand-more\'\n		"></knob-dropdown>\n		<div data-bind="foreach: {\n			data: algorithmForm.algorithmParamObservables,\n			as: \'item\'\n		}">\n				<div data-bind="if: (item.param !== \'user\' && item.param !== \'series\')">\n					<knob-input params="\n						value: item.value,\n						placeholder: item.param\n					"></knob-input>\n				</div>\n		</div>\n		<knob-button params="\n			label: algorithmForm.startAlgorithmButton.label,\n			click: algorithmForm.startAlgorithmButton.click\n		"></knob-button>\n	</div>\n</div>\n';
},{}],19:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var traderComponentCore = require("./core");

module.exports = traderComponentCore({
	ko: ko
});
},{"./core":17}]},{},[10])(10)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q2hvb3Nlci9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvY2hhcnRDaG9vc2VyL3ZtLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL2NvcmUuanMiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2Uvdm0uanMiLCJzcmMvcHVibGljL21haW4uanMiLCJzcmMvcHVibGljL21haW5Db21wb25lbnQvY29yZS5qcyIsInNyYy9wdWJsaWMvbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9tYWluQ29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9wcm9maWxlQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvcHJvZmlsZUNvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvdHJhZGVyQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy90cmFkZXJDb21wb25lbnQvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUxBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL09BOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLmJhc2VSb3V0ZSAmJiB0eXBlb2YgY29uZmlnLmJhc2VSb3V0ZSAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYmFzZVJvdXRlIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnN5bWJvbHMgJiYgdHlwZW9mIGNvbmZpZy5zeW1ib2xzICE9PSBcImFycmF5XCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN5bWJvbHMgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYW4gYXJyYXkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcuc2VsZWN0ZWRTeW1ib2wgJiYgdHlwZW9mIGNvbmZpZy5zZWxlY3RlZFN5bWJvbCAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zZWxlY3RlZFN5bWJvbCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGRyb3Bkb3duTGFiZWwgPSBcIlN0b2NrczogXCI7XHJcblx0XHRjb25zdCBiYXNlUm91dGUgPSBjb25maWcuYmFzZVJvdXRlO1xyXG5cdFx0Y29uc3Qgc2VyaWVzUXVlcnlVcmwgPSBjb25maWcuc2VyaWVzUXVlcnlVcmw7XHJcblx0XHRsZXQgc3ltYm9scyA9IGNvbmZpZy5zeW1ib2xzO1xyXG5cdFx0bGV0IHNlbGVjdGVkU3ltYm9sID0gY29uZmlnLnNlbGVjdGVkU3ltYm9sO1xyXG5cdFx0Lyp2YXIgc3ltYm9scyA9IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJHb29nbGVcIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wxXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkFwcGxlXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MMlwiXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJWZXJ6aW9uXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MM1wiXHJcblx0XHRcdH1cclxuXHRcdF0pOyovXHJcblxyXG5cdFx0dmFyIHNlbGVjdGVkSWR4ID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHJcblx0XHR2YXIgbG9hZENoYXJ0ID0ge1xyXG5cdFx0XHRsYWJlbDogXCJTZWxlY3RcIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSBsb2NhdGlvbi5oYXNoICsgXCIvXCIgKyBzZWxlY3RlZFN5bWJvbCgpLnZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZHJvcGRvd25MYWJlbDogZHJvcGRvd25MYWJlbCxcclxuXHRcdFx0c3ltYm9sczogc3ltYm9scyxcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2w6IHNlbGVjdGVkU3ltYm9sLFxyXG5cdFx0XHRzZWxlY3RlZElkeDogc2VsZWN0ZWRJZHgsXHJcblx0XHRcdGxvYWRDaGFydDogbG9hZENoYXJ0XHJcblx0XHR9O1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBkcm9wZG93bkxhYmVsXCI+PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdHNlbGVjdGVkOiBzZWxlY3RlZFN5bWJvbCxcXG5cdFx0XHRpdGVtczogc3ltYm9scyxcXG5cdFx0XHRzZWxlY3RlZElkeDogc2VsZWN0ZWRJZHgsXFxuXHRcdFx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJ1xcblx0XHRcIj5cXG5cdFx0PC9rbm9iLWRyb3Bkb3duPlxcblx0PC9zcGFuPlxcbjwvZGl2PlxcbjxkaXY+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiBsb2FkQ2hhcnQubGFiZWwsXFxuXHRcdGNsaWNrOiBsb2FkQ2hhcnQuY2xpY2tcXG5cdFwiPlxcblx0PC9rbm9iLWJ1dHRvbj5cXG48L2Rpdj5cXG4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBjaGFydENob29zZXJDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRDaG9vc2VyQ29yZSh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRkZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMgfHwge307XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5zZXJpZXNVcmwgJiYgdHlwZW9mIGNvbmZpZy5zZXJpZXNVcmwgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlcmllc1VybCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5kaXZJZCAmJiB0eXBlb2YgY29uZmlnLmRpdklkICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5kaXZJZCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5iYXNlUm91dGUgJiYgdHlwZW9mIGNvbmZpZy5iYXNlUm91dGUgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJhc2VSb3V0ZSBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5zZWxlY3RlZFN5bWJvbCAmJiB0eXBlb2YgY29uZmlnLnNlbGVjdGVkU3ltYm9sICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlbGVjdGVkU3ltYm9sIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly92YXIgY2hhcnRVcmwgPSBjb25maWcudXJsO1xyXG5cdFx0dmFyIHNlbGVjdGVkU3ltYm9sID0gY29uZmlnLnNlbGVjdGVkU3ltYm9sO1xyXG5cdFx0dmFyIGRpdklkID0gY29uZmlnLmRpdklkO1xyXG5cdFx0dmFyIHNlcmllc1VybCA9IGNvbmZpZy5zZXJpZXNVcmw7XHJcblx0XHR2YXIgYmFzZVJvdXRlID0gY29uZmlnLmJhc2VSb3V0ZTtcclxuXHJcblx0XHR2YXIgY2hhcnRVcmwgPSBcIi4vXCIgKyBzZXJpZXNVcmwgKyBcIi9cIiArIHNlbGVjdGVkU3ltYm9sKCkubGFiZWwoKTtcclxuXHJcblx0XHR2YXIgY2hhcnQgPSBjMy5nZW5lcmF0ZSh7XHJcblx0XHRcdGJpbmR0bzogXCIjXCIgKyBkaXZJZCxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdC8veDogXCJ0ZXN0U2VyaWVzXCIsXHJcblx0XHRcdFx0Ly94Rm9ybWF0OiBcIiVZLSVtLSVkICVIOiVNOiVTXCIsXHJcblx0XHRcdFx0dXJsOiBjaGFydFVybCxcclxuXHRcdFx0XHRtaW1lVHlwZTogXCJqc29uXCIsXHJcblx0XHRcdFx0Lypncm91cHM6IFtcclxuXHRcdFx0XHRcdFtcIkhVRi9VU0RcIl1cclxuXHRcdFx0XHRdLCovXHJcblx0XHRcdFx0a2V5czoge1xyXG5cdFx0XHRcdFx0eDogXCJ0aW1lXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogW3NlbGVjdGVkU3ltYm9sKCkubGFiZWwoKV1cclxuXHRcdFx0XHRcdC8veEZvcm1hdDogXCIlWS0lbS0lZCAlSDolTTolU1wiXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSxcclxuXHRcdFx0YXhpczoge1xyXG5cdFx0XHRcdHk6IHtcclxuXHRcdFx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IFwiUHJpY2VcIixcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IFwib3V0ZXItbWlkZGxlXCJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHg6IHtcclxuXHRcdFx0XHRcdHR5cGU6IFwidGltZXNlcmllc1wiLFxyXG5cdFx0XHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXCJUaW1lXCIsXHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiBcIm1pZGRsZVwiXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0dGljazoge1xyXG5cdFx0XHRcdFx0XHRmb3JtYXQ6IFwiJVktJW0tJWQgJUg6JU06JVNcIiwgLy9cIiVNOiVTXCIsXHJcblx0XHRcdFx0XHRcdGN1bGxpbmc6IHtcclxuXHRcdFx0XHRcdFx0XHRtYXg6IDdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0em9vbToge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IHRydWUsXHJcblx0XHRcdFx0cmVzY2FsZTogdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgem9vbUJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiVGVzdCBab29tXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Y2hhcnQuem9vbShbXHJcblx0XHRcdFx0XHRcdFwiMjAxNi0xMC0wMiAxNzowNDoxN1wiLFxyXG5cdFx0XHRcdFx0XHRcIjIwMTYtMTAtMDIgMTc6MDc6MjFcIl0pO1xyXG5cdFx0XHRcdH0sIDIwMDApO1xyXG5cdFx0XHRcdC8vY2hhcnQubG9hZChjaGFydFVybCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHJlc2V0QnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJSZXNldCBDaGFydFwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y2hhcnQudW56b29tKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRjaGFydDogY2hhcnQsXHJcblx0XHRcdGRpdklkOiBkaXZJZCxcclxuXHRcdFx0cmVzZXRCdXR0b246IHJlc2V0QnV0dG9uLFxyXG5cdFx0XHR6b29tQnV0dG9uOiB6b29tQnV0dG9uXHJcblx0XHR9O1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8ZGl2IGRhdGEtYmluZD0gXCJhdHRyOiB7XFxuXHRpZDogZGl2SWRcXG5cdH1cIj48L2Rpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHpvb21CdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiB6b29tQnV0dG9uLmNsaWNrXCI+XHRcdFxcblx0PC9rbm9iLWJ1dHRvbj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHJlc2V0QnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogcmVzZXRCdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY2hhcnRDb21wb25lbnRDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRDb21wb25lbnRDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGlmKCFkZXBlbmRlbmNpZXMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUxvZ2luU3VyZmFjZShjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcudXNlciAmJiB0eXBlb2YgY29uZmlnLnVzZXIgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXNlciBpcyBtYW5kYXRvcnkgYW5kIGl0IHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcuZXJyb3JNZXNzYWdlICYmIHR5cGVvZiBjb25maWcuZXJyb3JNZXNzYWdlICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmVycm9yTWVzc2FnZSBpcyBtYW5kYXRvcnkgYW5kIGl0IHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXI7XHJcblx0XHR2YXIgbG9naW5MYWJlbCA9IGNvbmZpZy5sb2dpbkxhYmVsO1xyXG5cdFx0dmFyIG1lbnUgPSBjb25maWcubWVudTtcclxuXHRcdGxldCBlcnJvck1lc3NhZ2UgPSBjb25maWcuZXJyb3JNZXNzYWdlO1xyXG5cclxuXHRcdHZhciB1c2VySW5wdXQgPSB7XHJcblx0XHRcdHBsYWNlaG9sZGVyOiBcIlVzZXJcIixcclxuXHRcdFx0dmFsdWU6IGtvLm9ic2VydmFibGUobnVsbClcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHBhc3N3b3JkSW5wdXQgPSB7XHJcblx0XHRcdHBsYWNlaG9sZGVyOiBcIlBhc3N3b3JkXCIsXHJcblx0XHRcdHZhbHVlOiBrby5vYnNlcnZhYmxlKG51bGwpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2dpbkJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiTG9naW5cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBwb3N0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG5cdFx0XHRcdHBvc3Qub3BlbihcIlBPU1RcIiwgXCIuL2xvZ2lucmVxdWVzdFwiLCB0cnVlKTtcclxuXHJcblx0XHRcdFx0cG9zdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgIFx0XHRcdFx0aWYocG9zdC5yZWFkeVN0YXRlID09IDQvKiAmJiBwb3N0LnN0YXR1cyA9PSAyMDAqLykge1xyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2cocG9zdC5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IHJlc3BvbnNlT2JqZWN0ID0gSlNPTi5wYXJzZShwb3N0LnJlc3BvbnNlVGV4dCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIXJlc3BvbnNlT2JqZWN0Lm9rKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHVzZXIobnVsbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGVycm9yTWVzc2FnZShyZXNwb25zZU9iamVjdC5lcnJvcik7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR1c2VyKHJlc3BvbnNlT2JqZWN0LnJlc3VsdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGVycm9yTWVzc2FnZShudWxsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWVudVswXS52aXNpYmxlKGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWVudVsxXS52aXNpYmxlKHRydWUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gXCIvdXNlcnMvXCIgKyB1c2VyKCkudXNlck5hbWU7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcbiAgICBcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHBvc3Quc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcblx0XHRcdFx0cG9zdC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcclxuXHRcdFx0XHRcdHVzZXI6IHVzZXJJbnB1dC52YWx1ZSgpLFxyXG5cdFx0XHRcdFx0cGFzczogcGFzc3dvcmRJbnB1dC52YWx1ZSgpXHJcblx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHVzZXJJbnB1dDogdXNlcklucHV0LFxyXG5cdFx0XHRwYXNzd29yZElucHV0OiBwYXNzd29yZElucHV0LFxyXG5cdFx0XHRsb2dpbkJ1dHRvbjogbG9naW5CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHR2YWx1ZTogdXNlcklucHV0LnZhbHVlLFxcblx0XHRwbGFjZWhvbGRlcjogdXNlcklucHV0LnBsYWNlaG9sZGVyXFxuXHRcIj48L2tub2ItaW5wdXQ+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHR2YWx1ZTogcGFzc3dvcmRJbnB1dC52YWx1ZSxcXG5cdFx0cGxhY2Vob2xkZXI6IHBhc3N3b3JkSW5wdXQucGxhY2Vob2xkZXIsXFxuXHRcdHR5cGU6IFxcJ3Bhc3N3b3JkXFwnXFxuXHRcIj48L2tub2ItaW5wdXQ+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IGxvZ2luQnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogbG9naW5CdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+XFxuJzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgbG9naW5TdXJmYWNlQ29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ2luU3VyZmFjZUNvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbm9iID0gKHdpbmRvdy5rbm9iKTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImNoYXJ0LWNob29zZXJcIiwgcmVxdWlyZShcIi4vY2hhcnRDaG9vc2VyL3ZtXCIpLCByZXF1aXJlKFwiLi9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcInByb2ZpbGUtY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL3Byb2ZpbGVDb21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcInRyYWRlci1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vdHJhZGVyQ29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi90cmFkZXJDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImxvZ2luLXN1cmZhY2VcIiwgcmVxdWlyZShcIi4vbG9naW5TdXJmYWNlL3ZtXCIpLCByZXF1aXJlKFwiLi9sb2dpblN1cmZhY2UvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImNoYXJ0LWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi9jaGFydENvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vY2hhcnRDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcIm1haW4tY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL21haW5Db21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL21haW5Db21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5pdDsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0aWYoIWRlcGVuZGVuY2llcykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGNvbnN0IGJhc2VSb3V0ZSA9IFwibG9jYWxob3N0Ojg4ODhcIjtcclxuXHRcdGNvbnN0IHNlcmllc1F1ZXJ5VXJsID0gXCIvc2VyaWVzTmFtZXNcIjtcclxuXHRcdGNvbnN0IGFsZ29yaXRobVF1ZXJ5VXJsID0gXCIuL2FsZ29yaXRobU5hbWVzXCI7XHJcblx0XHRjb25zdCBmaW5kQWxnb3JpdGhtVXJsID0gXCIuL2FsZ29yaXRobXMvXCI7XHJcblx0XHRjb25zdCBzZXJpZXNVcmwgPSBcImRhdGFQb2ludHNcIjtcclxuXHRcdGNvbnN0IHJ1bkFsZ29yaXRobSA9IFwiLi9ydW5BbGdvcml0aG1cIjtcclxuXHRcdGNvbnN0IHRyYWRpbmdIaXN0b3J5UXVlcnlVcmwgPSBcIi4vdHJhZGluZ0hpc3RvcnkvXCI7XHJcblx0XHRjb25zdCBydW5BbGdvcml0aG1VcmwgPSBcIi4vcnVuQWxnb3JpdGhtXCI7XHJcblxyXG5cdFx0bGV0IHN5bWJvbHMgPSB7XHJcblx0XHRcdGNoYXJ0Q2hvb3Nlcjoga28ub2JzZXJ2YWJsZUFycmF5KFtdKSxcclxuXHRcdFx0dHJhZGVyQ29tcG9uZW50OiBrby5vYnNlcnZhYmxlQXJyYXkoW10pXHJcblx0XHR9O1xyXG5cdFx0bGV0IHNlbGVjdGVkU3ltYm9sID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHRcdGxldCBzZWxlY3RlZEFsZ29yaXRobSA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblxyXG5cdCBcdGxldCBlcnJvck1lc3NhZ2UgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cclxuXHRcdGxldCByZXNvdXJjZSA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblx0XHRsZXQgc3ltYm9sID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHRcdGxldCB1c2VyID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHJcblx0XHRsZXQgdHJhZGluZ0hpc3RvcnkgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xyXG5cclxuXHRcdGxldCBnZXRTZXJpZXMgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdGdldFNlcmllcy5vcGVuKFwiR0VUXCIsIHNlcmllc1F1ZXJ5VXJsLCB0cnVlKTtcclxuXHRcdGdldFNlcmllcy5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRcdGlmKGdldFNlcmllcy5yZWFkeVN0YXRlID09PSA0LyogJiYgZ2V0U2VyaWVzLnN0YXR1cyA9PSAyMDAqLykge1xyXG5cdFx0XHRcdGxldCByZXNwb25zZU9iamVjdCA9IEpTT04ucGFyc2UoZ2V0U2VyaWVzLnJlc3BvbnNlVGV4dCk7XHJcblxyXG5cdFx0XHRcdGlmKCFyZXNwb25zZU9iamVjdC5vaykge1xyXG5cdFx0XHRcdFx0ZXJyb3JNZXNzYWdlKHJlc3BvbnNlT2JqZWN0LmVycm9yKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZXJyb3JNZXNzYWdlKG51bGwpO1xyXG5cdFx0XHRcdFx0SlNPTi5wYXJzZShyZXNwb25zZU9iamVjdC5yZXN1bHQpLmZvckVhY2goKHNlcmllcykgPT4ge1xyXG5cdFx0XHRcdFx0XHRzeW1ib2xzLmNoYXJ0Q2hvb3Nlci5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRsYWJlbDogc2VyaWVzLFxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiBzZXJpZXMudG9VcHBlckNhc2UoKVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0c3ltYm9scy50cmFkZXJDb21wb25lbnQucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0bGFiZWw6IHNlcmllcyxcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogc2VyaWVzLnRvVXBwZXJDYXNlKClcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHN5bWJvbHMuY2hhcnRDaG9vc2VyKCkpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHN5bWJvbHMudHJhZGVyQ29tcG9uZW50KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Z2V0U2VyaWVzLnNlbmQobnVsbCk7XHJcblxyXG5cdFx0bGV0IGFsZ29yaXRobXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xyXG5cclxuXHRcdGxldCBnZXRBbGdvcml0aG1zID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRnZXRBbGdvcml0aG1zLm9wZW4oXCJHRVRcIiwgYWxnb3JpdGhtUXVlcnlVcmwsIHRydWUpO1xyXG5cdFx0Z2V0QWxnb3JpdGhtcy5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRcdGlmKGdldEFsZ29yaXRobXMucmVhZHlTdGF0ZSA9PT0gNC8qICYmIGdldEFsZ29yaXRobXMuc3RhdHVzID09IDIwMCovKSB7XHJcblx0XHRcdFx0bGV0IHJlc3BvbnNlT2JqZWN0ID0gSlNPTi5wYXJzZShnZXRBbGdvcml0aG1zLnJlc3BvbnNlVGV4dCk7XHJcblxyXG5cdFx0XHRcdGlmKCFyZXNwb25zZU9iamVjdC5vaykge1xyXG5cdFx0XHRcdFx0ZXJyb3JNZXNzYWdlKHJlc3BvbnNlT2JqZWN0LmVycm9yKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZXJyb3JNZXNzYWdlKG51bGwpO1xyXG5cdFx0XHRcdFx0YWxnb3JpdGhtcyhbXSk7XHJcblx0XHRcdFx0XHRyZXNwb25zZU9iamVjdC5yZXN1bHQuZm9yRWFjaCgoYWxnb3JpdGhtTmFtZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRsZXQgbmFtZVNwbGl0ID0gYWxnb3JpdGhtTmFtZS5zcGxpdChcIiBcIik7XHJcblx0XHRcdFx0XHRcdGFsZ29yaXRobXMucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0bGFiZWw6IGFsZ29yaXRobU5hbWUsXHJcblx0XHRcdFx0XHRcdFx0dmFsdWU6IG5hbWVTcGxpdFswXSArIFwiX1wiICsgbmFtZVNwbGl0WzFdXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Z2V0QWxnb3JpdGhtcy5zZW5kKG51bGwpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU1lbnVJdGVtKGxhYmVsLCB1cmwpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRsYWJlbDogbGFiZWwsXHJcblx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0dmlzaWJsZToga28ub2JzZXJ2YWJsZSh0cnVlKSxcclxuXHRcdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZih1c2VyKCkgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IFwiIy9sb2dpblwiO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmKHVzZXIoKSAhPT0gbnVsbCAmJiBsYWJlbCA9PT0gXCJNeSBQb3J0Zm9saW9cIikge1xyXG5cdFx0XHRcdFx0XHR1cmwgPSBcIiMvdXNlcnMvXCIgKyB1c2VyKCkudXNlck5hbWU7XHJcblx0XHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSB1cmw7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gdXJsO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBtZW51ID0gW1xyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIkxvZ2luXCIsIFwiIy9sb2dpblwiKSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkxvZ291dFwiLFxyXG5cdFx0XHRcdHVybDogXCIjL2xvZ2luXCIsXHJcblx0XHRcdFx0dmlzaWJsZToga28ub2JzZXJ2YWJsZShmYWxzZSksXHJcblx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dXNlcihudWxsKTtcclxuXHRcdFx0XHRcdG1lbnVbMF0udmlzaWJsZSh0cnVlKTtcclxuXHRcdFx0XHRcdG1lbnVbMV0udmlzaWJsZShmYWxzZSk7XHJcblx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gXCIjL2xvZ2luXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIk15IFBvcnRmb2xpb1wiLCBcIiMvdXNlcnMvOnByb2ZpbGVJZFwiKSwgLy90aGluayBhYm91dCBzb2x1dGlvbiBmb3IgbG9nZ2VkIGluIHByb2ZpbGVzXHJcblx0XHRcdGNyZWF0ZU1lbnVJdGVtKFwiVHJhZGVcIiwgXCIjL3RyYWRlXCIpLFxyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIkNoYXJ0c1wiLCBcIiMvY2hhcnRzXCIpXHJcblx0XHRdO1xyXG5cclxuXHRcdFNhbW15KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmdldChcIiMvbG9naW5cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJsb2dpblwiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL3VzZXJzLzpwcm9maWxlSWRcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJwcm9maWxlXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvdHJhZGVcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJ0cmFkZVwiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL2NoYXJ0c1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcImNoYXJ0c1wiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL2NoYXJ0cy86c3ltYm9sXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHN5bWJvbCh0aGlzLnBhcmFtcy5zeW1ib2wpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiYSBjaGFydCBzaG91bGQgYmUgaGVyZSB3aXRoOiBcIiArIHN5bWJvbCgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIlwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlJvb3QgbG9sXCIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pLnJ1bigpO1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1lbnU6IG1lbnUsXHJcblx0XHRcdHJlc291cmNlOiByZXNvdXJjZSxcclxuXHRcdFx0c3ltYm9sOiBzeW1ib2wsXHJcblx0XHRcdHNlbGVjdGVkU3ltYm9sOiBzZWxlY3RlZFN5bWJvbCxcclxuXHRcdFx0c3ltYm9sczogc3ltYm9scyxcclxuXHRcdFx0YmFzZVJvdXRlOiBiYXNlUm91dGUsXHJcblx0XHRcdHVzZXI6IHVzZXIsXHJcblx0XHRcdHNlcmllc1F1ZXJ5VXJsOiBzZXJpZXNRdWVyeVVybCxcclxuXHRcdFx0c2VyaWVzVXJsOiBzZXJpZXNVcmwsXHJcblx0XHRcdHRyYWRpbmdIaXN0b3J5OiB0cmFkaW5nSGlzdG9yeSxcclxuXHRcdFx0dHJhZGluZ0hpc3RvcnlRdWVyeVVybDogdHJhZGluZ0hpc3RvcnlRdWVyeVVybCxcclxuXHRcdFx0cnVuQWxnb3JpdGhtVXJsOiBydW5BbGdvcml0aG1VcmwsXHJcblx0XHRcdGZpbmRBbGdvcml0aG1Vcmw6IGZpbmRBbGdvcml0aG1VcmwsXHJcblx0XHRcdGFsZ29yaXRobXM6IGFsZ29yaXRobXMsXHJcblx0XHRcdHNlbGVjdGVkQWxnb3JpdGhtOiBzZWxlY3RlZEFsZ29yaXRobSxcclxuXHRcdFx0ZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2VcclxuXHRcdH07XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cIm1lbnVcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiB7IGRhdGE6IG1lbnUsIGFzOiBcXCdtZW51SXRlbVxcJ31cIj5cXG4gICAgPHNwYW4+XFxuICAgIFx0PGtub2ItYnV0dG9uIGNsYXNzPVwibWVudS1pdGVtXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogbWVudUl0ZW0udmlzaWJsZVwiIHBhcmFtcz1cIlxcbiAgICBcdFx0bGFiZWw6IG1lbnVJdGVtLmxhYmVsLFxcbiAgICBcdFx0Y2xpY2s6IG1lbnVJdGVtLmNsaWNrXFxuICAgIFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG4gICAgPC9zcGFuPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IG51bGxcIj5cXG5cdDxoMSBkYXRhLWJpbmQ9XCJ0ZXh0OiBcXCdXZWxjb21lIHRvIHRoZSBWaXJ0dWFsIFN0b2NrIE1hcmtldCFcXCdcIj48L2gxPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2xvZ2luXFwnIHx8IHVzZXIoKSA9PT0gbnVsbFwiPlxcblx0PGxvZ2luLXN1cmZhY2UgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXIsXFxuXHRcdG1lbnU6IG1lbnUsXFxuICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlXFxuXHRcIj48L2xvZ2luLXN1cmZhY2U+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwncHJvZmlsZVxcJyAmJiB1c2VyKCkgIT09IG51bGxcIj5cXG5cdDxwcm9maWxlLWNvbXBvbmVudCBwYXJhbXM9XCJcXG5cdFx0bmFtZTogXFwnRGVmdWFsdCBVc2VyXFwnLFxcblx0XHRwcm9maWxlUGljdHVyZVVybDogXFwnaHR0cDovL3d3dy5tdWtlc2hhbWJhbmkuY29tL3Bob3RvL2RlZmF1bHQuanBnXFwnLFxcblx0XHRiYWxhbmNlOiAxMDAwMCxcXG5cdFx0dXNlcjogdXNlcixcXG4gICAgdHJhZGluZ0hpc3Rvcnk6IHRyYWRpbmdIaXN0b3J5LFxcbiAgICB0cmFkaW5nSGlzdG9yeVF1ZXJ5VXJsOiB0cmFkaW5nSGlzdG9yeVF1ZXJ5VXJsLFxcbiAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZVxcblx0XCI+PC9wcm9maWxlLWNvbXBvbmVudD5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCd0cmFkZVxcJyAmJiB1c2VyKCkgIT0gbnVsbFwiPlxcblx0PHRyYWRlci1jb21wb25lbnQgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXIsXFxuICAgIHN5bWJvbHM6IHN5bWJvbHMudHJhZGVyQ29tcG9uZW50LFxcbiAgICBydW5BbGdvcml0aG1Vcmw6IHJ1bkFsZ29yaXRobVVybCxcXG4gICAgZmluZEFsZ29yaXRobVVybDogZmluZEFsZ29yaXRobVVybCxcXG4gICAgYWxnb3JpdGhtczogYWxnb3JpdGhtcyxcXG4gICAgc2VsZWN0ZWRBbGdvcml0aG06IHNlbGVjdGVkQWxnb3JpdGhtLFxcbiAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZVxcblx0XCI+PC90cmFkZXItY29tcG9uZW50PlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2NoYXJ0c1xcJyAmJiBzeW1ib2woKSA9PSBudWxsICYmIHVzZXIoKSAhPT0gbnVsbFwiPlxcblx0PGNoYXJ0LWNob29zZXIgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXIsXFxuXHRcdGJhc2VSb3V0ZTogYmFzZVJvdXRlLFxcbiAgICBzeW1ib2xzOiBzeW1ib2xzLmNoYXJ0Q2hvb3NlcixcXG4gICAgc2VsZWN0ZWRTeW1ib2w6IHNlbGVjdGVkU3ltYm9sLFxcbiAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZVxcblx0XCI+PC9jaGFydC1jaG9vc2VyPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2NoYXJ0c1xcJyAmJiBzeW1ib2woKSAhPSBudWxsICYmIHVzZXIoKSAhPSBudWxsXCI+XFxuXHQ8Y2hhcnQtY29tcG9uZW50IHBhcmFtcz1cIlxcblx0XHRcdHVzZXI6IHVzZXIsXFxuXHRcdFx0c2VyaWVzVXJsOiBzZXJpZXNVcmwsXFxuXHRcdFx0ZGl2SWQ6IFxcJ2NoYXJ0XFwnLFxcbiAgICAgIGJhc2VSb3V0ZTogYmFzZVJvdXRlLFxcbiAgICAgIHNlbGVjdGVkU3ltYm9sOiBzZWxlY3RlZFN5bWJvbCxcXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZVxcblx0XHRcIj48L2NoYXJ0LWNvbXBvbmVudD5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZCA9IFwidGV4dDogZXJyb3JNZXNzYWdlKClcIiBzdHlsZSA9IFwiY29sb3I6IHJlZFwiPlxcbjwvZGl2Plxcbic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNyZWF0ZU1haW5Db21wb25lbnQgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVNYWluQ29tcG9uZW50KHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLm5hbWUgJiYgdHlwZW9mIGNvbmZpZy5uYW1lICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5uYW1lIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsICYmIHR5cGVvZiBjb25maWcucHJvZmlsZVBpY3R1cmVVcmwgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLmJhbGFuY2UgJiYgdHlwZW9mIGNvbmZpZy5iYWxhbmNlICE9PSBcIm51bWJlclwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5iYWxhbmNlIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgbnVtYmVyIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnVzZXIgJiYgdHlwZW9mIGNvbmZpZy51c2VyICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnVzZXIgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnRyYWRpbmdIaXN0b3J5ICYmIHR5cGVvZiBjb25maWcudHJhZGluZ0hpc3RvcnkgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudHJhZGluZ0hpc3RvcnkgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlQXJyYXkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcudHJhZGluZ0hpc3RvcnlRdWVyeVVybCAmJiB0eXBlb2YgY29uZmlnLnRyYWRpbmdIaXN0b3J5UXVlcnlVcmwgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnRyYWRpbmdIaXN0b3J5IGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLmVycm9yTWVzc2FnZSAmJiB0eXBlb2YgY29uZmlnLmVycm9yTWVzc2FnZSAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5lcnJvck1lc3NhZ2UgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbmFtZSA9IGNvbmZpZy5uYW1lO1xyXG5cdFx0dmFyIHByb2ZpbGVQaWN0dXJlVXJsID0gY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsO1xyXG5cdFx0dmFyIGJhbGFuY2UgPSBjb25maWcuYmFsYW5jZTtcclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXI7XHJcblx0XHR2YXIgdHJhZGluZ0hpc3RvcnkgPSBjb25maWcudHJhZGluZ0hpc3Rvcnk7XHJcblx0XHR2YXIgdHJhZGluZ0hpc3RvcnlRdWVyeVVybCA9IGNvbmZpZy50cmFkaW5nSGlzdG9yeVF1ZXJ5VXJsO1xyXG5cdFx0dmFyIGVycm9yTWVzc2FnZSA9IGNvbmZpZy5lcnJvck1lc3NhZ2U7XHJcblxyXG5cdFx0dmFyIGhpc3RvcnlWaXNpYmxlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcblx0XHR2YXIgaGlzdG9yeUJ1dHRvbnMgPSB7XHJcblx0XHRcdHNob3c6IHtcclxuXHRcdFx0XHRsYWJlbDogXCJTaG93IEhpc3RvcnlcIixcclxuXHRcdFx0XHRjbGljazogKCkgPT4ge1xyXG5cdFx0XHRcdFx0aGlzdG9yeVZpc2libGUodHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRoaWRlOiB7XHJcblx0XHRcdFx0bGFiZWw6IFwiSGlkZSBIaXN0b3J5XCIsXHJcblx0XHRcdFx0Y2xpY2s6ICgpID0+IHtcclxuXHRcdFx0XHRcdGhpc3RvcnlWaXNpYmxlKGZhbHNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZ2V0SGlzdG9yeSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0Z2V0SGlzdG9yeS5vcGVuKFwiR0VUXCIsIHRyYWRpbmdIaXN0b3J5UXVlcnlVcmwgKyB1c2VyKCkudXNlck5hbWUsIHRydWUpO1xyXG5cdFx0Z2V0SGlzdG9yeS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRcdGlmKGdldEhpc3RvcnkucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG5cdFx0XHRcdGxldCByZXNwb25zZU9iamVjdCA9IEpTT04ucGFyc2UoZ2V0SGlzdG9yeS5yZXNwb25zZVRleHQpO1xyXG5cclxuXHRcdFx0XHRpZighcmVzcG9uc2VPYmplY3Qub2spIHtcclxuXHRcdFx0XHRcdGVycm9yTWVzc2FnZShyZXNwb25zZU9iamVjdC5lcnJvcik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVycm9yTWVzc2FnZShudWxsKTtcclxuXHRcdFx0XHRcdHRyYWRpbmdIaXN0b3J5KHJlc3BvbnNlT2JqZWN0LnJlc3VsdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Z2V0SGlzdG9yeS5zZW5kKG51bGwpO1xyXG5cclxuXHRcdHZhciBwb3J0Zm9saW8gPSBrby5jb21wdXRlZCgoKSA9PiB7XHJcblx0XHRcdGlmKCF1c2VyKCkpIHtcclxuXHRcdFx0XHRyZXR1cm4gW107XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciByZXR1cm5hYmxlID0gW107XHJcblx0XHRcdGZvcih2YXIgcHJvcCBpbiB1c2VyKCkucG9ydGZvbGlvKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocHJvcCAsdXNlcigpLnBvcnRmb2xpbyk7XHJcblx0XHRcdFx0cmV0dXJuYWJsZS5wdXNoKHtcclxuXHRcdFx0XHRcdGluc3RydW1lbnQ6IHByb3AsXHJcblx0XHRcdFx0XHRhbW91bnQ6IHVzZXIoKS5wb3J0Zm9saW9bcHJvcF1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHJldHVybmFibGU7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lOiBuYW1lLFxyXG5cdFx0XHRwcm9maWxlUGljdHVyZVVybDogcHJvZmlsZVBpY3R1cmVVcmwsXHJcblx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXHJcblx0XHRcdHVzZXI6IHVzZXIsXHJcblx0XHRcdHRyYWRpbmdIaXN0b3J5OiB0cmFkaW5nSGlzdG9yeSxcclxuXHRcdFx0aGlzdG9yeUJ1dHRvbnM6IGhpc3RvcnlCdXR0b25zLFxyXG5cdFx0XHRoaXN0b3J5VmlzaWJsZTogaGlzdG9yeVZpc2libGUsXHJcblx0XHRcdHBvcnRmb2xpbzogcG9ydGZvbGlvXHJcblx0XHR9O1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8ZGl2Plxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBcXCdVc2VybmFtZTogXFwnICsgdXNlcigpLm5hbWVcIj48L3NwYW4+XFxuXHRcdDxpbWcgZGF0YS1iaW5kPVwiYXR0cjoge3NyYzogdXNlcigpLnByb2ZpbGVVcmwsIGhlaWdodDogMTAwLCB3aWR0aDogMTAwfVwiPlxcblx0PC9kaXY+XFxuXHQ8ZGl2Plxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBcXCdCYWxhbmNlOiBcXCcgKyB1c2VyKCkuYmFsYW5jZSArIFxcJyRcXCdcIj48L3NwYW4+XFxuXHQ8L2Rpdj5cXG5cdDxkaXY+XFxuXHRcdDxoMyBkYXRhLWJpbmQ9XCJ0ZXh0OiBcXCdQb3J0Zm9saW9cXCdcIj48L2gzPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cImZvcmVhY2g6IHtcXG5cdFx0XHRkYXRhOiBwb3J0Zm9saW8sXFxuXHRcdFx0YXM6IFxcJ2l0ZW1cXCdcXG5cdFx0fVwiPlxcblx0XHRcdDxkaXYgZGF0YS1iaW5kPVwidGV4dDogaXRlbS5pbnN0cnVtZW50ICsgXFwnOlxcJyArIGl0ZW0uYW1vdW50XCI+PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXHQ8ZGl2Plxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6ICFoaXN0b3J5VmlzaWJsZSgpXCI+XFxuXHRcdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRcdFx0bGFiZWw6IGhpc3RvcnlCdXR0b25zLnNob3cubGFiZWwsXFxuXHRcdFx0XHRjbGljazogaGlzdG9yeUJ1dHRvbnMuc2hvdy5jbGlja1xcblx0XHRcdFwiPjwva25vYi1idXR0b24+XFxuXHRcdDwvZGl2Plxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGhpc3RvcnlWaXNpYmxlXCI+XFxuXHRcdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRcdFx0bGFiZWw6IGhpc3RvcnlCdXR0b25zLmhpZGUubGFiZWwsXFxuXHRcdFx0XHRjbGljazogaGlzdG9yeUJ1dHRvbnMuaGlkZS5jbGlja1xcblx0XHRcdFwiPjwva25vYi1idXR0b24+XFxuXHRcdFx0PGgzIGRhdGEtYmluZD1cInRleHQ6IFxcJ0hpc3RvcnlcXCdcIj48L2gzPlxcblx0XHRcdDxkaXYgZGF0YS1iaW5kPVwiZm9yZWFjaDoge1xcblx0XHRcdFx0ZGF0YTogdHJhZGluZ0hpc3RvcnksXFxuXHRcdFx0XHRhczogXFwnaXRlbVxcJ1xcblx0XHRcdH1cIj5cXG5cdFx0XHRcdDxkaXYgZGF0YS1iaW5kPVwidGV4dDogXFwnSW5zdHJ1bWVudDogXFwnICsgaXRlbS5zZXJpZXMgK1xcblx0XHRcdFx0IFxcJywgUHJpY2U6IFxcJyArIGl0ZW0ucHJpY2UgKyBcXCcsIEFtb3VudDogXFwnICtcXG5cdFx0XHRcdCBhbW91bnRPZkluc3RydW1lbnQgKyBcXCcsIFxcJyArIGl0ZW0udHJhbnNhY3Rpb25UeXBlICtcXG5cdFx0XHRcdCAgXFwnLCBUaW1lOiBcXCcgKyBpdGVtLnRpbWVTdGFtcFwiPlxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY3JlYXRlUHJvZmlsZUNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVByb2ZpbGVDb21wb25lbnQoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcudXNlciAmJiB0eXBlb2YgY29uZmlnLnVzZXIgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXNlciBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcuc3ltYm9scyAmJiB0eXBlb2YgY29uZmlnLnN5bWJvbHMgIT09IFwiYXJyYXlcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc3ltYm9scyBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhbiBhcnJheSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5ydW5BbGdvcml0aG1VcmwgJiYgdHlwZW9mIGNvbmZpZy5ydW5BbGdvcml0aG1VcmwgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnJ1bkFsZ29yaXRobVVybCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5maW5kQWxnb3JpdGhtVXJsICYmIHR5cGVvZiBjb25maWcuZmluZEFsZ29yaXRobVVybCAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZmluZEFsZ29yaXRobVVybCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5lcnJvck1lc3NhZ2UgJiYgdHlwZW9mIGNvbmZpZy5lcnJvck1lc3NhZ2UgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZXJyb3JNZXNzYWdlIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5hbGdvcml0aG1zICYmIHR5cGVvZiBjb25maWcuYWxnb3JpdGhtcyAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5hbGdvcml0aG1zIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5zZWxlY3RlZEFsZ29yaXRobSAmJiB0eXBlb2YgY29uZmlnLnNlbGVjdGVkQWxnb3JpdGhtICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlbGVjdGVkQWxnb3JpdGhtIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHVzZXIgPSBjb25maWcudXNlcjtcclxuXHRcdHZhciBzeW1ib2xzID0gY29uZmlnLnN5bWJvbHM7XHJcblx0XHR2YXIgZXJyb3JNZXNzYWdlID0gY29uZmlnLmVycm9yTWVzc2FnZTtcclxuXHRcdHZhciBhbGdvcml0aG1zID0gY29uZmlnLmFsZ29yaXRobXM7XHJcblx0XHR2YXIgc2VsZWN0ZWRBbGdvcml0aG0gPSBjb25maWcuc2VsZWN0ZWRBbGdvcml0aG07XHJcblx0XHR2YXIgcnVuQWxnb3JpdGhtVXJsID0gY29uZmlnLnJ1bkFsZ29yaXRobVVybDtcclxuXHRcdHZhciBmaW5kQWxnb3JpdGhtVXJsID0gY29uZmlnLmZpbmRBbGdvcml0aG1Vcmw7XHJcblxyXG5cdFx0Y29uc3QgaGVhZGVyID0gXCJUcmFkZVwiO1xyXG5cdFx0Y29uc3Qgc3ltYm9sTGFiZWwgPSBcIlN5bWJvbCBcIjtcclxuXHRcdGNvbnN0IHRyYW5zYWN0aW9uTGFiZWwgPSBcIlRyYW5zYWN0aW9uIFwiO1xyXG5cdFx0Y29uc3QgdHJhbnNhY3Rpb25RdWFudGl0eSA9IFwiUXVhbnRpdHkgXCI7XHJcblxyXG5cdFx0dmFyIHN5bWJvbHNEcm9wZG93biA9IHtcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2w6IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdHNlbGVjdGVkU3ltYm9sSWR4OiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzeW1ib2xzOiBzeW1ib2xzXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBxdWFudGl0eSA9IGtvLm9ic2VydmFibGUoMCk7XHJcblxyXG5cdFx0dmFyIG9wdGlvbnNEcm9wZG93biA9IHtcclxuXHRcdFx0c2VsZWN0ZWRPcHRpb246IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdHNlbGVjdGVkT3B0aW9uSWR4OiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRvcHRpb25zIDoga28ub2JzZXJ2YWJsZUFycmF5KFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJCdXlcIixcclxuXHRcdFx0XHRcdHZhbHVlOiBcImJ1eVwiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJTZWxsXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJzZWxsXCJcclxuXHRcdFx0XHR9XHJcblx0XHRcdF0pXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciB0cmFuc2FjdGlvbkJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiTWFrZSB0cmFuc2FjdGlvblwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJBdHRlbXB0aW5nIHRvIFwiICsgb3B0aW9uc0Ryb3Bkb3duLnNlbGVjdGVkT3B0aW9uKCkudmFsdWUgK1xyXG5cdFx0XHRcdCBcIiBcIiArIHF1YW50aXR5KCkgKyBcIiBzdG9ja3NcIiArXHJcblx0XHRcdFx0IFwiIGZyb20gXCIgKyBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2woKS5sYWJlbCgpICsgXCIgd2l0aCB0aGUgc3ltYm9sOiBcIiArXHJcblx0XHRcdFx0ICBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2woKS52YWx1ZSk7XHJcblxyXG5cdFx0XHRcdHZhciBwb3N0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdFx0IHBvc3Qub3BlbihcIlBPU1RcIiwgXCIuL3RyYW5zYWN0aW9uXCIsIHRydWUpO1xyXG5cclxuXHRcdFx0XHQgcG9zdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQgXHRpZihwb3N0LnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUvKiAmJiBwb3N0LnN0YXR1cyA9PT0gMjAwKi8pIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJSRVNQT05TRVwiLCBwb3N0LnJlc3BvbnNlVGV4dCk7XHJcblx0XHRcdFx0XHRcdGxldCByZXNwb25zZU9iamVjdCA9IEpTT04ucGFyc2UocG9zdC5yZXNwb25zZVRleHQpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYoIXJlc3BvbnNlT2JqZWN0Lm9rKSB7XHJcblx0XHRcdFx0XHRcdFx0ZXJyb3JNZXNzYWdlKHJlc3BvbnNlT2JqZWN0LmVycm9yKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR1c2VyKHJlc3BvbnNlT2JqZWN0LnJlc3VsdCk7XHJcblx0XHRcdFx0XHRcdFx0ZXJyb3JNZXNzYWdlKG51bGwpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0IFx0fVxyXG5cdFx0XHRcdCB9XHJcblxyXG5cdFx0XHRcdCBwb3N0LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG5cdFx0XHRcdCBwb3N0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRcdFx0IHVzZXI6IHVzZXIoKS51c2VyTmFtZSxcclxuXHRcdFx0XHRcdCB0cmFuc2FjdGlvblR5cGU6IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbigpLnZhbHVlLFxyXG5cdFx0XHRcdFx0IHF1YW50aXR5OiBxdWFudGl0eSgpLFxyXG5cdFx0XHRcdFx0IHNlcmllc05hbWU6IHN5bWJvbHNEcm9wZG93bi5zZWxlY3RlZFN5bWJvbCgpLmxhYmVsKClcclxuXHRcdFx0XHQgfSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBhbGdvcml0aG1QYXJhbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xyXG5cdFx0a28uY29tcHV0ZWQoKCkgPT4ge1xyXG5cdFx0XHRcdGlmKCFzZWxlY3RlZEFsZ29yaXRobSgpKSB7XHJcblx0XHRcdFx0YWxnb3JpdGhtUGFyYW1zKFtdKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBnZXRBbGdvcml0aG1QYXJhbXMgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0Z2V0QWxnb3JpdGhtUGFyYW1zLm9wZW4oXCJHRVRcIiwgZmluZEFsZ29yaXRobVVybCArIHNlbGVjdGVkQWxnb3JpdGhtKCkudmFsdWUsIHRydWUpO1xyXG5cdFx0XHRnZXRBbGdvcml0aG1QYXJhbXMub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xyXG5cdFx0XHRcdGlmKGdldEFsZ29yaXRobVBhcmFtcy5yZWFkeVN0YXRlID09PSA0KSB7XHJcblx0XHRcdFx0XHR2YXIgcmVzcG9uc2VPYmplY3QgPSBKU09OLnBhcnNlKGdldEFsZ29yaXRobVBhcmFtcy5yZXNwb25zZVRleHQpO1xyXG5cclxuXHRcdFx0XHRcdGlmKCFyZXNwb25zZU9iamVjdC5vaykge1xyXG5cdFx0XHRcdFx0XHRlcnJvck1lc3NhZ2UocmVzcG9uc2VPYmplY3QuZXJyb3IpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0ZXJyb3JNZXNzYWdlKG51bGwpO1xyXG5cdFx0XHRcdFx0XHRhbGdvcml0aG1QYXJhbXMoW10pO1xyXG5cdFx0XHRcdFx0XHRmb3IodmFyIHByb3AgaW4gcmVzcG9uc2VPYmplY3QucmVzdWx0LnBhcmFtcykge1xyXG5cdFx0XHRcdFx0XHRcdGFsZ29yaXRobVBhcmFtcy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmFtOiBwcm9wLFxyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogcmVzcG9uc2VPYmplY3QucmVzdWx0LnBhcmFtc1twcm9wXVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGFsZ29yaXRobVBhcmFtcygpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGdldEFsZ29yaXRobVBhcmFtcy5zZW5kKG51bGwpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIGFsZ29yaXRobVBhcmFtT2JzZXJ2YWJsZXMgPSBrby5jb21wdXRlZCgoKSA9PiB7XHJcblx0XHRcdHZhciBvYnNlcnZhYmxlcyA9IFtdO1xyXG5cclxuXHRcdFx0Zm9yKHZhciBpZHggPSAwOyBpZHggPCBhbGdvcml0aG1QYXJhbXMoKS5sZW5ndGg7IGlkeCArPSAxKSB7XHJcblx0XHRcdFx0aWYoYWxnb3JpdGhtUGFyYW1zKClbaWR4XVtcInBhcmFtXCJdID09PSBcInVzZXJcIiB8fCBhbGdvcml0aG1QYXJhbXMoKVtpZHhdW1wicGFyYW1cIl0gPT09IFwic2VyaWVzXCIpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRvYnNlcnZhYmxlcy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0cGFyYW06IGFsZ29yaXRobVBhcmFtcygpW2lkeF1bXCJwYXJhbVwiXSxcclxuXHRcdFx0XHRcdFx0dmFsdWU6IGtvLm9ic2VydmFibGUobnVsbClcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIG9ic2VydmFibGVzO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIGZvcm1WaXNpYmxlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcblx0XHR2YXIgYWxnb3JpdGhtRm9ybSA9IHtcclxuXHRcdFx0c2hvd0J1dHRvbjoge1xyXG5cdFx0XHRcdGxhYmVsOiBcIkFkdmFuY2VkIE9wdGlvbnNcIixcclxuXHRcdFx0XHRjbGljazogKCkgPT4ge1xyXG5cdFx0XHRcdFx0Zm9ybVZpc2libGUodHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRoaWRlQnV0dG9uOiB7XHJcblx0XHRcdFx0bGFiZWw6IFwiSGlkZSBBZHZhbmNlZFwiLFxyXG5cdFx0XHRcdGNsaWNrOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRmb3JtVmlzaWJsZShmYWxzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRoZWFkZXI6IFwiVHJ5IGFuIGFsZ29yaXRobVwiLFxyXG5cdFx0XHRhbGdvcml0aG1Ecm9wZG93bjoge1xyXG5cdFx0XHRcdHNlbGVjdGVkQWxnb3JpdGhtOiBzZWxlY3RlZEFsZ29yaXRobSxcclxuXHRcdFx0XHRzZWxlY3RlZEFsZ29yaXRobUlkeDoga28ub2JzZXJ2YWJsZShudWxsKSxcclxuXHRcdFx0XHRhbGdvcml0aG1zOiBhbGdvcml0aG1zXHJcblx0XHRcdH0sXHJcblx0XHRcdGFsZ29yaXRobVBhcmFtczogYWxnb3JpdGhtUGFyYW1zLFxyXG5cdFx0XHRhbGdvcml0aG1QYXJhbU9ic2VydmFibGVzOiBhbGdvcml0aG1QYXJhbU9ic2VydmFibGVzLFxyXG5cdFx0XHRzdGFydEFsZ29yaXRobUJ1dHRvbjoge1xyXG5cdFx0XHRcdGNsaWNrOiAoKSA9PiB7XHJcblx0XHRcdFx0XHRpZighc2VsZWN0ZWRBbGdvcml0aG0oKSkge1xyXG5cdFx0XHRcdFx0XHRlcnJvck1lc3NhZ2UoXCJQbGVhc2Ugc2VsZWN0IGFuIGFsZ29yaXRobSFcIik7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR2YXIgc3RhcnRBbGdvcml0aG0gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0XHRcdHN0YXJ0QWxnb3JpdGhtLm9wZW4oXCJQT1NUXCIsIHJ1bkFsZ29yaXRobVVybCwgdHJ1ZSk7XHJcblx0XHRcdFx0XHRzdGFydEFsZ29yaXRobS5vbnJlYWR5c3RhdGVjaGFuZ2U9ICgpID0+IHtcclxuXHRcdFx0XHRcdFx0aWYoc3RhcnRBbGdvcml0aG0ucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJSRVNQT05TRSFcIiwgc3RhcnRBbGdvcml0aG0ucmVzcG9uc2VUZXh0KTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgcmVzcG9uc2VPYmplY3QgPSBKU09OLnBhcnNlKHN0YXJ0QWxnb3JpdGhtLnJlc3BvbnNlVGV4dCk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZihyZXNwb25zZU9iamVjdC5vaykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR1c2VyKEpTT04ucGFyc2UocmVzcG9uc2VPYmplY3QucmVzdWx0KSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRlcnJvck1lc3NhZ2UocmVzcG9uc2VPYmplY3QuZXJyb3IpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0c3RhcnRBbGdvcml0aG0uc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcblxyXG5cdFx0XHRcdFx0dmFyIHBhcmFtcyA9IHt9O1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBpZHggPSAwOyBpZHggPCBhbGdvcml0aG1QYXJhbU9ic2VydmFibGVzKCkubGVuZ3RoOyBpZHggKz0gMSkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhhbGdvcml0aG1QYXJhbU9ic2VydmFibGVzKClbaWR4XS52YWx1ZSgpKTtcclxuXHRcdFx0XHRcdFx0cGFyYW1zW2FsZ29yaXRobVBhcmFtT2JzZXJ2YWJsZXMoKVtpZHhdLnBhcmFtXSA9IGFsZ29yaXRobVBhcmFtT2JzZXJ2YWJsZXMoKVtpZHhdLnZhbHVlKCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0cGFyYW1zLnVzZXIgPSB1c2VyKCkudXNlck5hbWU7XHJcblx0XHRcdFx0XHRwYXJhbXMuc2VyaWVzID0gc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkubGFiZWwoKTtcclxuXHJcblx0XHRcdFx0XHRzdGFydEFsZ29yaXRobS5zZW5kKEpTT04uc3RyaW5naWZ5KHtcclxuXHRcdFx0XHRcdFx0YWxnb3JpdGhtTmFtZTogc2VsZWN0ZWRBbGdvcml0aG0oKS5sYWJlbCgpLFxyXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHBhcmFtc1xyXG5cdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bGFiZWw6IFwiU3RhcnQgQWxnb3JpdGhtXCJcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRoZWFkZXI6IGhlYWRlcixcclxuXHRcdFx0c3ltYm9sTGFiZWw6IHN5bWJvbExhYmVsLFxyXG5cdFx0XHR0cmFuc2FjdGlvbkxhYmVsOiB0cmFuc2FjdGlvbkxhYmVsLFxyXG5cdFx0XHR0cmFuc2FjdGlvblF1YW50aXR5OiB0cmFuc2FjdGlvblF1YW50aXR5LFxyXG5cdFx0XHRzeW1ib2xzRHJvcGRvd246IHN5bWJvbHNEcm9wZG93bixcclxuXHRcdFx0b3B0aW9uc0Ryb3Bkb3duOiBvcHRpb25zRHJvcGRvd24sXHJcblx0XHRcdHRyYW5zYWN0aW9uQnV0dG9uOiB0cmFuc2FjdGlvbkJ1dHRvbixcclxuXHRcdFx0cXVhbnRpdHk6IHF1YW50aXR5LFxyXG5cdFx0XHRmb3JtVmlzaWJsZTogZm9ybVZpc2libGUsXHJcblx0XHRcdGFsZ29yaXRobUZvcm06IGFsZ29yaXRobUZvcm1cclxuXHRcdH07XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxoMiBkYXRhLWJpbmQ9XCJ0ZXh0OiBoZWFkZXJcIj48L2gyPlxcblx0PHNwYW4+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHN5bWJvbExhYmVsXCI+PC9zcGFuPlxcblx0XHQ8a25vYi1kcm9wZG93biBwYXJhbXM9XCJcXG5cdFx0XHRzZWxlY3RlZDogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sLFxcblx0XHRcdGl0ZW1zOiBzeW1ib2xzRHJvcGRvd24uc3ltYm9scyxcXG5cdFx0XHRzZWxlY3RlZElkeDogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sSWR4LFxcblx0XHRcdHJpZ2h0SWNvbjogXFwnI2ljb24tZXhwYW5kLW1vcmVcXCdcXG5cdFx0XCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0PC9zcGFuPlxcblx0PGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhZm9ybVZpc2libGUoKVwiPlxcblx0XHQ8c3Bhbj5cXG5cdFx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0cmFuc2FjdGlvbkxhYmVsXCI+PC9zcGFuPlxcblx0XHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdFx0c2VsZWN0ZWQ6IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbixcXG5cdFx0XHRcdGl0ZW1zOiBvcHRpb25zRHJvcGRvd24ub3B0aW9ucyxcXG5cdFx0XHRcdHNlbGVjdGVkSWR4OiBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb25JZHgsXFxuXHRcdFx0XHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnXFxuXHRcdFx0XCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0XHQ8L3NwYW4+XFxuXHRcdDxzcGFuPlxcblx0XHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRyYW5zYWN0aW9uUXVhbnRpdHlcIj48L3NwYW4+XFxuXHRcdFx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdFx0XHR2YWx1ZTogcXVhbnRpdHlcXG5cdFx0XHRcIj48L2tub2ItaW5wdXQ+XFxuXHRcdDwvc3Bhbj5cXG5cdFx0PHNwYW4+XFxuXHRcdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRcdFx0bGFiZWw6IHRyYW5zYWN0aW9uQnV0dG9uLmxhYmVsLFxcblx0XHRcdFx0Y2xpY2s6IHRyYW5zYWN0aW9uQnV0dG9uLmNsaWNrXFxuXHRcdFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0PC9zcGFuPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdFx0bGFiZWw6IGFsZ29yaXRobUZvcm0uc2hvd0J1dHRvbi5sYWJlbCxcXG5cdFx0XHRjbGljazogYWxnb3JpdGhtRm9ybS5zaG93QnV0dG9uLmNsaWNrXFxuXHRcdFwiPjwva25vYi1idXR0b24+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogZm9ybVZpc2libGUoKVwiPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdFx0bGFiZWw6IGFsZ29yaXRobUZvcm0uaGlkZUJ1dHRvbi5sYWJlbCxcXG5cdFx0XHRjbGljazogYWxnb3JpdGhtRm9ybS5oaWRlQnV0dG9uLmNsaWNrXFxuXHRcdFwiPjwva25vYi1idXR0b24+XFxuXHRcdDxoMyBkYXRhLWJpbmQ9XCJ0ZXh0OiBcXCdBZHZhbmNlZCBPcHRpb25zXFwnXCI+PC9oMz5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogXFwnQWxnb3JpdGhtczogXFwnXCI+PC9zcGFuPlxcblx0XHQ8a25vYi1kcm9wZG93biBwYXJhbXM9XCJcXG5cdFx0XHRzZWxlY3RlZDogYWxnb3JpdGhtRm9ybS5hbGdvcml0aG1Ecm9wZG93bi5zZWxlY3RlZEFsZ29yaXRobSxcXG5cdFx0XHRpdGVtczogYWxnb3JpdGhtRm9ybS5hbGdvcml0aG1Ecm9wZG93bi5hbGdvcml0aG1zLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBhbGdvcml0aG1Gb3JtLmFsZ29yaXRobURyb3Bkb3duLnNlbGVjdGVkQWxnb3JpdGhtSWR4LFxcblx0XHRcdHJpZ2h0SWNvbjogXFwnI2ljb24tZXhwYW5kLW1vcmVcXCdcXG5cdFx0XCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cImZvcmVhY2g6IHtcXG5cdFx0XHRkYXRhOiBhbGdvcml0aG1Gb3JtLmFsZ29yaXRobVBhcmFtT2JzZXJ2YWJsZXMsXFxuXHRcdFx0YXM6IFxcJ2l0ZW1cXCdcXG5cdFx0fVwiPlxcblx0XHRcdFx0PGRpdiBkYXRhLWJpbmQ9XCJpZjogKGl0ZW0ucGFyYW0gIT09IFxcJ3VzZXJcXCcgJiYgaXRlbS5wYXJhbSAhPT0gXFwnc2VyaWVzXFwnKVwiPlxcblx0XHRcdFx0XHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJcXG5cdFx0XHRcdFx0XHR2YWx1ZTogaXRlbS52YWx1ZSxcXG5cdFx0XHRcdFx0XHRwbGFjZWhvbGRlcjogaXRlbS5wYXJhbVxcblx0XHRcdFx0XHRcIj48L2tub2ItaW5wdXQ+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRsYWJlbDogYWxnb3JpdGhtRm9ybS5zdGFydEFsZ29yaXRobUJ1dHRvbi5sYWJlbCxcXG5cdFx0XHRjbGljazogYWxnb3JpdGhtRm9ybS5zdGFydEFsZ29yaXRobUJ1dHRvbi5jbGlja1xcblx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgdHJhZGVyQ29tcG9uZW50Q29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRyYWRlckNvbXBvbmVudENvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiXX0=
