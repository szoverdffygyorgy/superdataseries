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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q2hvb3Nlci9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvY2hhcnRDaG9vc2VyL3ZtLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL2NvcmUuanMiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2Uvdm0uanMiLCJzcmMvcHVibGljL21haW4uanMiLCJzcmMvcHVibGljL21haW5Db21wb25lbnQvY29yZS5qcyIsInNyYy9wdWJsaWMvbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9tYWluQ29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9wcm9maWxlQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvcHJvZmlsZUNvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvdHJhZGVyQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy90cmFkZXJDb21wb25lbnQvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLmJhc2VSb3V0ZSAmJiB0eXBlb2YgY29uZmlnLmJhc2VSb3V0ZSAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYmFzZVJvdXRlIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnN5bWJvbHMgJiYgdHlwZW9mIGNvbmZpZy5zeW1ib2xzICE9PSBcImFycmF5XCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN5bWJvbHMgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYW4gYXJyYXkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcuc2VsZWN0ZWRTeW1ib2wgJiYgdHlwZW9mIGNvbmZpZy5zZWxlY3RlZFN5bWJvbCAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zZWxlY3RlZFN5bWJvbCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGRyb3Bkb3duTGFiZWwgPSBcIlN0b2NrczogXCI7XHJcblx0XHRjb25zdCBiYXNlUm91dGUgPSBjb25maWcuYmFzZVJvdXRlO1xyXG5cdFx0Y29uc3Qgc2VyaWVzUXVlcnlVcmwgPSBjb25maWcuc2VyaWVzUXVlcnlVcmw7XHJcblx0XHRsZXQgc3ltYm9scyA9IGNvbmZpZy5zeW1ib2xzO1xyXG5cdFx0bGV0IHNlbGVjdGVkU3ltYm9sID0gY29uZmlnLnNlbGVjdGVkU3ltYm9sO1xyXG5cdFx0Lyp2YXIgc3ltYm9scyA9IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJHb29nbGVcIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wxXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkFwcGxlXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MMlwiXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJWZXJ6aW9uXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MM1wiXHJcblx0XHRcdH1cclxuXHRcdF0pOyovXHJcblxyXG5cdFx0dmFyIHNlbGVjdGVkSWR4ID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHJcblx0XHR2YXIgbG9hZENoYXJ0ID0ge1xyXG5cdFx0XHRsYWJlbDogXCJTZWxlY3RcIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSBsb2NhdGlvbi5oYXNoICsgXCIvXCIgKyBzZWxlY3RlZFN5bWJvbCgpLnZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZHJvcGRvd25MYWJlbDogZHJvcGRvd25MYWJlbCxcclxuXHRcdFx0c3ltYm9sczogc3ltYm9scyxcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2w6IHNlbGVjdGVkU3ltYm9sLFxyXG5cdFx0XHRzZWxlY3RlZElkeDogc2VsZWN0ZWRJZHgsXHJcblx0XHRcdGxvYWRDaGFydDogbG9hZENoYXJ0XHJcblx0XHR9O1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBkcm9wZG93bkxhYmVsXCI+PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdHNlbGVjdGVkOiBzZWxlY3RlZFN5bWJvbCxcXG5cdFx0XHRpdGVtczogc3ltYm9scyxcXG5cdFx0XHRzZWxlY3RlZElkeDogc2VsZWN0ZWRJZHgsXFxuXHRcdFx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJ1xcblx0XHRcIj5cXG5cdFx0PC9rbm9iLWRyb3Bkb3duPlxcblx0PC9zcGFuPlxcbjwvZGl2PlxcbjxkaXY+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiBsb2FkQ2hhcnQubGFiZWwsXFxuXHRcdGNsaWNrOiBsb2FkQ2hhcnQuY2xpY2tcXG5cdFwiPlxcblx0PC9rbm9iLWJ1dHRvbj5cXG48L2Rpdj5cXG4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBjaGFydENob29zZXJDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRDaG9vc2VyQ29yZSh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRkZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMgfHwge307XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5zZXJpZXNVcmwgJiYgdHlwZW9mIGNvbmZpZy5zZXJpZXNVcmwgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlcmllc1VybCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5kaXZJZCAmJiB0eXBlb2YgY29uZmlnLmRpdklkICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5kaXZJZCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5iYXNlUm91dGUgJiYgdHlwZW9mIGNvbmZpZy5iYXNlUm91dGUgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJhc2VSb3V0ZSBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5zZWxlY3RlZFN5bWJvbCAmJiB0eXBlb2YgY29uZmlnLnNlbGVjdGVkU3ltYm9sICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlbGVjdGVkU3ltYm9sIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly92YXIgY2hhcnRVcmwgPSBjb25maWcudXJsO1xyXG5cdFx0dmFyIHNlbGVjdGVkU3ltYm9sID0gY29uZmlnLnNlbGVjdGVkU3ltYm9sO1xyXG5cdFx0dmFyIGRpdklkID0gY29uZmlnLmRpdklkO1xyXG5cdFx0dmFyIHNlcmllc1VybCA9IGNvbmZpZy5zZXJpZXNVcmw7XHJcblx0XHR2YXIgYmFzZVJvdXRlID0gY29uZmlnLmJhc2VSb3V0ZTtcclxuXHJcblx0XHR2YXIgY2hhcnRVcmwgPSBcIi4vXCIgKyBzZXJpZXNVcmwgKyBcIi9cIiArIHNlbGVjdGVkU3ltYm9sKCkubGFiZWwoKTtcclxuXHJcblx0XHR2YXIgY2hhcnQgPSBjMy5nZW5lcmF0ZSh7XHJcblx0XHRcdGJpbmR0bzogXCIjXCIgKyBkaXZJZCxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdC8veDogXCJ0ZXN0U2VyaWVzXCIsXHJcblx0XHRcdFx0Ly94Rm9ybWF0OiBcIiVZLSVtLSVkICVIOiVNOiVTXCIsXHJcblx0XHRcdFx0dXJsOiBjaGFydFVybCxcclxuXHRcdFx0XHRtaW1lVHlwZTogXCJqc29uXCIsXHJcblx0XHRcdFx0Lypncm91cHM6IFtcclxuXHRcdFx0XHRcdFtcIkhVRi9VU0RcIl1cclxuXHRcdFx0XHRdLCovXHJcblx0XHRcdFx0a2V5czoge1xyXG5cdFx0XHRcdFx0eDogXCJ0aW1lXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogW3NlbGVjdGVkU3ltYm9sKCkubGFiZWwoKV1cclxuXHRcdFx0XHRcdC8veEZvcm1hdDogXCIlWS0lbS0lZCAlSDolTTolU1wiXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSxcclxuXHRcdFx0YXhpczoge1xyXG5cdFx0XHRcdHk6IHtcclxuXHRcdFx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IFwiUHJpY2VcIixcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IFwib3V0ZXItbWlkZGxlXCJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHg6IHtcclxuXHRcdFx0XHRcdHR5cGU6IFwidGltZXNlcmllc1wiLFxyXG5cdFx0XHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXCJUaW1lXCIsXHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiBcIm1pZGRsZVwiXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0dGljazoge1xyXG5cdFx0XHRcdFx0XHRmb3JtYXQ6IFwiJVktJW0tJWQgJUg6JU06JVNcIiwgLy9cIiVNOiVTXCIsXHJcblx0XHRcdFx0XHRcdGN1bGxpbmc6IHtcclxuXHRcdFx0XHRcdFx0XHRtYXg6IDdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0em9vbToge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IHRydWUsXHJcblx0XHRcdFx0cmVzY2FsZTogdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgem9vbUJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiVGVzdCBab29tXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Y2hhcnQuem9vbShbXHJcblx0XHRcdFx0XHRcdFwiMjAxNi0xMC0wMiAxNzowNDoxN1wiLFxyXG5cdFx0XHRcdFx0XHRcIjIwMTYtMTAtMDIgMTc6MDc6MjFcIl0pO1xyXG5cdFx0XHRcdH0sIDIwMDApO1xyXG5cdFx0XHRcdC8vY2hhcnQubG9hZChjaGFydFVybCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHJlc2V0QnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJSZXNldCBDaGFydFwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y2hhcnQudW56b29tKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRjaGFydDogY2hhcnQsXHJcblx0XHRcdGRpdklkOiBkaXZJZCxcclxuXHRcdFx0cmVzZXRCdXR0b246IHJlc2V0QnV0dG9uLFxyXG5cdFx0XHR6b29tQnV0dG9uOiB6b29tQnV0dG9uXHJcblx0XHR9O1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8ZGl2IGRhdGEtYmluZD0gXCJhdHRyOiB7XFxuXHRpZDogZGl2SWRcXG5cdH1cIj48L2Rpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHpvb21CdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiB6b29tQnV0dG9uLmNsaWNrXCI+XHRcdFxcblx0PC9rbm9iLWJ1dHRvbj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHJlc2V0QnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogcmVzZXRCdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY2hhcnRDb21wb25lbnRDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRDb21wb25lbnRDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGlmKCFkZXBlbmRlbmNpZXMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUxvZ2luU3VyZmFjZShjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcudXNlciAmJiB0eXBlb2YgY29uZmlnLnVzZXIgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXNlciBpcyBtYW5kYXRvcnkgYW5kIGl0IHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXI7XHJcblx0XHR2YXIgbG9naW5MYWJlbCA9IGNvbmZpZy5sb2dpbkxhYmVsO1xyXG5cdFx0dmFyIG1lbnUgPSBjb25maWcubWVudTtcclxuXHJcblx0XHR2YXIgdXNlcklucHV0ID0ge1xyXG5cdFx0XHRwbGFjZWhvbGRlcjogXCJVc2VyXCIsXHJcblx0XHRcdHZhbHVlOiBrby5vYnNlcnZhYmxlKG51bGwpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBwYXNzd29yZElucHV0ID0ge1xyXG5cdFx0XHRwbGFjZWhvbGRlcjogXCJQYXNzd29yZFwiLFxyXG5cdFx0XHR2YWx1ZToga28ub2JzZXJ2YWJsZShudWxsKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9naW5CdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIkxvZ2luXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgdXNlclBhcmFtcyA9IFwidXNlcj1cIiArIHVzZXJJbnB1dC52YWx1ZSgpICsgXCImcGFzcz1cIiArIHBhc3N3b3JkSW5wdXQudmFsdWUoKTtcclxuXHRcdFx0XHR2YXIgcG9zdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuXHRcdFx0XHRwb3N0Lm9wZW4oXCJQT1NUXCIsIFwiLi9sb2dpbnJlcXVlc3RcIiwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRcdHBvc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcdFx0XHRcdGlmKHBvc3QucmVhZHlTdGF0ZSA9PSA0ICYmIHBvc3Quc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2cocG9zdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIFx0XHRcdFx0dXNlcihKU09OLnBhcnNlKHBvc3QucmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgXHRcdFx0XHRtZW51WzBdLnZpc2libGUoZmFsc2UpO1xyXG4gICAgICAgIFx0XHRcdFx0bWVudVsxXS52aXNpYmxlKHRydWUpO1xyXG4gICAgICAgIFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IFwiL3VzZXJzL1wiICsgdXNlcigpLnVzZXJOYW1lO1xyXG4gICAgXHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRwb3N0LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XHJcblx0XHRcdFx0cG9zdC5zZW5kKHVzZXJQYXJhbXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHVzZXJJbnB1dDogdXNlcklucHV0LFxyXG5cdFx0XHRwYXNzd29yZElucHV0OiBwYXNzd29yZElucHV0LFxyXG5cdFx0XHRsb2dpbkJ1dHRvbjogbG9naW5CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHR2YWx1ZTogdXNlcklucHV0LnZhbHVlLFxcblx0XHRwbGFjZWhvbGRlcjogdXNlcklucHV0LnBsYWNlaG9sZGVyXFxuXHRcIj48L2tub2ItaW5wdXQ+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHR2YWx1ZTogcGFzc3dvcmRJbnB1dC52YWx1ZSxcXG5cdFx0cGxhY2Vob2xkZXI6IHBhc3N3b3JkSW5wdXQucGxhY2Vob2xkZXIsXFxuXHRcdHR5cGU6IFxcJ3Bhc3N3b3JkXFwnXFxuXHRcIj48L2tub2ItaW5wdXQ+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IGxvZ2luQnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogbG9naW5CdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgbG9naW5TdXJmYWNlQ29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ2luU3VyZmFjZUNvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbm9iID0gKHdpbmRvdy5rbm9iKTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImNoYXJ0LWNob29zZXJcIiwgcmVxdWlyZShcIi4vY2hhcnRDaG9vc2VyL3ZtXCIpLCByZXF1aXJlKFwiLi9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcInByb2ZpbGUtY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL3Byb2ZpbGVDb21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcInRyYWRlci1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vdHJhZGVyQ29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi90cmFkZXJDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImxvZ2luLXN1cmZhY2VcIiwgcmVxdWlyZShcIi4vbG9naW5TdXJmYWNlL3ZtXCIpLCByZXF1aXJlKFwiLi9sb2dpblN1cmZhY2UvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImNoYXJ0LWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi9jaGFydENvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vY2hhcnRDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcIm1haW4tY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL21haW5Db21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL21haW5Db21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5pdDsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0aWYoIWRlcGVuZGVuY2llcykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGNvbnN0IGJhc2VSb3V0ZSA9IFwibG9jYWxob3N0Ojg4ODhcIjtcclxuXHRcdGNvbnN0IHNlcmllc1F1ZXJ5VXJsID0gXCIvc2VyaWVzTmFtZXNcIjtcclxuXHRcdGNvbnN0IGFsZ29yaXRobVF1ZXJ5VXJsID0gXCIuL2FsZ29yaXRobU5hbWVzXCI7XHJcblx0XHRjb25zdCBzZXJpZXNVcmwgPSBcImRhdGFQb2ludHNcIjtcclxuXHRcdGNvbnN0IHJ1bkFsZ29yaXRobSA9IFwiLi9ydW5BbGdvcml0aG1cIjtcclxuXHJcblx0XHRsZXQgc3ltYm9scyA9IHtcclxuXHRcdFx0Y2hhcnRDaG9vc2VyOiBrby5vYnNlcnZhYmxlQXJyYXkoW10pLFxyXG5cdFx0XHR0cmFkZXJDb21wb25lbnQ6IGtvLm9ic2VydmFibGVBcnJheShbXSlcclxuXHRcdH07XHJcblx0XHRsZXQgc2VsZWN0ZWRTeW1ib2wgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cclxuXHRcdGxldCBhbGdvcml0aG1zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcclxuXHRcdGxldCBzZWxlY3RlZEFsZ29yaXRobSA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblxyXG5cdFx0a28uY29tcHV0ZWQoKCkgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhzZWxlY3RlZFN5bWJvbCgpKVxyXG5cdFx0fSlcclxuXHJcblx0XHRsZXQgZ2V0U2VyaWVzID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRnZXRTZXJpZXMub3BlbihcIkdFVFwiLCBzZXJpZXNRdWVyeVVybCk7XHJcblx0XHRnZXRTZXJpZXMub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xyXG5cdFx0XHRpZihnZXRTZXJpZXMucmVhZHlTdGF0ZSA9PSA0ICYmIGdldFNlcmllcy5zdGF0dXMgPT0gMjAwKSB7XHJcblx0XHRcdFx0bGV0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKGdldFNlcmllcy5yZXNwb25zZVRleHQpO1xyXG5cclxuXHRcdFx0XHRKU09OLnBhcnNlKHBhcnNlZERhdGEucmVzdWx0KS5mb3JFYWNoKChzZXJpZXMpID0+IHtcclxuXHRcdFx0XHRcdHN5bWJvbHMuY2hhcnRDaG9vc2VyLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRsYWJlbDogc2VyaWVzLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZTogc2VyaWVzLnRvVXBwZXJDYXNlKClcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0c3ltYm9scy50cmFkZXJDb21wb25lbnQucHVzaCh7XHJcblx0XHRcdFx0XHRcdGxhYmVsOiBzZXJpZXMsXHJcblx0XHRcdFx0XHRcdHZhbHVlOiBzZXJpZXMudG9VcHBlckNhc2UoKVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHN5bWJvbHMuY2hhcnRDaG9vc2VyKCkpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHN5bWJvbHMudHJhZGVyQ29tcG9uZW50KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Z2V0U2VyaWVzLnNlbmQobnVsbCk7XHJcblxyXG5cdFx0bGV0IGdldEFsZ29yaXRobXMgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdGdldEFsZ29yaXRobXMub3BlbihcIkdFVFwiLCBhbGdvcml0aG1RdWVyeVVybCk7XHJcblx0XHRnZXRBbGdvcml0aG1zLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcclxuXHRcdFx0aWYoZ2V0QWxnb3JpdGhtcy5yZWFkeVN0YXRlID09IDQgJiYgZ2V0QWxnb3JpdGhtcy5zdGF0dXMgPT0gMjAwKSB7XHJcblx0XHRcdFx0bGV0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKGdldEFsZ29yaXRobXMucmVzcG9uc2VUZXh0KTtcclxuXHRcdFx0XHRhbGdvcml0aG1zKHBhcnNlZERhdGEucmVzdWx0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGdldEFsZ29yaXRobXMuc2VuZChudWxsKTtcclxuXHJcblx0XHRmdW5jdGlvbiBjcmVhdGVNZW51SXRlbShsYWJlbCwgdXJsKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bGFiZWw6IGxhYmVsLFxyXG5cdFx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRcdHZpc2libGU6IGtvLm9ic2VydmFibGUodHJ1ZSksXHJcblx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYodXNlcigpID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSBcIiMvbG9naW5cIjtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZih1c2VyKCkgIT09IG51bGwgJiYgbGFiZWwgPT09IFwiTXkgUG9ydGZvbGlvXCIpIHtcclxuXHRcdFx0XHRcdFx0dXJsID0gXCIjL3VzZXJzL1wiICsgdXNlcigpLnVzZXJOYW1lO1xyXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gdXJsO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IHVybDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbWVudSA9IFtcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJMb2dpblwiLCBcIiMvbG9naW5cIiksXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJMb2dvdXRcIixcclxuXHRcdFx0XHR1cmw6IFwiIy9sb2dpblwiLFxyXG5cdFx0XHRcdHZpc2libGU6IGtvLm9ic2VydmFibGUoZmFsc2UpLFxyXG5cdFx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHVzZXIobnVsbCk7XHJcblx0XHRcdFx0XHRtZW51WzBdLnZpc2libGUodHJ1ZSk7XHJcblx0XHRcdFx0XHRtZW51WzFdLnZpc2libGUoZmFsc2UpO1xyXG5cdFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IFwiIy9sb2dpblwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJNeSBQb3J0Zm9saW9cIiwgXCIjL3VzZXJzLzpwcm9maWxlSWRcIiksIC8vdGhpbmsgYWJvdXQgc29sdXRpb24gZm9yIGxvZ2dlZCBpbiBwcm9maWxlc1xyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIlRyYWRlXCIsIFwiIy90cmFkZVwiKSxcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJDaGFydHNcIiwgXCIjL2NoYXJ0c1wiKVxyXG5cdFx0XTtcclxuXHJcblx0XHR2YXIgcmVzb3VyY2UgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cdFx0dmFyIHN5bWJvbCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblx0XHR2YXIgdXNlciA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblxyXG5cdFx0U2FtbXkoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuZ2V0KFwiIy9sb2dpblwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcImxvZ2luXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvdXNlcnMvOnByb2ZpbGVJZFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcInByb2ZpbGVcIik7XHJcblx0XHRcdFx0c3ltYm9sKG51bGwpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc291cmNlKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy90cmFkZVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcInRyYWRlXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvY2hhcnRzXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwiY2hhcnRzXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvY2hhcnRzLzpzeW1ib2xcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3ltYm9sKHRoaXMucGFyYW1zLnN5bWJvbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJhIGNoYXJ0IHNob3VsZCBiZSBoZXJlIHdpdGg6IFwiICsgc3ltYm9sKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUm9vdCBsb2xcIik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSkucnVuKCk7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bWVudTogbWVudSxcclxuXHRcdFx0cmVzb3VyY2U6IHJlc291cmNlLFxyXG5cdFx0XHRzeW1ib2w6IHN5bWJvbCxcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2w6IHNlbGVjdGVkU3ltYm9sLFxyXG5cdFx0XHRzeW1ib2xzOiBzeW1ib2xzLFxyXG5cdFx0XHRiYXNlUm91dGU6IGJhc2VSb3V0ZSxcclxuXHRcdFx0dXNlcjogdXNlcixcclxuXHRcdFx0c2VyaWVzUXVlcnlVcmw6IHNlcmllc1F1ZXJ5VXJsLFxyXG5cdFx0XHRzZXJpZXNVcmw6IHNlcmllc1VybFxyXG5cdFx0fTtcclxuXHR9O1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwibWVudVwiIGRhdGEtYmluZD1cImZvcmVhY2g6IHsgZGF0YTogbWVudSwgYXM6IFxcJ21lbnVJdGVtXFwnfVwiPlxcbiAgICA8c3Bhbj5cXG4gICAgXHQ8a25vYi1idXR0b24gY2xhc3M9XCJtZW51LWl0ZW1cIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBtZW51SXRlbS52aXNpYmxlXCIgcGFyYW1zPVwiXFxuICAgIFx0XHRsYWJlbDogbWVudUl0ZW0ubGFiZWwsXFxuICAgIFx0XHRjbGljazogbWVudUl0ZW0uY2xpY2tcXG4gICAgXHRcIj48L2tub2ItYnV0dG9uPlxcbiAgICA8L3NwYW4+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gbnVsbFwiPlxcblx0PGgxIGRhdGEtYmluZD1cInRleHQ6IFxcJ1dlbGNvbWUgdG8gdGhlIFZpcnR1YWwgU3RvY2sgTWFya2V0IVxcJ1wiPjwvaDE+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwnbG9naW5cXCcgfHwgdXNlcigpID09PSBudWxsXCI+XFxuXHQ8bG9naW4tc3VyZmFjZSBwYXJhbXM9XCJcXG5cdFx0dXNlcjogdXNlcixcXG5cdFx0bWVudTogbWVudVxcblx0XCI+PC9sb2dpbi1zdXJmYWNlPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ3Byb2ZpbGVcXCcgJiYgdXNlcigpICE9PSBudWxsXCI+XFxuXHQ8cHJvZmlsZS1jb21wb25lbnQgcGFyYW1zPVwiXFxuXHRcdG5hbWU6IFxcJ0RlZnVhbHQgVXNlclxcJyxcXG5cdFx0cHJvZmlsZVBpY3R1cmVVcmw6IFxcJ2h0dHA6Ly93d3cubXVrZXNoYW1iYW5pLmNvbS9waG90by9kZWZhdWx0LmpwZ1xcJyxcXG5cdFx0YmFsYW5jZTogMTAwMDAsXFxuXHRcdHVzZXI6IHVzZXJcXG5cdFwiPjwvcHJvZmlsZS1jb21wb25lbnQ+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwndHJhZGVcXCcgJiYgdXNlcigpICE9IG51bGxcIj5cXG5cdDx0cmFkZXItY29tcG9uZW50IHBhcmFtcz1cIlxcblx0XHR1c2VyOiB1c2VyLFxcbiAgICBzeW1ib2xzOiBzeW1ib2xzLnRyYWRlckNvbXBvbmVudFxcblx0XCI+PC90cmFkZXItY29tcG9uZW50PlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2NoYXJ0c1xcJyAmJiBzeW1ib2woKSA9PSBudWxsICYmIHVzZXIoKSAhPT0gbnVsbFwiPlxcblx0PGNoYXJ0LWNob29zZXIgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXIsXFxuXHRcdGJhc2VSb3V0ZTogYmFzZVJvdXRlLFxcbiAgICBzeW1ib2xzOiBzeW1ib2xzLmNoYXJ0Q2hvb3NlcixcXG4gICAgc2VsZWN0ZWRTeW1ib2w6IHNlbGVjdGVkU3ltYm9sXFxuXHRcIj48L2NoYXJ0LWNob29zZXI+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwnY2hhcnRzXFwnICYmIHN5bWJvbCgpICE9IG51bGwgJiYgdXNlcigpICE9IG51bGxcIj5cXG5cdDxjaGFydC1jb21wb25lbnQgcGFyYW1zPVwiXFxuXHRcdFx0dXNlcjogdXNlcixcXG5cdFx0XHRzZXJpZXNVcmw6IHNlcmllc1VybCxcXG5cdFx0XHRkaXZJZDogXFwnY2hhcnRcXCcsXFxuICAgICAgYmFzZVJvdXRlOiBiYXNlUm91dGUsXFxuICAgICAgc2VsZWN0ZWRTeW1ib2w6IHNlbGVjdGVkU3ltYm9sXFxuXHRcdFwiPjwvY2hhcnQtY29tcG9uZW50PlxcbjwvZGl2Plxcbic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNyZWF0ZU1haW5Db21wb25lbnQgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVNYWluQ29tcG9uZW50KHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLm5hbWUgJiYgdHlwZW9mIGNvbmZpZy5uYW1lICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5uYW1lIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsICYmIHR5cGVvZiBjb25maWcucHJvZmlsZVBpY3R1cmVVcmwgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLmJhbGFuY2UgJiYgdHlwZW9mIGNvbmZpZy5iYWxhbmNlICE9PSBcIm51bWJlclwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5iYWxhbmNlIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgbnVtYmVyIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbmFtZSA9IGNvbmZpZy5uYW1lO1xyXG5cdFx0dmFyIHByb2ZpbGVQaWN0dXJlVXJsID0gY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsO1xyXG5cdFx0dmFyIGJhbGFuY2UgPSBjb25maWcuYmFsYW5jZTtcclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXIgfHwgZnVuY3Rpb24oKSB7fTsgLy9maXggdGhpcywgdGVtcG9yYXJ5XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZTogbmFtZSxcclxuXHRcdFx0cHJvZmlsZVBpY3R1cmVVcmw6IHByb2ZpbGVQaWN0dXJlVXJsLFxyXG5cdFx0XHRiYWxhbmNlOiBiYWxhbmNlLFxyXG5cdFx0XHR1c2VyOiB1c2VyXHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxkaXY+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IFxcJ1VzZXJuYW1lOiBcXCcgKyB1c2VyKCkubmFtZVwiPjwvc3Bhbj5cXG5cdFx0PGltZyBkYXRhLWJpbmQ9XCJhdHRyOiB7c3JjOiB1c2VyKCkucHJvZmlsZVVybCwgaGVpZ2h0OiAxMDAsIHdpZHRoOiAxMDB9XCI+XFxuXHQ8L2Rpdj5cXG5cdDxkaXY+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IFxcJ0JhbGFuY2U6IFxcJyArIHVzZXIoKS5iYWxhbmNlICsgXFwnJFxcJ1wiPjwvc3Bhbj5cXG5cdDwvZGl2PlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNyZWF0ZVByb2ZpbGVDb21wb25lbnQgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVQcm9maWxlQ29tcG9uZW50KHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLnVzZXIgJiYgdHlwZW9mIGNvbmZpZy51c2VyICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnVzZXIgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnN5bWJvbHMgJiYgdHlwZW9mIGNvbmZpZy5zeW1ib2xzICE9PSBcImFycmF5XCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN5bWJvbHMgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYW4gYXJyYXkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXI7XHJcblx0XHR2YXIgc3ltYm9scyA9IGNvbmZpZy5zeW1ib2xzO1xyXG5cclxuXHRcdGNvbnN0IGhlYWRlciA9IFwiVHJhZGVcIjtcclxuXHRcdGNvbnN0IHN5bWJvbExhYmVsID0gXCJTeW1ib2wgXCI7XHJcblx0XHRjb25zdCB0cmFuc2FjdGlvbkxhYmVsID0gXCJUcmFuc2FjdGlvbiBcIjtcclxuXHRcdGNvbnN0IHRyYW5zYWN0aW9uUXVhbnRpdHkgPSBcIlF1YW50aXR5IFwiO1xyXG5cclxuXHRcdHZhciBzeW1ib2xzRHJvcGRvd24gPSB7XHJcblx0XHRcdHNlbGVjdGVkU3ltYm9sOiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzZWxlY3RlZFN5bWJvbElkeDoga28ub2JzZXJ2YWJsZShudWxsKSxcclxuXHRcdFx0c3ltYm9sczogc3ltYm9sc1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgcXVhbnRpdHkgPSBrby5vYnNlcnZhYmxlKDApO1xyXG5cclxuXHRcdHZhciBvcHRpb25zRHJvcGRvd24gPSB7XHJcblx0XHRcdHNlbGVjdGVkT3B0aW9uOiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzZWxlY3RlZE9wdGlvbklkeDoga28ub2JzZXJ2YWJsZShudWxsKSxcclxuXHRcdFx0b3B0aW9ucyA6IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiQnV5XCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJidXlcIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiU2VsbFwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwic2VsbFwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgdHJhbnNhY3Rpb25CdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIk1ha2UgdHJhbnNhY3Rpb25cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiQXR0ZW1wdGluZyB0byBcIiArIG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbigpLnZhbHVlICtcclxuXHRcdFx0XHQgXCIgXCIgKyBxdWFudGl0eSgpICsgXCIgc3RvY2tzXCIgK1xyXG5cdFx0XHRcdCBcIiBmcm9tIFwiICsgc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkubGFiZWwoKSArIFwiIHdpdGggdGhlIHN5bWJvbDogXCIgK1xyXG5cdFx0XHRcdCAgc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkudmFsdWUpO1xyXG5cclxuXHRcdFx0XHR2YXIgcG9zdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHRcdCBwb3N0Lm9wZW4oXCJQT1NUXCIsIFwiLi90cmFuc2FjdGlvblwiLCB0cnVlKTtcclxuXHJcblx0XHRcdFx0IHBvc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0IFx0aWYocG9zdC5yZWFkeVN0YXRlID09IDQsIHBvc3Quc3RhdHVzID09IDIwMCkge1xyXG5cdFx0XHRcdFx0XHRsZXQgcmVzcG9uc2VPYmplY3QgPSBKU09OLnBhcnNlKHBvc3QucmVzcG9uc2VUZXh0KTtcclxuXHJcblx0XHRcdFx0XHRcdGlmKCFyZXNwb25zZU9iamVjdC5vaykge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlT2JqZWN0LmVycm9yKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR1c2VyKHJlc3BvbnNlT2JqZWN0LnJlc3VsdCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHQgXHR9XHJcblx0XHRcdFx0IH1cclxuXHJcblx0XHRcdFx0IHBvc3Quc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcblx0XHRcdFx0IHBvc3Quc2VuZChKU09OLnN0cmluZ2lmeSh7XHJcblx0XHRcdFx0XHQgdXNlcjogdXNlcigpLnVzZXJOYW1lLFxyXG5cdFx0XHRcdFx0IHRyYW5zYWN0aW9uVHlwZTogb3B0aW9uc0Ryb3Bkb3duLnNlbGVjdGVkT3B0aW9uKCkudmFsdWUsXHJcblx0XHRcdFx0XHQgcXVhbnRpdHk6IHF1YW50aXR5KCksXHJcblx0XHRcdFx0XHQgc2VyaWVzTmFtZTogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkubGFiZWwoKVxyXG5cdFx0XHRcdCB9KSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aGVhZGVyOiBoZWFkZXIsXHJcblx0XHRcdHN5bWJvbExhYmVsOiBzeW1ib2xMYWJlbCxcclxuXHRcdFx0dHJhbnNhY3Rpb25MYWJlbDogdHJhbnNhY3Rpb25MYWJlbCxcclxuXHRcdFx0dHJhbnNhY3Rpb25RdWFudGl0eTogdHJhbnNhY3Rpb25RdWFudGl0eSxcclxuXHRcdFx0c3ltYm9sc0Ryb3Bkb3duOiBzeW1ib2xzRHJvcGRvd24sXHJcblx0XHRcdG9wdGlvbnNEcm9wZG93bjogb3B0aW9uc0Ryb3Bkb3duLFxyXG5cdFx0XHR0cmFuc2FjdGlvbkJ1dHRvbjogdHJhbnNhY3Rpb25CdXR0b24sXHJcblx0XHRcdHF1YW50aXR5OiBxdWFudGl0eVxyXG5cdFx0fTtcclxuXHR9O1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGgyIGRhdGEtYmluZD1cInRleHQ6IGhlYWRlclwiPjwvaDI+XFxuXHQ8c3Bhbj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogc3ltYm9sTGFiZWxcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdHNlbGVjdGVkOiBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2wsXFxuXHRcdFx0aXRlbXM6IHN5bWJvbHNEcm9wZG93bi5zeW1ib2xzLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2xJZHgsXFxuXHRcdFx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJ1xcblx0XHRcIj48L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdHJhbnNhY3Rpb25MYWJlbFwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRcdFx0c2VsZWN0ZWQ6IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbixcXG5cdFx0XHRpdGVtczogb3B0aW9uc0Ryb3Bkb3duLm9wdGlvbnMsXFxuXHRcdFx0c2VsZWN0ZWRJZHg6IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbklkeCxcXG5cdFx0XHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnXFxuXHRcdFwiPjwva25vYi1kcm9wZG93bj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuPlxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0cmFuc2FjdGlvblF1YW50aXR5XCI+PC9zcGFuPlxcblx0XHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJcXG5cdFx0XHR2YWx1ZTogcXVhbnRpdHlcXG5cdFx0XCI+PC9rbm9iLWlucHV0Plxcblx0PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRsYWJlbDogdHJhbnNhY3Rpb25CdXR0b24ubGFiZWwsXFxuXHRcdFx0Y2xpY2s6IHRyYW5zYWN0aW9uQnV0dG9uLmNsaWNrXFxuXHRcdFwiPjwva25vYi1idXR0b24+XFxuXHQ8L3NwYW4+XFxuPC9kaXY+XFxuJzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgdHJhZGVyQ29tcG9uZW50Q29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRyYWRlckNvbXBvbmVudENvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiXX0=
