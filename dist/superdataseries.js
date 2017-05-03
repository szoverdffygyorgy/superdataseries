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

		var user = config.user;
		var loginLabel = config.loginLabel;
		var menu = config.menu;

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
				var userParams = "user=" + userInput.value() + "&pass=" + passwordInput.value();
				var post = new XMLHttpRequest();

				post.open("POST", "./loginrequest", true);

				post.onreadystatechange = function() {
    				if(post.readyState == 4 && post.status == 200) {
        				console.log(post.responseText);
        				user(JSON.parse(post.responseText));
        				menu[0].visible(false);
        				menu[1].visible(true);
        				location.hash = "/users/" + user().userName;
    				}
				}

				post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				post.send(userParams);
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
module.exports = '<div>\n	<knob-input params="\n		value: userInput.value,\n		placeholder: userInput.placeholder\n	"></knob-input>\n</div>\n<div>\n	<knob-input params="\n		value: passwordInput.value,\n		placeholder: passwordInput.placeholder,\n		type: \'password\'\n	"></knob-input>\n</div>\n<div>\n	<knob-button params="\n		label: loginButton.label,\n		click: loginButton.click\n	"></knob-button>\n</div>';
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
		const seriesUrl = "dataPoints";
		const runAlgorithm = "./runAlgorithm";

		let symbols = {
			chartChooser: ko.observableArray([]),
			traderComponent: ko.observableArray([])
		};
		let selectedSymbol = ko.observable(null);

		let algorithms = ko.observableArray([]);
		let selectedAlgorithm = ko.observable(null);

		ko.computed(() => {
			console.log(selectedSymbol())
		})

		let getSeries = new XMLHttpRequest();
		getSeries.open("GET", seriesQueryUrl);
		getSeries.onreadystatechange = () => {
			if(getSeries.readyState == 4 && getSeries.status == 200) {
				let parsedData = JSON.parse(getSeries.responseText);

				JSON.parse(parsedData.result).forEach((series) => {
					symbols.chartChooser.push({
						label: series,
						value: series.toUpperCase()
					});
					symbols.traderComponent.push({
						label: series,
						value: series.toUpperCase()
					});
				});

				console.log(symbols.chartChooser());
				console.log(symbols.traderComponent());
			}
		}

		getSeries.send(null);

		let getAlgorithms = new XMLHttpRequest();
		getAlgorithms.open("GET", algorithmQueryUrl);
		getAlgorithms.onreadystatechange = () => {
			if(getAlgorithms.readyState == 4 && getAlgorithms.status == 200) {
				let parsedData = JSON.parse(getAlgorithms.responseText);
				algorithms(parsedData.result);
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

},{}],12:[function(require,module,exports){
module.exports = '<div class="menu" data-bind="foreach: { data: menu, as: \'menuItem\'}">\n    <span>\n    	<knob-button class="menu-item" data-bind="visible: menuItem.visible" params="\n    		label: menuItem.label,\n    		click: menuItem.click\n    	"></knob-button>\n    </span>\n</div>\n<div data-bind="if: resource() === null">\n	<h1 data-bind="text: \'Welcome to the Virtual Stock Market!\'"></h1>\n</div>\n<div data-bind="if: resource() === \'login\' || user() === null">\n	<login-surface params="\n		user: user,\n		menu: menu\n	"></login-surface>\n</div>\n<div data-bind="if: resource() === \'profile\' && user() !== null">\n	<profile-component params="\n		name: \'Defualt User\',\n		profilePictureUrl: \'http://www.mukeshambani.com/photo/default.jpg\',\n		balance: 10000,\n		user: user\n	"></profile-component>\n</div>\n<div data-bind="if: resource() === \'trade\' && user() != null">\n	<trader-component params="\n		user: user,\n    symbols: symbols.traderComponent\n	"></trader-component>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() == null && user() !== null">\n	<chart-chooser params="\n		user: user,\n		baseRoute: baseRoute,\n    symbols: symbols.chartChooser,\n    selectedSymbol: selectedSymbol\n	"></chart-chooser>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() != null && user() != null">\n	<chart-component params="\n			user: user,\n			seriesUrl: seriesUrl,\n			divId: \'chart\',\n      baseRoute: baseRoute,\n      selectedSymbol: selectedSymbol\n		"></chart-component>\n</div>\n';
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

		var name = config.name;
		var profilePictureUrl = config.profilePictureUrl;
		var balance = config.balance;
		var user = config.user || function() {}; //fix this, temporary

		return {
			name: name,
			profilePictureUrl: profilePictureUrl,
			balance: balance,
			user: user
		};
	};
};
},{}],15:[function(require,module,exports){
module.exports = '<div>\n	<div>\n		<span data-bind="text: \'Username: \' + user().name"></span>\n		<img data-bind="attr: {src: user().profileUrl, height: 100, width: 100}">\n	</div>\n	<div>\n		<span data-bind="text: \'Balance: \' + user().balance + \'$\'"></span>\n	</div>\n</div>';
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
				 	if(post.readyState === XMLHttpRequest.DONE && post.status === 200) {
						console.log("RESPONSE", post.responseText);
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

},{}],18:[function(require,module,exports){
module.exports = '<div>\n	<h2 data-bind="text: header"></h2>\n	<span>\n		<span data-bind="text: symbolLabel"></span>\n		<knob-dropdown params="\n			selected: symbolsDropdown.selectedSymbol,\n			items: symbolsDropdown.symbols,\n			selectedIdx: symbolsDropdown.selectedSymbolIdx,\n			rightIcon: \'#icon-expand-more\'\n		"></knob-dropdown>\n	</span>\n	<span>\n		<span data-bind="text: transactionLabel"></span>\n		<knob-dropdown params="\n			selected: optionsDropdown.selectedOption,\n			items: optionsDropdown.options,\n			selectedIdx: optionsDropdown.selectedOptionIdx,\n			rightIcon: \'#icon-expand-more\'\n		"></knob-dropdown>\n	</span>\n	<span>\n		<span data-bind="text: transactionQuantity"></span>\n		<knob-input params="\n			value: quantity\n		"></knob-input>\n	</span>\n	<span>\n		<knob-button params="\n			label: transactionButton.label,\n			click: transactionButton.click\n		"></knob-button>\n	</span>\n</div>\n';
},{}],19:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var traderComponentCore = require("./core");

module.exports = traderComponentCore({
	ko: ko
});
},{"./core":17}]},{},[10])(10)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q2hvb3Nlci9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvY2hhcnRDaG9vc2VyL3ZtLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL2NvcmUuanMiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2Uvdm0uanMiLCJzcmMvcHVibGljL21haW4uanMiLCJzcmMvcHVibGljL21haW5Db21wb25lbnQvY29yZS5qcyIsInNyYy9wdWJsaWMvbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9tYWluQ29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9wcm9maWxlQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvcHJvZmlsZUNvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvdHJhZGVyQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy90cmFkZXJDb21wb25lbnQvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcuYmFzZVJvdXRlICYmIHR5cGVvZiBjb25maWcuYmFzZVJvdXRlICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5iYXNlUm91dGUgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBzdHJpbmchXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcuc3ltYm9scyAmJiB0eXBlb2YgY29uZmlnLnN5bWJvbHMgIT09IFwiYXJyYXlcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc3ltYm9scyBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhbiBhcnJheSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5zZWxlY3RlZFN5bWJvbCAmJiB0eXBlb2YgY29uZmlnLnNlbGVjdGVkU3ltYm9sICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlbGVjdGVkU3ltYm9sIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgZHJvcGRvd25MYWJlbCA9IFwiU3RvY2tzOiBcIjtcclxuXHRcdGNvbnN0IGJhc2VSb3V0ZSA9IGNvbmZpZy5iYXNlUm91dGU7XHJcblx0XHRjb25zdCBzZXJpZXNRdWVyeVVybCA9IGNvbmZpZy5zZXJpZXNRdWVyeVVybDtcclxuXHRcdGxldCBzeW1ib2xzID0gY29uZmlnLnN5bWJvbHM7XHJcblx0XHRsZXQgc2VsZWN0ZWRTeW1ib2wgPSBjb25maWcuc2VsZWN0ZWRTeW1ib2w7XHJcblx0XHQvKnZhciBzeW1ib2xzID0ga28ub2JzZXJ2YWJsZUFycmF5KFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkdvb2dsZVwiLFxyXG5cdFx0XHRcdHZhbHVlOiBcIlNZTUJPTDFcIlxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGFiZWw6IFwiQXBwbGVcIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wyXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIlZlcnppb25cIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wzXCJcclxuXHRcdFx0fVxyXG5cdFx0XSk7Ki9cclxuXHJcblx0XHR2YXIgc2VsZWN0ZWRJZHggPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cclxuXHRcdHZhciBsb2FkQ2hhcnQgPSB7XHJcblx0XHRcdGxhYmVsOiBcIlNlbGVjdFwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IGxvY2F0aW9uLmhhc2ggKyBcIi9cIiArIHNlbGVjdGVkU3ltYm9sKCkudmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkcm9wZG93bkxhYmVsOiBkcm9wZG93bkxhYmVsLFxyXG5cdFx0XHRzeW1ib2xzOiBzeW1ib2xzLFxyXG5cdFx0XHRzZWxlY3RlZFN5bWJvbDogc2VsZWN0ZWRTeW1ib2wsXHJcblx0XHRcdHNlbGVjdGVkSWR4OiBzZWxlY3RlZElkeCxcclxuXHRcdFx0bG9hZENoYXJ0OiBsb2FkQ2hhcnRcclxuXHRcdH07XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGRyb3Bkb3duTGFiZWxcIj48L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRcdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkU3ltYm9sLFxcblx0XHRcdGl0ZW1zOiBzeW1ib2xzLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBzZWxlY3RlZElkeCxcXG5cdFx0XHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnXFxuXHRcdFwiPlxcblx0XHQ8L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IGxvYWRDaGFydC5sYWJlbCxcXG5cdFx0Y2xpY2s6IGxvYWRDaGFydC5jbGlja1xcblx0XCI+XFxuXHQ8L2tub2ItYnV0dG9uPlxcbjwvZGl2Plxcbic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNoYXJ0Q2hvb3NlckNvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydENob29zZXJDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLnNlcmllc1VybCAmJiB0eXBlb2YgY29uZmlnLnNlcmllc1VybCAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VyaWVzVXJsIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLmRpdklkICYmIHR5cGVvZiBjb25maWcuZGl2SWQgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmRpdklkIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLmJhc2VSb3V0ZSAmJiB0eXBlb2YgY29uZmlnLmJhc2VSb3V0ZSAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYmFzZVJvdXRlIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnNlbGVjdGVkU3ltYm9sICYmIHR5cGVvZiBjb25maWcuc2VsZWN0ZWRTeW1ib2wgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VsZWN0ZWRTeW1ib2wgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHQvL3ZhciBjaGFydFVybCA9IGNvbmZpZy51cmw7XHJcblx0XHR2YXIgc2VsZWN0ZWRTeW1ib2wgPSBjb25maWcuc2VsZWN0ZWRTeW1ib2w7XHJcblx0XHR2YXIgZGl2SWQgPSBjb25maWcuZGl2SWQ7XHJcblx0XHR2YXIgc2VyaWVzVXJsID0gY29uZmlnLnNlcmllc1VybDtcclxuXHRcdHZhciBiYXNlUm91dGUgPSBjb25maWcuYmFzZVJvdXRlO1xyXG5cclxuXHRcdHZhciBjaGFydFVybCA9IFwiLi9cIiArIHNlcmllc1VybCArIFwiL1wiICsgc2VsZWN0ZWRTeW1ib2woKS5sYWJlbCgpO1xyXG5cclxuXHRcdHZhciBjaGFydCA9IGMzLmdlbmVyYXRlKHtcclxuXHRcdFx0YmluZHRvOiBcIiNcIiArIGRpdklkLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0Ly94OiBcInRlc3RTZXJpZXNcIixcclxuXHRcdFx0XHQvL3hGb3JtYXQ6IFwiJVktJW0tJWQgJUg6JU06JVNcIixcclxuXHRcdFx0XHR1cmw6IGNoYXJ0VXJsLFxyXG5cdFx0XHRcdG1pbWVUeXBlOiBcImpzb25cIixcclxuXHRcdFx0XHQvKmdyb3VwczogW1xyXG5cdFx0XHRcdFx0W1wiSFVGL1VTRFwiXVxyXG5cdFx0XHRcdF0sKi9cclxuXHRcdFx0XHRrZXlzOiB7XHJcblx0XHRcdFx0XHR4OiBcInRpbWVcIixcclxuXHRcdFx0XHRcdHZhbHVlOiBbc2VsZWN0ZWRTeW1ib2woKS5sYWJlbCgpXVxyXG5cdFx0XHRcdFx0Ly94Rm9ybWF0OiBcIiVZLSVtLSVkICVIOiVNOiVTXCJcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRheGlzOiB7XHJcblx0XHRcdFx0eToge1xyXG5cdFx0XHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXCJQcmljZVwiLFxyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogXCJvdXRlci1taWRkbGVcIlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0eDoge1xyXG5cdFx0XHRcdFx0dHlwZTogXCJ0aW1lc2VyaWVzXCIsXHJcblx0XHRcdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBcIlRpbWVcIixcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IFwibWlkZGxlXCJcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHR0aWNrOiB7XHJcblx0XHRcdFx0XHRcdGZvcm1hdDogXCIlWS0lbS0lZCAlSDolTTolU1wiLCAvL1wiJU06JVNcIixcclxuXHRcdFx0XHRcdFx0Y3VsbGluZzoge1xyXG5cdFx0XHRcdFx0XHRcdG1heDogN1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR6b29tOiB7XHJcblx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcclxuXHRcdFx0XHRyZXNjYWxlOiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciB6b29tQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJUZXN0IFpvb21cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRjaGFydC56b29tKFtcclxuXHRcdFx0XHRcdFx0XCIyMDE2LTEwLTAyIDE3OjA0OjE3XCIsXHJcblx0XHRcdFx0XHRcdFwiMjAxNi0xMC0wMiAxNzowNzoyMVwiXSk7XHJcblx0XHRcdFx0fSwgMjAwMCk7XHJcblx0XHRcdFx0Ly9jaGFydC5sb2FkKGNoYXJ0VXJsKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgcmVzZXRCdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIlJlc2V0IENoYXJ0XCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjaGFydC51bnpvb20oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGNoYXJ0OiBjaGFydCxcclxuXHRcdFx0ZGl2SWQ6IGRpdklkLFxyXG5cdFx0XHRyZXNldEJ1dHRvbjogcmVzZXRCdXR0b24sXHJcblx0XHRcdHpvb21CdXR0b246IHpvb21CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxkaXYgZGF0YS1iaW5kPSBcImF0dHI6IHtcXG5cdGlkOiBkaXZJZFxcblx0fVwiPjwvZGl2Plxcblx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRsYWJlbDogem9vbUJ1dHRvbi5sYWJlbCxcXG5cdFx0Y2xpY2s6IHpvb21CdXR0b24uY2xpY2tcIj5cdFx0XFxuXHQ8L2tub2ItYnV0dG9uPlxcblx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRsYWJlbDogcmVzZXRCdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiByZXNldEJ1dHRvbi5jbGlja1xcblx0XCI+PC9rbm9iLWJ1dHRvbj5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBjaGFydENvbXBvbmVudENvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydENvbXBvbmVudENvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0aWYoIWRlcGVuZGVuY2llcykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5XCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gY3JlYXRlTG9naW5TdXJmYWNlKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy51c2VyICYmIHR5cGVvZiBjb25maWcudXNlciAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy51c2VyIGlzIG1hbmRhdG9yeSBhbmQgaXQgc2hvdWxkIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHVzZXIgPSBjb25maWcudXNlcjtcclxuXHRcdHZhciBsb2dpbkxhYmVsID0gY29uZmlnLmxvZ2luTGFiZWw7XHJcblx0XHR2YXIgbWVudSA9IGNvbmZpZy5tZW51O1xyXG5cclxuXHRcdHZhciB1c2VySW5wdXQgPSB7XHJcblx0XHRcdHBsYWNlaG9sZGVyOiBcIlVzZXJcIixcclxuXHRcdFx0dmFsdWU6IGtvLm9ic2VydmFibGUobnVsbClcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHBhc3N3b3JkSW5wdXQgPSB7XHJcblx0XHRcdHBsYWNlaG9sZGVyOiBcIlBhc3N3b3JkXCIsXHJcblx0XHRcdHZhbHVlOiBrby5vYnNlcnZhYmxlKG51bGwpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2dpbkJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiTG9naW5cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciB1c2VyUGFyYW1zID0gXCJ1c2VyPVwiICsgdXNlcklucHV0LnZhbHVlKCkgKyBcIiZwYXNzPVwiICsgcGFzc3dvcmRJbnB1dC52YWx1ZSgpO1xyXG5cdFx0XHRcdHZhciBwb3N0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG5cdFx0XHRcdHBvc3Qub3BlbihcIlBPU1RcIiwgXCIuL2xvZ2lucmVxdWVzdFwiLCB0cnVlKTtcclxuXHJcblx0XHRcdFx0cG9zdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgIFx0XHRcdFx0aWYocG9zdC5yZWFkeVN0YXRlID09IDQgJiYgcG9zdC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgXHRcdFx0XHRjb25zb2xlLmxvZyhwb3N0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgXHRcdFx0XHR1c2VyKEpTT04ucGFyc2UocG9zdC5yZXNwb25zZVRleHQpKTtcclxuICAgICAgICBcdFx0XHRcdG1lbnVbMF0udmlzaWJsZShmYWxzZSk7XHJcbiAgICAgICAgXHRcdFx0XHRtZW51WzFdLnZpc2libGUodHJ1ZSk7XHJcbiAgICAgICAgXHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gXCIvdXNlcnMvXCIgKyB1c2VyKCkudXNlck5hbWU7XHJcbiAgICBcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHBvc3Quc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcclxuXHRcdFx0XHRwb3N0LnNlbmQodXNlclBhcmFtcyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0dXNlcklucHV0OiB1c2VySW5wdXQsXHJcblx0XHRcdHBhc3N3b3JkSW5wdXQ6IHBhc3N3b3JkSW5wdXQsXHJcblx0XHRcdGxvZ2luQnV0dG9uOiBsb2dpbkJ1dHRvblxyXG5cdFx0fTtcclxuXHR9O1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdHZhbHVlOiB1c2VySW5wdXQudmFsdWUsXFxuXHRcdHBsYWNlaG9sZGVyOiB1c2VySW5wdXQucGxhY2Vob2xkZXJcXG5cdFwiPjwva25vYi1pbnB1dD5cXG48L2Rpdj5cXG48ZGl2Plxcblx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdHZhbHVlOiBwYXNzd29yZElucHV0LnZhbHVlLFxcblx0XHRwbGFjZWhvbGRlcjogcGFzc3dvcmRJbnB1dC5wbGFjZWhvbGRlcixcXG5cdFx0dHlwZTogXFwncGFzc3dvcmRcXCdcXG5cdFwiPjwva25vYi1pbnB1dD5cXG48L2Rpdj5cXG48ZGl2Plxcblx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRsYWJlbDogbG9naW5CdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiBsb2dpbkJ1dHRvbi5jbGlja1xcblx0XCI+PC9rbm9iLWJ1dHRvbj5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBsb2dpblN1cmZhY2VDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbG9naW5TdXJmYWNlQ29yZSh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtub2IgPSAod2luZG93Lmtub2IpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwiY2hhcnQtY2hvb3NlclwiLCByZXF1aXJlKFwiLi9jaGFydENob29zZXIvdm1cIiksIHJlcXVpcmUoXCIuL2NoYXJ0Q2hvb3Nlci90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwicHJvZmlsZS1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vcHJvZmlsZUNvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vcHJvZmlsZUNvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwidHJhZGVyLWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi90cmFkZXJDb21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwibG9naW4tc3VyZmFjZVwiLCByZXF1aXJlKFwiLi9sb2dpblN1cmZhY2Uvdm1cIiksIHJlcXVpcmUoXCIuL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwiY2hhcnQtY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL2NoYXJ0Q29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwibWFpbi1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vbWFpbkNvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbml0OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRpZighZGVwZW5kZW5jaWVzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0Y29uc3QgYmFzZVJvdXRlID0gXCJsb2NhbGhvc3Q6ODg4OFwiO1xyXG5cdFx0Y29uc3Qgc2VyaWVzUXVlcnlVcmwgPSBcIi9zZXJpZXNOYW1lc1wiO1xyXG5cdFx0Y29uc3QgYWxnb3JpdGhtUXVlcnlVcmwgPSBcIi4vYWxnb3JpdGhtTmFtZXNcIjtcclxuXHRcdGNvbnN0IHNlcmllc1VybCA9IFwiZGF0YVBvaW50c1wiO1xyXG5cdFx0Y29uc3QgcnVuQWxnb3JpdGhtID0gXCIuL3J1bkFsZ29yaXRobVwiO1xyXG5cclxuXHRcdGxldCBzeW1ib2xzID0ge1xyXG5cdFx0XHRjaGFydENob29zZXI6IGtvLm9ic2VydmFibGVBcnJheShbXSksXHJcblx0XHRcdHRyYWRlckNvbXBvbmVudDoga28ub2JzZXJ2YWJsZUFycmF5KFtdKVxyXG5cdFx0fTtcclxuXHRcdGxldCBzZWxlY3RlZFN5bWJvbCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblxyXG5cdFx0bGV0IGFsZ29yaXRobXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xyXG5cdFx0bGV0IHNlbGVjdGVkQWxnb3JpdGhtID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHJcblx0XHRrby5jb21wdXRlZCgoKSA9PiB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHNlbGVjdGVkU3ltYm9sKCkpXHJcblx0XHR9KVxyXG5cclxuXHRcdGxldCBnZXRTZXJpZXMgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdGdldFNlcmllcy5vcGVuKFwiR0VUXCIsIHNlcmllc1F1ZXJ5VXJsKTtcclxuXHRcdGdldFNlcmllcy5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRcdGlmKGdldFNlcmllcy5yZWFkeVN0YXRlID09IDQgJiYgZ2V0U2VyaWVzLnN0YXR1cyA9PSAyMDApIHtcclxuXHRcdFx0XHRsZXQgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UoZ2V0U2VyaWVzLnJlc3BvbnNlVGV4dCk7XHJcblxyXG5cdFx0XHRcdEpTT04ucGFyc2UocGFyc2VkRGF0YS5yZXN1bHQpLmZvckVhY2goKHNlcmllcykgPT4ge1xyXG5cdFx0XHRcdFx0c3ltYm9scy5jaGFydENob29zZXIucHVzaCh7XHJcblx0XHRcdFx0XHRcdGxhYmVsOiBzZXJpZXMsXHJcblx0XHRcdFx0XHRcdHZhbHVlOiBzZXJpZXMudG9VcHBlckNhc2UoKVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRzeW1ib2xzLnRyYWRlckNvbXBvbmVudC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0bGFiZWw6IHNlcmllcyxcclxuXHRcdFx0XHRcdFx0dmFsdWU6IHNlcmllcy50b1VwcGVyQ2FzZSgpXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Y29uc29sZS5sb2coc3ltYm9scy5jaGFydENob29zZXIoKSk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coc3ltYm9scy50cmFkZXJDb21wb25lbnQoKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRnZXRTZXJpZXMuc2VuZChudWxsKTtcclxuXHJcblx0XHRsZXQgZ2V0QWxnb3JpdGhtcyA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0Z2V0QWxnb3JpdGhtcy5vcGVuKFwiR0VUXCIsIGFsZ29yaXRobVF1ZXJ5VXJsKTtcclxuXHRcdGdldEFsZ29yaXRobXMub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xyXG5cdFx0XHRpZihnZXRBbGdvcml0aG1zLnJlYWR5U3RhdGUgPT0gNCAmJiBnZXRBbGdvcml0aG1zLnN0YXR1cyA9PSAyMDApIHtcclxuXHRcdFx0XHRsZXQgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UoZ2V0QWxnb3JpdGhtcy5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdGFsZ29yaXRobXMocGFyc2VkRGF0YS5yZXN1bHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Z2V0QWxnb3JpdGhtcy5zZW5kKG51bGwpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU1lbnVJdGVtKGxhYmVsLCB1cmwpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRsYWJlbDogbGFiZWwsXHJcblx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0dmlzaWJsZToga28ub2JzZXJ2YWJsZSh0cnVlKSxcclxuXHRcdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZih1c2VyKCkgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IFwiIy9sb2dpblwiO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmKHVzZXIoKSAhPT0gbnVsbCAmJiBsYWJlbCA9PT0gXCJNeSBQb3J0Zm9saW9cIikge1xyXG5cdFx0XHRcdFx0XHR1cmwgPSBcIiMvdXNlcnMvXCIgKyB1c2VyKCkudXNlck5hbWU7XHJcblx0XHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSB1cmw7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gdXJsO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBtZW51ID0gW1xyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIkxvZ2luXCIsIFwiIy9sb2dpblwiKSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkxvZ291dFwiLFxyXG5cdFx0XHRcdHVybDogXCIjL2xvZ2luXCIsXHJcblx0XHRcdFx0dmlzaWJsZToga28ub2JzZXJ2YWJsZShmYWxzZSksXHJcblx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dXNlcihudWxsKTtcclxuXHRcdFx0XHRcdG1lbnVbMF0udmlzaWJsZSh0cnVlKTtcclxuXHRcdFx0XHRcdG1lbnVbMV0udmlzaWJsZShmYWxzZSk7XHJcblx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gXCIjL2xvZ2luXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIk15IFBvcnRmb2xpb1wiLCBcIiMvdXNlcnMvOnByb2ZpbGVJZFwiKSwgLy90aGluayBhYm91dCBzb2x1dGlvbiBmb3IgbG9nZ2VkIGluIHByb2ZpbGVzXHJcblx0XHRcdGNyZWF0ZU1lbnVJdGVtKFwiVHJhZGVcIiwgXCIjL3RyYWRlXCIpLFxyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIkNoYXJ0c1wiLCBcIiMvY2hhcnRzXCIpXHJcblx0XHRdO1xyXG5cclxuXHRcdHZhciByZXNvdXJjZSA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblx0XHR2YXIgc3ltYm9sID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHRcdHZhciB1c2VyID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHJcblx0XHRTYW1teShmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5nZXQoXCIjL2xvZ2luXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwibG9naW5cIik7XHJcblx0XHRcdFx0c3ltYm9sKG51bGwpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc291cmNlKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy91c2Vycy86cHJvZmlsZUlkXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwicHJvZmlsZVwiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL3RyYWRlXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwidHJhZGVcIik7XHJcblx0XHRcdFx0c3ltYm9sKG51bGwpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc291cmNlKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy9jaGFydHNcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJjaGFydHNcIik7XHJcblx0XHRcdFx0c3ltYm9sKG51bGwpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc291cmNlKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy9jaGFydHMvOnN5bWJvbFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzeW1ib2wodGhpcy5wYXJhbXMuc3ltYm9sKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcImEgY2hhcnQgc2hvdWxkIGJlIGhlcmUgd2l0aDogXCIgKyBzeW1ib2woKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCJcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJSb290IGxvbFwiKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5ydW4oKTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtZW51OiBtZW51LFxyXG5cdFx0XHRyZXNvdXJjZTogcmVzb3VyY2UsXHJcblx0XHRcdHN5bWJvbDogc3ltYm9sLFxyXG5cdFx0XHRzZWxlY3RlZFN5bWJvbDogc2VsZWN0ZWRTeW1ib2wsXHJcblx0XHRcdHN5bWJvbHM6IHN5bWJvbHMsXHJcblx0XHRcdGJhc2VSb3V0ZTogYmFzZVJvdXRlLFxyXG5cdFx0XHR1c2VyOiB1c2VyLFxyXG5cdFx0XHRzZXJpZXNRdWVyeVVybDogc2VyaWVzUXVlcnlVcmwsXHJcblx0XHRcdHNlcmllc1VybDogc2VyaWVzVXJsXHJcblx0XHR9O1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJtZW51XCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogeyBkYXRhOiBtZW51LCBhczogXFwnbWVudUl0ZW1cXCd9XCI+XFxuICAgIDxzcGFuPlxcbiAgICBcdDxrbm9iLWJ1dHRvbiBjbGFzcz1cIm1lbnUtaXRlbVwiIGRhdGEtYmluZD1cInZpc2libGU6IG1lbnVJdGVtLnZpc2libGVcIiBwYXJhbXM9XCJcXG4gICAgXHRcdGxhYmVsOiBtZW51SXRlbS5sYWJlbCxcXG4gICAgXHRcdGNsaWNrOiBtZW51SXRlbS5jbGlja1xcbiAgICBcdFwiPjwva25vYi1idXR0b24+XFxuICAgIDwvc3Bhbj5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBudWxsXCI+XFxuXHQ8aDEgZGF0YS1iaW5kPVwidGV4dDogXFwnV2VsY29tZSB0byB0aGUgVmlydHVhbCBTdG9jayBNYXJrZXQhXFwnXCI+PC9oMT5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdsb2dpblxcJyB8fCB1c2VyKCkgPT09IG51bGxcIj5cXG5cdDxsb2dpbi1zdXJmYWNlIHBhcmFtcz1cIlxcblx0XHR1c2VyOiB1c2VyLFxcblx0XHRtZW51OiBtZW51XFxuXHRcIj48L2xvZ2luLXN1cmZhY2U+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwncHJvZmlsZVxcJyAmJiB1c2VyKCkgIT09IG51bGxcIj5cXG5cdDxwcm9maWxlLWNvbXBvbmVudCBwYXJhbXM9XCJcXG5cdFx0bmFtZTogXFwnRGVmdWFsdCBVc2VyXFwnLFxcblx0XHRwcm9maWxlUGljdHVyZVVybDogXFwnaHR0cDovL3d3dy5tdWtlc2hhbWJhbmkuY29tL3Bob3RvL2RlZmF1bHQuanBnXFwnLFxcblx0XHRiYWxhbmNlOiAxMDAwMCxcXG5cdFx0dXNlcjogdXNlclxcblx0XCI+PC9wcm9maWxlLWNvbXBvbmVudD5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCd0cmFkZVxcJyAmJiB1c2VyKCkgIT0gbnVsbFwiPlxcblx0PHRyYWRlci1jb21wb25lbnQgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXIsXFxuICAgIHN5bWJvbHM6IHN5bWJvbHMudHJhZGVyQ29tcG9uZW50XFxuXHRcIj48L3RyYWRlci1jb21wb25lbnQ+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwnY2hhcnRzXFwnICYmIHN5bWJvbCgpID09IG51bGwgJiYgdXNlcigpICE9PSBudWxsXCI+XFxuXHQ8Y2hhcnQtY2hvb3NlciBwYXJhbXM9XCJcXG5cdFx0dXNlcjogdXNlcixcXG5cdFx0YmFzZVJvdXRlOiBiYXNlUm91dGUsXFxuICAgIHN5bWJvbHM6IHN5bWJvbHMuY2hhcnRDaG9vc2VyLFxcbiAgICBzZWxlY3RlZFN5bWJvbDogc2VsZWN0ZWRTeW1ib2xcXG5cdFwiPjwvY2hhcnQtY2hvb3Nlcj5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdjaGFydHNcXCcgJiYgc3ltYm9sKCkgIT0gbnVsbCAmJiB1c2VyKCkgIT0gbnVsbFwiPlxcblx0PGNoYXJ0LWNvbXBvbmVudCBwYXJhbXM9XCJcXG5cdFx0XHR1c2VyOiB1c2VyLFxcblx0XHRcdHNlcmllc1VybDogc2VyaWVzVXJsLFxcblx0XHRcdGRpdklkOiBcXCdjaGFydFxcJyxcXG4gICAgICBiYXNlUm91dGU6IGJhc2VSb3V0ZSxcXG4gICAgICBzZWxlY3RlZFN5bWJvbDogc2VsZWN0ZWRTeW1ib2xcXG5cdFx0XCI+PC9jaGFydC1jb21wb25lbnQ+XFxuPC9kaXY+XFxuJzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY3JlYXRlTWFpbkNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZU1haW5Db21wb25lbnQoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcubmFtZSAmJiB0eXBlb2YgY29uZmlnLm5hbWUgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm5hbWUgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBzdHJpbmchXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcucHJvZmlsZVBpY3R1cmVVcmwgJiYgdHlwZW9mIGNvbmZpZy5wcm9maWxlUGljdHVyZVVybCAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcucHJvZmlsZVBpY3R1cmVVcmwgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBzdHJpbmchXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcuYmFsYW5jZSAmJiB0eXBlb2YgY29uZmlnLmJhbGFuY2UgIT09IFwibnVtYmVyXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJhbGFuY2UgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBudW1iZXIhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBuYW1lID0gY29uZmlnLm5hbWU7XHJcblx0XHR2YXIgcHJvZmlsZVBpY3R1cmVVcmwgPSBjb25maWcucHJvZmlsZVBpY3R1cmVVcmw7XHJcblx0XHR2YXIgYmFsYW5jZSA9IGNvbmZpZy5iYWxhbmNlO1xyXG5cdFx0dmFyIHVzZXIgPSBjb25maWcudXNlciB8fCBmdW5jdGlvbigpIHt9OyAvL2ZpeCB0aGlzLCB0ZW1wb3JhcnlcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lOiBuYW1lLFxyXG5cdFx0XHRwcm9maWxlUGljdHVyZVVybDogcHJvZmlsZVBpY3R1cmVVcmwsXHJcblx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXHJcblx0XHRcdHVzZXI6IHVzZXJcclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGRpdj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogXFwnVXNlcm5hbWU6IFxcJyArIHVzZXIoKS5uYW1lXCI+PC9zcGFuPlxcblx0XHQ8aW1nIGRhdGEtYmluZD1cImF0dHI6IHtzcmM6IHVzZXIoKS5wcm9maWxlVXJsLCBoZWlnaHQ6IDEwMCwgd2lkdGg6IDEwMH1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogXFwnQmFsYW5jZTogXFwnICsgdXNlcigpLmJhbGFuY2UgKyBcXCckXFwnXCI+PC9zcGFuPlxcblx0PC9kaXY+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY3JlYXRlUHJvZmlsZUNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVByb2ZpbGVDb21wb25lbnQoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcudXNlciAmJiB0eXBlb2YgY29uZmlnLnVzZXIgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXNlciBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcuc3ltYm9scyAmJiB0eXBlb2YgY29uZmlnLnN5bWJvbHMgIT09IFwiYXJyYXlcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc3ltYm9scyBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhbiBhcnJheSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHVzZXIgPSBjb25maWcudXNlcjtcclxuXHRcdHZhciBzeW1ib2xzID0gY29uZmlnLnN5bWJvbHM7XHJcblxyXG5cdFx0Y29uc3QgaGVhZGVyID0gXCJUcmFkZVwiO1xyXG5cdFx0Y29uc3Qgc3ltYm9sTGFiZWwgPSBcIlN5bWJvbCBcIjtcclxuXHRcdGNvbnN0IHRyYW5zYWN0aW9uTGFiZWwgPSBcIlRyYW5zYWN0aW9uIFwiO1xyXG5cdFx0Y29uc3QgdHJhbnNhY3Rpb25RdWFudGl0eSA9IFwiUXVhbnRpdHkgXCI7XHJcblxyXG5cdFx0dmFyIHN5bWJvbHNEcm9wZG93biA9IHtcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2w6IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdHNlbGVjdGVkU3ltYm9sSWR4OiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzeW1ib2xzOiBzeW1ib2xzXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBxdWFudGl0eSA9IGtvLm9ic2VydmFibGUoMCk7XHJcblxyXG5cdFx0dmFyIG9wdGlvbnNEcm9wZG93biA9IHtcclxuXHRcdFx0c2VsZWN0ZWRPcHRpb246IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdHNlbGVjdGVkT3B0aW9uSWR4OiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRvcHRpb25zIDoga28ub2JzZXJ2YWJsZUFycmF5KFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJCdXlcIixcclxuXHRcdFx0XHRcdHZhbHVlOiBcImJ1eVwiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJTZWxsXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJzZWxsXCJcclxuXHRcdFx0XHR9XHJcblx0XHRcdF0pXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciB0cmFuc2FjdGlvbkJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiTWFrZSB0cmFuc2FjdGlvblwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJBdHRlbXB0aW5nIHRvIFwiICsgb3B0aW9uc0Ryb3Bkb3duLnNlbGVjdGVkT3B0aW9uKCkudmFsdWUgK1xyXG5cdFx0XHRcdCBcIiBcIiArIHF1YW50aXR5KCkgKyBcIiBzdG9ja3NcIiArXHJcblx0XHRcdFx0IFwiIGZyb20gXCIgKyBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2woKS5sYWJlbCgpICsgXCIgd2l0aCB0aGUgc3ltYm9sOiBcIiArXHJcblx0XHRcdFx0ICBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2woKS52YWx1ZSk7XHJcblxyXG5cdFx0XHRcdHZhciBwb3N0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdFx0IHBvc3Qub3BlbihcIlBPU1RcIiwgXCIuL3RyYW5zYWN0aW9uXCIsIHRydWUpO1xyXG5cclxuXHRcdFx0XHQgcG9zdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQgXHRpZihwb3N0LnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgJiYgcG9zdC5zdGF0dXMgPT09IDIwMCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlJFU1BPTlNFXCIsIHBvc3QucmVzcG9uc2VUZXh0KTtcclxuXHRcdFx0XHRcdFx0bGV0IHJlc3BvbnNlT2JqZWN0ID0gSlNPTi5wYXJzZShwb3N0LnJlc3BvbnNlVGV4dCk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZighcmVzcG9uc2VPYmplY3Qub2spIHtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZU9iamVjdC5lcnJvcik7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dXNlcihyZXNwb25zZU9iamVjdC5yZXN1bHQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0IFx0fVxyXG5cdFx0XHRcdCB9XHJcblxyXG5cdFx0XHRcdCBwb3N0LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG5cdFx0XHRcdCBwb3N0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRcdFx0IHVzZXI6IHVzZXIoKS51c2VyTmFtZSxcclxuXHRcdFx0XHRcdCB0cmFuc2FjdGlvblR5cGU6IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbigpLnZhbHVlLFxyXG5cdFx0XHRcdFx0IHF1YW50aXR5OiBxdWFudGl0eSgpLFxyXG5cdFx0XHRcdFx0IHNlcmllc05hbWU6IHN5bWJvbHNEcm9wZG93bi5zZWxlY3RlZFN5bWJvbCgpLmxhYmVsKClcclxuXHRcdFx0XHQgfSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGhlYWRlcjogaGVhZGVyLFxyXG5cdFx0XHRzeW1ib2xMYWJlbDogc3ltYm9sTGFiZWwsXHJcblx0XHRcdHRyYW5zYWN0aW9uTGFiZWw6IHRyYW5zYWN0aW9uTGFiZWwsXHJcblx0XHRcdHRyYW5zYWN0aW9uUXVhbnRpdHk6IHRyYW5zYWN0aW9uUXVhbnRpdHksXHJcblx0XHRcdHN5bWJvbHNEcm9wZG93bjogc3ltYm9sc0Ryb3Bkb3duLFxyXG5cdFx0XHRvcHRpb25zRHJvcGRvd246IG9wdGlvbnNEcm9wZG93bixcclxuXHRcdFx0dHJhbnNhY3Rpb25CdXR0b246IHRyYW5zYWN0aW9uQnV0dG9uLFxyXG5cdFx0XHRxdWFudGl0eTogcXVhbnRpdHlcclxuXHRcdH07XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxoMiBkYXRhLWJpbmQ9XCJ0ZXh0OiBoZWFkZXJcIj48L2gyPlxcblx0PHNwYW4+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHN5bWJvbExhYmVsXCI+PC9zcGFuPlxcblx0XHQ8a25vYi1kcm9wZG93biBwYXJhbXM9XCJcXG5cdFx0XHRzZWxlY3RlZDogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sLFxcblx0XHRcdGl0ZW1zOiBzeW1ib2xzRHJvcGRvd24uc3ltYm9scyxcXG5cdFx0XHRzZWxlY3RlZElkeDogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sSWR4LFxcblx0XHRcdHJpZ2h0SWNvbjogXFwnI2ljb24tZXhwYW5kLW1vcmVcXCdcXG5cdFx0XCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRyYW5zYWN0aW9uTGFiZWxcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdHNlbGVjdGVkOiBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb24sXFxuXHRcdFx0aXRlbXM6IG9wdGlvbnNEcm9wZG93bi5vcHRpb25zLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb25JZHgsXFxuXHRcdFx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJ1xcblx0XHRcIj48L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdHJhbnNhY3Rpb25RdWFudGl0eVwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdFx0dmFsdWU6IHF1YW50aXR5XFxuXHRcdFwiPjwva25vYi1pbnB1dD5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdFx0bGFiZWw6IHRyYW5zYWN0aW9uQnV0dG9uLmxhYmVsLFxcblx0XHRcdGNsaWNrOiB0cmFuc2FjdGlvbkJ1dHRvbi5jbGlja1xcblx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0PC9zcGFuPlxcbjwvZGl2Plxcbic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIHRyYWRlckNvbXBvbmVudENvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0cmFkZXJDb21wb25lbnRDb3JlKHtcclxuXHRrbzoga29cclxufSk7Il19
