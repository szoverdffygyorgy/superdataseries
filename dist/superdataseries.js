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
			throw new Error("dependencies.baseRoute is mandatory and should be a string!");
		}

		const baseRoute = config.baseRoute;
		
		const dropdownLabel = "Stocks: ";
		var symbols = ko.observableArray([
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
		]);

		var selected = ko.observable(null);
		var selectedIdx = ko.observable(null);

		var loadChart = {
			label: "Select",
			click: function() {
				location.hash = location.hash + "/" + selected().value
			}
		}

		return {
			dropdownLabel: dropdownLabel,
			symbols: symbols,
			selected: selected,
			selectedIdx: selectedIdx,
			loadChart: loadChart
		};
	};
};
},{}],2:[function(require,module,exports){
module.exports = '<div>\n	<span data-bind="text: dropdownLabel">\n	</span>\n	<span>\n		<knob-dropdown params="\n			selected: selected,\n			items: symbols,\n			selectedIdx: selectedIdx,\n			rightIcon: \'#icon-expand-more\'\n		">\n		</knob-dropdown>\n	</span>\n</div>\n<div>\n	<knob-button params="\n		label: loadChart.label,\n		click: loadChart.click\n	">\n	</knob-button>\n</div>';
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

		if(!config.url) {
			throw new Error("config.url is mandatory!");
		}

		if(!config.divId) {
			throw new Error("config.divId is mandatory!");
		}

		var chartUrl = config.url;
		var divId = config.divId;

		var chart = c3.generate({
			bindto: "#" + divId,
			data: {
				x: "x",
				xFormat: "%Y-%m-%d %H:%M:%S",
				mimeType: "csv",
				url: chartUrl,
				groups: [
					["HUF/USD"]
				],
				keys: {
					xFormat: "%Y-%m-%d %H:%M:%S"
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
						format: "%M:%S"
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

		var userInput = {
			placeholder: "UserName",
			value: ko.observable(null)
		};

		var passwordInput = {
			placeholder: "password",
			value: ko.observable(null)
		};

		var loginButton = {
			label: "Login",
			click: function() {
				console.log(userInput.value() + " attempting to log in with password: " + passwordInput.value());
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

		function createMenuItem(label, url) {
			return {
				label: label,
				url: url,
				click: function() {
					location.hash = url;
				}
			}
		}

		var menu = [
			createMenuItem("Login", "#/login"),
			createMenuItem("My Portfolio", "#/profile"),
			createMenuItem("Trade", "#/trade"),
			createMenuItem("Charts", "#/charts")
		];

		var resource = ko.observable(null);
		var symbol = ko.observable(null);

		Sammy(function() {
			this.get("#/login", function() {
				resource("login");
				symbol(null);
				console.log(resource());
			});

			this.get("#/profile", function() {
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
			baseRoute: baseRoute
		};
	};
};
},{}],12:[function(require,module,exports){
module.exports = '<div class="menu" data-bind="foreach: { data: menu, as: \'menuItem\'}">\n    <span>\n    	<knob-button class="menu-item" params="\n    		label: menuItem.label,\n    		click: menuItem.click\n    	"></knob-button>\n    </span>\n</div>\n<div data-bind="if: resource() === null">\n	<h1 data-bind="text: \'Welcome to the Virtual Stock Market!\'"></h1>\n</div>\n<div data-bind="if: resource() === \'login\'">\n	<login-surface></login-surface>\n</div>\n<div data-bind="if: resource() === \'profile\'">\n	<profile-component params="\n		name: \'Defualt User\',\n		profilePictureUrl: \'http://www.mukeshambani.com/photo/default.jpg\',\n		balance: 10000\n	"></profile-component>\n</div>\n<div data-bind="if: resource() === \'trade\'">\n	<trader-component></trader-component>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() == null">\n	<chart-chooser params="\n		baseRoute: baseRoute\n	"></chart-chooser>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() != null">\n	<chart-component params="\n			url: \'./chart_data/formatted50\',\n			divId: \'format50\'\n		"></chart-component>\n</div>';
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

		return {
			name: name,
			profilePictureUrl: profilePictureUrl,
			balance: balance
		};
	};
};
},{}],15:[function(require,module,exports){
module.exports = '<div>\n	<div>\n		<span data-bind="text: \'Username: \' + name"></span>\n		<img data-bind="attr: {src: profilePictureUrl, height: 100, width: 100}">\n	</div>\n	<div>\n		<span data-bind="text: \'Balance: \' + balance + \'$\'"></span>\n	</div>\n</div>';
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
},{}],18:[function(require,module,exports){
module.exports = '<div>\n	<h2 data-bind="text: header"></h2>\n	<span>\n		<span data-bind="text: symbolLabel"></span>\n		<knob-dropdown params="\n			selected: symbolsDropdown.selectedSymbol,\n			items: symbolsDropdown.symbols,\n			selectedIdx: symbolsDropdown.selectedSymbolIdx,\n			rightIcon: \'#icon-expand-more\'\n		"></knob-dropdown>\n	</span>\n	<span>\n		<span data-bind="text: transactionLabel"></span>\n		<knob-dropdown params="\n			selected: optionsDropdown.selectedOption,\n			items: optionsDropdown.options,\n			selectedIdx: optionsDropdown.selectedOptionIdx,\n			rightIcon: \'#icon-expand-more\'\n		"></knob-dropdown>\n	</span>\n	<span>\n		<span data-bind="text: transactionQuantity"></span>\n		<knob-input params="\n			value: transactionValue\n		"></knob-input>\n	</span>\n	<span>\n		<knob-button params="\n			label: transactionButton.label,\n			click: transactionButton.click\n		"></knob-button>\n	</span>\n</div>';
},{}],19:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var traderComponentCore = require("./core");

module.exports = traderComponentCore({
	ko: ko
});
},{"./core":17}]},{},[10])(10)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q2hvb3Nlci9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvY2hhcnRDaG9vc2VyL3ZtLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL2NvcmUuanMiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2Uvdm0uanMiLCJzcmMvcHVibGljL21haW4uanMiLCJzcmMvcHVibGljL21haW5Db21wb25lbnQvY29yZS5qcyIsInNyYy9wdWJsaWMvbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9tYWluQ29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9wcm9maWxlQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvcHJvZmlsZUNvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvdHJhZGVyQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy90cmFkZXJDb21wb25lbnQvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcuYmFzZVJvdXRlICYmIHR5cGVvZiBjb25maWcuYmFzZVJvdXRlICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5iYXNlUm91dGUgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBzdHJpbmchXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGJhc2VSb3V0ZSA9IGNvbmZpZy5iYXNlUm91dGU7XHJcblx0XHRcclxuXHRcdGNvbnN0IGRyb3Bkb3duTGFiZWwgPSBcIlN0b2NrczogXCI7XHJcblx0XHR2YXIgc3ltYm9scyA9IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJHb29nbGVcIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wxXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkFwcGxlXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MMlwiXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJWZXJ6aW9uXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MM1wiXHJcblx0XHRcdH1cclxuXHRcdF0pO1xyXG5cclxuXHRcdHZhciBzZWxlY3RlZCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblx0XHR2YXIgc2VsZWN0ZWRJZHggPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cclxuXHRcdHZhciBsb2FkQ2hhcnQgPSB7XHJcblx0XHRcdGxhYmVsOiBcIlNlbGVjdFwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IGxvY2F0aW9uLmhhc2ggKyBcIi9cIiArIHNlbGVjdGVkKCkudmFsdWVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRyb3Bkb3duTGFiZWw6IGRyb3Bkb3duTGFiZWwsXHJcblx0XHRcdHN5bWJvbHM6IHN5bWJvbHMsXHJcblx0XHRcdHNlbGVjdGVkOiBzZWxlY3RlZCxcclxuXHRcdFx0c2VsZWN0ZWRJZHg6IHNlbGVjdGVkSWR4LFxyXG5cdFx0XHRsb2FkQ2hhcnQ6IGxvYWRDaGFydFxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBkcm9wZG93bkxhYmVsXCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRcdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxcblx0XHRcdGl0ZW1zOiBzeW1ib2xzLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBzZWxlY3RlZElkeCxcXG5cdFx0XHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnXFxuXHRcdFwiPlxcblx0XHQ8L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IGxvYWRDaGFydC5sYWJlbCxcXG5cdFx0Y2xpY2s6IGxvYWRDaGFydC5jbGlja1xcblx0XCI+XFxuXHQ8L2tub2ItYnV0dG9uPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNoYXJ0Q2hvb3NlckNvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydENob29zZXJDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLnVybCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXJsIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5kaXZJZCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZGl2SWQgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2hhcnRVcmwgPSBjb25maWcudXJsO1xyXG5cdFx0dmFyIGRpdklkID0gY29uZmlnLmRpdklkO1xyXG5cclxuXHRcdHZhciBjaGFydCA9IGMzLmdlbmVyYXRlKHtcclxuXHRcdFx0YmluZHRvOiBcIiNcIiArIGRpdklkLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0eDogXCJ4XCIsXHJcblx0XHRcdFx0eEZvcm1hdDogXCIlWS0lbS0lZCAlSDolTTolU1wiLFxyXG5cdFx0XHRcdG1pbWVUeXBlOiBcImNzdlwiLFxyXG5cdFx0XHRcdHVybDogY2hhcnRVcmwsXHJcblx0XHRcdFx0Z3JvdXBzOiBbXHJcblx0XHRcdFx0XHRbXCJIVUYvVVNEXCJdXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRrZXlzOiB7XHJcblx0XHRcdFx0XHR4Rm9ybWF0OiBcIiVZLSVtLSVkICVIOiVNOiVTXCJcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRheGlzOiB7XHJcblx0XHRcdFx0eToge1xyXG5cdFx0XHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXCJQcmljZVwiLFxyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogXCJvdXRlci1taWRkbGVcIlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0eDoge1xyXG5cdFx0XHRcdFx0dHlwZTogXCJ0aW1lc2VyaWVzXCIsXHJcblx0XHRcdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBcIlRpbWVcIixcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IFwibWlkZGxlXCJcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHR0aWNrOiB7XHJcblx0XHRcdFx0XHRcdGZvcm1hdDogXCIlTTolU1wiXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR6b29tOiB7XHJcblx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcclxuXHRcdFx0XHRyZXNjYWxlOiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciB6b29tQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJUZXN0IFpvb21cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRjaGFydC56b29tKFtcclxuXHRcdFx0XHRcdFx0XCIyMDE2LTEwLTAyIDE3OjA0OjE3XCIsXHJcblx0XHRcdFx0XHRcdFwiMjAxNi0xMC0wMiAxNzowNzoyMVwiXSk7XHJcblx0XHRcdFx0fSwgMjAwMCk7XHJcblx0XHRcdFx0Ly9jaGFydC5sb2FkKGNoYXJ0VXJsKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgcmVzZXRCdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIlJlc2V0IENoYXJ0XCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjaGFydC51bnpvb20oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGNoYXJ0OiBjaGFydCxcclxuXHRcdFx0ZGl2SWQ6IGRpdklkLFxyXG5cdFx0XHRyZXNldEJ1dHRvbjogcmVzZXRCdXR0b24sXHJcblx0XHRcdHpvb21CdXR0b246IHpvb21CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGRpdiBkYXRhLWJpbmQ9IFwiYXR0cjoge1xcblx0aWQ6IGRpdklkXFxuXHR9XCI+PC9kaXY+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiB6b29tQnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogem9vbUJ1dHRvbi5jbGlja1wiPlx0XHRcXG5cdDwva25vYi1idXR0b24+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiByZXNldEJ1dHRvbi5sYWJlbCxcXG5cdFx0Y2xpY2s6IHJlc2V0QnV0dG9uLmNsaWNrXFxuXHRcIj48L2tub2ItYnV0dG9uPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNoYXJ0Q29tcG9uZW50Q29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0Q29tcG9uZW50Q29yZSh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRpZighZGVwZW5kZW5jaWVzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnlcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiBjcmVhdGVMb2dpblN1cmZhY2UoY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZykge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdXNlcklucHV0ID0ge1xyXG5cdFx0XHRwbGFjZWhvbGRlcjogXCJVc2VyTmFtZVwiLFxyXG5cdFx0XHR2YWx1ZToga28ub2JzZXJ2YWJsZShudWxsKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgcGFzc3dvcmRJbnB1dCA9IHtcclxuXHRcdFx0cGxhY2Vob2xkZXI6IFwicGFzc3dvcmRcIixcclxuXHRcdFx0dmFsdWU6IGtvLm9ic2VydmFibGUobnVsbClcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGxvZ2luQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJMb2dpblwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2codXNlcklucHV0LnZhbHVlKCkgKyBcIiBhdHRlbXB0aW5nIHRvIGxvZyBpbiB3aXRoIHBhc3N3b3JkOiBcIiArIHBhc3N3b3JkSW5wdXQudmFsdWUoKSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0dXNlcklucHV0OiB1c2VySW5wdXQsXHJcblx0XHRcdHBhc3N3b3JkSW5wdXQ6IHBhc3N3b3JkSW5wdXQsXHJcblx0XHRcdGxvZ2luQnV0dG9uOiBsb2dpbkJ1dHRvblxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJcXG5cdFx0dmFsdWU6IHVzZXJJbnB1dC52YWx1ZSxcXG5cdFx0cGxhY2Vob2xkZXI6IHVzZXJJbnB1dC5wbGFjZWhvbGRlclxcblx0XCI+PC9rbm9iLWlucHV0PlxcbjwvZGl2PlxcbjxkaXY+XFxuXHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJcXG5cdFx0dmFsdWU6IHBhc3N3b3JkSW5wdXQudmFsdWUsXFxuXHRcdHBsYWNlaG9sZGVyOiBwYXNzd29yZElucHV0LnBsYWNlaG9sZGVyLFxcblx0XHR0eXBlOiBcXCdwYXNzd29yZFxcJ1xcblx0XCI+PC9rbm9iLWlucHV0PlxcbjwvZGl2PlxcbjxkaXY+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiBsb2dpbkJ1dHRvbi5sYWJlbCxcXG5cdFx0Y2xpY2s6IGxvZ2luQnV0dG9uLmNsaWNrXFxuXHRcIj48L2tub2ItYnV0dG9uPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGxvZ2luU3VyZmFjZUNvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsb2dpblN1cmZhY2VDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga25vYiA9ICh3aW5kb3cua25vYik7XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJjaGFydC1jaG9vc2VyXCIsIHJlcXVpcmUoXCIuL2NoYXJ0Q2hvb3Nlci92bVwiKSwgcmVxdWlyZShcIi4vY2hhcnRDaG9vc2VyL3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJwcm9maWxlLWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi9wcm9maWxlQ29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi9wcm9maWxlQ29tcG9uZW50L3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJ0cmFkZXItY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL3RyYWRlckNvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vdHJhZGVyQ29tcG9uZW50L3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJsb2dpbi1zdXJmYWNlXCIsIHJlcXVpcmUoXCIuL2xvZ2luU3VyZmFjZS92bVwiKSwgcmVxdWlyZShcIi4vbG9naW5TdXJmYWNlL3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJjaGFydC1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vY2hhcnRDb21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL2NoYXJ0Q29tcG9uZW50L3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJtYWluLWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi9tYWluQ29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi9tYWluQ29tcG9uZW50L3RlbXBsYXRlLmh0bWxcIikpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGluaXQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGlmKCFkZXBlbmRlbmNpZXMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH0gXHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0Y29uc3QgYmFzZVJvdXRlID0gXCJsb2NhbGhvc3Q6ODg4OFwiO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU1lbnVJdGVtKGxhYmVsLCB1cmwpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRsYWJlbDogbGFiZWwsXHJcblx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IHVybDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbWVudSA9IFtcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJMb2dpblwiLCBcIiMvbG9naW5cIiksXHJcblx0XHRcdGNyZWF0ZU1lbnVJdGVtKFwiTXkgUG9ydGZvbGlvXCIsIFwiIy9wcm9maWxlXCIpLFxyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIlRyYWRlXCIsIFwiIy90cmFkZVwiKSxcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJDaGFydHNcIiwgXCIjL2NoYXJ0c1wiKVxyXG5cdFx0XTtcclxuXHJcblx0XHR2YXIgcmVzb3VyY2UgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cdFx0dmFyIHN5bWJvbCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblxyXG5cdFx0U2FtbXkoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuZ2V0KFwiIy9sb2dpblwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcImxvZ2luXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvcHJvZmlsZVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcInByb2ZpbGVcIik7XHJcblx0XHRcdFx0c3ltYm9sKG51bGwpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc291cmNlKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy90cmFkZVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcInRyYWRlXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvY2hhcnRzXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwiY2hhcnRzXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvY2hhcnRzLzpzeW1ib2xcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3ltYm9sKHRoaXMucGFyYW1zLnN5bWJvbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJhIGNoYXJ0IHNob3VsZCBiZSBoZXJlIHdpdGg6IFwiICsgc3ltYm9sKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUm9vdCBsb2xcIik7XHJcblx0XHRcdH0pO1x0XHJcblx0XHR9KS5ydW4oKTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtZW51OiBtZW51LFxyXG5cdFx0XHRyZXNvdXJjZTogcmVzb3VyY2UsXHJcblx0XHRcdHN5bWJvbDogc3ltYm9sLFxyXG5cdFx0XHRiYXNlUm91dGU6IGJhc2VSb3V0ZVxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJtZW51XCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogeyBkYXRhOiBtZW51LCBhczogXFwnbWVudUl0ZW1cXCd9XCI+XFxuICAgIDxzcGFuPlxcbiAgICBcdDxrbm9iLWJ1dHRvbiBjbGFzcz1cIm1lbnUtaXRlbVwiIHBhcmFtcz1cIlxcbiAgICBcdFx0bGFiZWw6IG1lbnVJdGVtLmxhYmVsLFxcbiAgICBcdFx0Y2xpY2s6IG1lbnVJdGVtLmNsaWNrXFxuICAgIFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG4gICAgPC9zcGFuPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IG51bGxcIj5cXG5cdDxoMSBkYXRhLWJpbmQ9XCJ0ZXh0OiBcXCdXZWxjb21lIHRvIHRoZSBWaXJ0dWFsIFN0b2NrIE1hcmtldCFcXCdcIj48L2gxPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2xvZ2luXFwnXCI+XFxuXHQ8bG9naW4tc3VyZmFjZT48L2xvZ2luLXN1cmZhY2U+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwncHJvZmlsZVxcJ1wiPlxcblx0PHByb2ZpbGUtY29tcG9uZW50IHBhcmFtcz1cIlxcblx0XHRuYW1lOiBcXCdEZWZ1YWx0IFVzZXJcXCcsXFxuXHRcdHByb2ZpbGVQaWN0dXJlVXJsOiBcXCdodHRwOi8vd3d3Lm11a2VzaGFtYmFuaS5jb20vcGhvdG8vZGVmYXVsdC5qcGdcXCcsXFxuXHRcdGJhbGFuY2U6IDEwMDAwXFxuXHRcIj48L3Byb2ZpbGUtY29tcG9uZW50PlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ3RyYWRlXFwnXCI+XFxuXHQ8dHJhZGVyLWNvbXBvbmVudD48L3RyYWRlci1jb21wb25lbnQ+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwnY2hhcnRzXFwnICYmIHN5bWJvbCgpID09IG51bGxcIj5cXG5cdDxjaGFydC1jaG9vc2VyIHBhcmFtcz1cIlxcblx0XHRiYXNlUm91dGU6IGJhc2VSb3V0ZVxcblx0XCI+PC9jaGFydC1jaG9vc2VyPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2NoYXJ0c1xcJyAmJiBzeW1ib2woKSAhPSBudWxsXCI+XFxuXHQ8Y2hhcnQtY29tcG9uZW50IHBhcmFtcz1cIlxcblx0XHRcdHVybDogXFwnLi9jaGFydF9kYXRhL2Zvcm1hdHRlZDUwXFwnLFxcblx0XHRcdGRpdklkOiBcXCdmb3JtYXQ1MFxcJ1xcblx0XHRcIj48L2NoYXJ0LWNvbXBvbmVudD5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBjcmVhdGVNYWluQ29tcG9uZW50ID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTWFpbkNvbXBvbmVudCh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRkZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMgfHwge307XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5uYW1lICYmIHR5cGVvZiBjb25maWcubmFtZSAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcubmFtZSBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5wcm9maWxlUGljdHVyZVVybCAmJiB0eXBlb2YgY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5wcm9maWxlUGljdHVyZVVybCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5iYWxhbmNlICYmIHR5cGVvZiBjb25maWcuYmFsYW5jZSAhPT0gXCJudW1iZXJcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYmFsYW5jZSBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIG51bWJlciFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG5hbWUgPSBjb25maWcubmFtZTtcclxuXHRcdHZhciBwcm9maWxlUGljdHVyZVVybCA9IGNvbmZpZy5wcm9maWxlUGljdHVyZVVybDtcclxuXHRcdHZhciBiYWxhbmNlID0gY29uZmlnLmJhbGFuY2U7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZTogbmFtZSxcclxuXHRcdFx0cHJvZmlsZVBpY3R1cmVVcmw6IHByb2ZpbGVQaWN0dXJlVXJsLFxyXG5cdFx0XHRiYWxhbmNlOiBiYWxhbmNlXHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxkaXY+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IFxcJ1VzZXJuYW1lOiBcXCcgKyBuYW1lXCI+PC9zcGFuPlxcblx0XHQ8aW1nIGRhdGEtYmluZD1cImF0dHI6IHtzcmM6IHByb2ZpbGVQaWN0dXJlVXJsLCBoZWlnaHQ6IDEwMCwgd2lkdGg6IDEwMH1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogXFwnQmFsYW5jZTogXFwnICsgYmFsYW5jZSArIFxcJyRcXCdcIj48L3NwYW4+XFxuXHQ8L2Rpdj5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBjcmVhdGVQcm9maWxlQ29tcG9uZW50ID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUHJvZmlsZUNvbXBvbmVudCh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRkZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMgfHwge307XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0Y29uc3QgaGVhZGVyID0gXCJUcmFkZVwiO1xyXG5cdFx0Y29uc3Qgc3ltYm9sTGFiZWwgPSBcIlN5bWJvbCBcIjtcclxuXHRcdGNvbnN0IHRyYW5zYWN0aW9uTGFiZWwgPSBcIlRyYW5zYWN0aW9uIFwiO1xyXG5cdFx0Y29uc3QgdHJhbnNhY3Rpb25RdWFudGl0eSA9IFwiUXVhbnRpdHkgXCI7XHJcblxyXG5cdFx0dmFyIHN5bWJvbHNEcm9wZG93biA9IHtcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2w6IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdHNlbGVjdGVkU3ltYm9sSWR4OiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzeW1ib2xzOiBrby5vYnNlcnZhYmxlQXJyYXkoW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxhYmVsOiBcIkdvb2dsZVwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwiR09PR1wiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJBcHBsZVwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwiQUFQTFwiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJWZXJ6aW9uXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJWWlwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgdHJhbnNhY3Rpb25WYWx1ZSA9IGtvLm9ic2VydmFibGUoMCk7XHJcblx0XHRcclxuXHRcdHZhciBvcHRpb25zRHJvcGRvd24gPSB7XHJcblx0XHRcdHNlbGVjdGVkT3B0aW9uOiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzZWxlY3RlZE9wdGlvbklkeDoga28ub2JzZXJ2YWJsZShudWxsKSxcclxuXHRcdFx0b3B0aW9ucyA6IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiQnV5XCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJidXlcIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiU2VsbFwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwic2VsbFwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdKVx0XHRcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHRyYW5zYWN0aW9uQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJNYWtlIHRyYW5zYWN0aW9uXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gXCIgKyBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb24oKS52YWx1ZSArIFwiIFwiICsgdHJhbnNhY3Rpb25WYWx1ZSgpICsgXCIgc3RvY2tzXCIgK1xyXG5cdFx0XHRcdCBcIiBmcm9tIFwiICsgc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkubGFiZWwoKSArIFwiIHdpdGggdGhlIHN5bWJvbDogXCIgKyBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2woKS52YWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aGVhZGVyOiBoZWFkZXIsXHJcblx0XHRcdHN5bWJvbExhYmVsOiBzeW1ib2xMYWJlbCxcclxuXHRcdFx0dHJhbnNhY3Rpb25MYWJlbDogdHJhbnNhY3Rpb25MYWJlbCxcclxuXHRcdFx0dHJhbnNhY3Rpb25RdWFudGl0eTogdHJhbnNhY3Rpb25RdWFudGl0eSxcclxuXHRcdFx0c3ltYm9sc0Ryb3Bkb3duOiBzeW1ib2xzRHJvcGRvd24sXHJcblx0XHRcdG9wdGlvbnNEcm9wZG93bjogb3B0aW9uc0Ryb3Bkb3duLFxyXG5cdFx0XHR0cmFuc2FjdGlvbkJ1dHRvbjogdHJhbnNhY3Rpb25CdXR0b24sXHJcblx0XHRcdHRyYW5zYWN0aW9uVmFsdWU6IHRyYW5zYWN0aW9uVmFsdWVcclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGgyIGRhdGEtYmluZD1cInRleHQ6IGhlYWRlclwiPjwvaDI+XFxuXHQ8c3Bhbj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogc3ltYm9sTGFiZWxcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdHNlbGVjdGVkOiBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2wsXFxuXHRcdFx0aXRlbXM6IHN5bWJvbHNEcm9wZG93bi5zeW1ib2xzLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2xJZHgsXFxuXHRcdFx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJ1xcblx0XHRcIj48L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdHJhbnNhY3Rpb25MYWJlbFwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRcdFx0c2VsZWN0ZWQ6IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbixcXG5cdFx0XHRpdGVtczogb3B0aW9uc0Ryb3Bkb3duLm9wdGlvbnMsXFxuXHRcdFx0c2VsZWN0ZWRJZHg6IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbklkeCxcXG5cdFx0XHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnXFxuXHRcdFwiPjwva25vYi1kcm9wZG93bj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuPlxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0cmFuc2FjdGlvblF1YW50aXR5XCI+PC9zcGFuPlxcblx0XHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJcXG5cdFx0XHR2YWx1ZTogdHJhbnNhY3Rpb25WYWx1ZVxcblx0XHRcIj48L2tub2ItaW5wdXQ+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRcdGxhYmVsOiB0cmFuc2FjdGlvbkJ1dHRvbi5sYWJlbCxcXG5cdFx0XHRjbGljazogdHJhbnNhY3Rpb25CdXR0b24uY2xpY2tcXG5cdFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciB0cmFkZXJDb21wb25lbnRDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdHJhZGVyQ29tcG9uZW50Q29yZSh7XHJcblx0a286IGtvXHJcbn0pOyJdfQ==
