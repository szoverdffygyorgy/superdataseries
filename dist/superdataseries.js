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
		const seriesQueryUrl = "./seriesNames";
		const seriesUrl = "dataPoints";

		let symbols = ko.observableArray([]);
		let selectedSymbol = ko.observable(null);

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
module.exports = '<div class="menu" data-bind="foreach: { data: menu, as: \'menuItem\'}">\n    <span>\n    	<knob-button class="menu-item" data-bind="visible: menuItem.visible" params="\n    		label: menuItem.label,\n    		click: menuItem.click\n    	"></knob-button>\n    </span>\n</div>\n<div data-bind="if: resource() === null">\n	<h1 data-bind="text: \'Welcome to the Virtual Stock Market!\'"></h1>\n</div>\n<div data-bind="if: resource() === \'login\' || user() === null">\n	<login-surface params="\n		user: user,\n		menu: menu\n	"></login-surface>\n</div>\n<div data-bind="if: resource() === \'profile\' && user() !== null">\n	<profile-component params="\n		name: \'Defualt User\',\n		profilePictureUrl: \'http://www.mukeshambani.com/photo/default.jpg\',\n		balance: 10000,\n		user: user\n	"></profile-component>\n</div>\n<div data-bind="if: resource() === \'trade\' && user() != null">\n	<trader-component params="\n		user: user\n	"></trader-component>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() == null && user() !== null">\n	<chart-chooser params="\n		user: user,\n		baseRoute: baseRoute,\n    symbols: symbols,\n    selectedSymbol: selectedSymbol\n	"></chart-chooser>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() != null && user() != null">\n	<chart-component params="\n			user: user,\n			seriesUrl: seriesUrl,\n			divId: \'chart\',\n      baseRoute: baseRoute,\n      selectedSymbol: selectedSymbol\n		"></chart-component>\n</div>\n';
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

		if(config.user === null) {
			throw new Error("config.user is mandatory!");
		}

		var user = config.user;

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
				console.log("Attempting to " + optionsDropdown.selectedOption().value +
				 " " + transactionValue() + " stocks" +
				 " from " + symbolsDropdown.selectedSymbol().label() + " with the symbol: " +
				  symbolsDropdown.selectedSymbol().value);

				var post = new XMLHttpRequest();
				var tradeParams = "user=" + user().userName + "&transactionType=" +
				 optionsDropdown.selectedOption().value + "&transactionValue=" + transactionValue();

				 post.open("POST", "./transaction", true);

				 post.onreadystatechange = function() {
				 	if(post.readyState == 4, post.status == 200) {
				 		var modifiedBalaneUser = user();
				 		modifiedBalaneUser.balance = post.responseText;
				 		user(modifiedBalaneUser);
				 		location.hash = "/users/" + user().userName;
				 	}
				 }

				 post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				 post.send(tradeParams);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q2hvb3Nlci9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvY2hhcnRDaG9vc2VyL3ZtLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL2NvcmUuanMiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2Uvdm0uanMiLCJzcmMvcHVibGljL21haW4uanMiLCJzcmMvcHVibGljL21haW5Db21wb25lbnQvY29yZS5qcyIsInNyYy9wdWJsaWMvbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9tYWluQ29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9wcm9maWxlQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvcHJvZmlsZUNvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvdHJhZGVyQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy90cmFkZXJDb21wb25lbnQvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLmJhc2VSb3V0ZSAmJiB0eXBlb2YgY29uZmlnLmJhc2VSb3V0ZSAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYmFzZVJvdXRlIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnN5bWJvbHMgJiYgdHlwZW9mIGNvbmZpZy5zeW1ib2xzICE9PSBcImFycmF5XCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN5bWJvbHMgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYW4gYXJyYXkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcuc2VsZWN0ZWRTeW1ib2wgJiYgdHlwZW9mIGNvbmZpZy5zZWxlY3RlZFN5bWJvbCAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zZWxlY3RlZFN5bWJvbCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGRyb3Bkb3duTGFiZWwgPSBcIlN0b2NrczogXCI7XHJcblx0XHRjb25zdCBiYXNlUm91dGUgPSBjb25maWcuYmFzZVJvdXRlO1xyXG5cdFx0Y29uc3Qgc2VyaWVzUXVlcnlVcmwgPSBjb25maWcuc2VyaWVzUXVlcnlVcmw7XHJcblx0XHRsZXQgc3ltYm9scyA9IGNvbmZpZy5zeW1ib2xzO1xyXG5cdFx0bGV0IHNlbGVjdGVkU3ltYm9sID0gY29uZmlnLnNlbGVjdGVkU3ltYm9sO1xyXG5cdFx0Lyp2YXIgc3ltYm9scyA9IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJHb29nbGVcIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wxXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkFwcGxlXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MMlwiXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJWZXJ6aW9uXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MM1wiXHJcblx0XHRcdH1cclxuXHRcdF0pOyovXHJcblxyXG5cdFx0dmFyIHNlbGVjdGVkSWR4ID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHJcblx0XHR2YXIgbG9hZENoYXJ0ID0ge1xyXG5cdFx0XHRsYWJlbDogXCJTZWxlY3RcIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSBsb2NhdGlvbi5oYXNoICsgXCIvXCIgKyBzZWxlY3RlZFN5bWJvbCgpLnZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZHJvcGRvd25MYWJlbDogZHJvcGRvd25MYWJlbCxcclxuXHRcdFx0c3ltYm9sczogc3ltYm9scyxcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2w6IHNlbGVjdGVkU3ltYm9sLFxyXG5cdFx0XHRzZWxlY3RlZElkeDogc2VsZWN0ZWRJZHgsXHJcblx0XHRcdGxvYWRDaGFydDogbG9hZENoYXJ0XHJcblx0XHR9O1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBkcm9wZG93bkxhYmVsXCI+PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdHNlbGVjdGVkOiBzZWxlY3RlZFN5bWJvbCxcXG5cdFx0XHRpdGVtczogc3ltYm9scyxcXG5cdFx0XHRzZWxlY3RlZElkeDogc2VsZWN0ZWRJZHgsXFxuXHRcdFx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJ1xcblx0XHRcIj5cXG5cdFx0PC9rbm9iLWRyb3Bkb3duPlxcblx0PC9zcGFuPlxcbjwvZGl2PlxcbjxkaXY+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiBsb2FkQ2hhcnQubGFiZWwsXFxuXHRcdGNsaWNrOiBsb2FkQ2hhcnQuY2xpY2tcXG5cdFwiPlxcblx0PC9rbm9iLWJ1dHRvbj5cXG48L2Rpdj5cXG4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBjaGFydENob29zZXJDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRDaG9vc2VyQ29yZSh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRkZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMgfHwge307XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5zZXJpZXNVcmwgJiYgdHlwZW9mIGNvbmZpZy5zZXJpZXNVcmwgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlcmllc1VybCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5kaXZJZCAmJiB0eXBlb2YgY29uZmlnLmRpdklkICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5kaXZJZCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5iYXNlUm91dGUgJiYgdHlwZW9mIGNvbmZpZy5iYXNlUm91dGUgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJhc2VSb3V0ZSBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5zZWxlY3RlZFN5bWJvbCAmJiB0eXBlb2YgY29uZmlnLnNlbGVjdGVkU3ltYm9sICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlbGVjdGVkU3ltYm9sIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly92YXIgY2hhcnRVcmwgPSBjb25maWcudXJsO1xyXG5cdFx0dmFyIHNlbGVjdGVkU3ltYm9sID0gY29uZmlnLnNlbGVjdGVkU3ltYm9sO1xyXG5cdFx0dmFyIGRpdklkID0gY29uZmlnLmRpdklkO1xyXG5cdFx0dmFyIHNlcmllc1VybCA9IGNvbmZpZy5zZXJpZXNVcmw7XHJcblx0XHR2YXIgYmFzZVJvdXRlID0gY29uZmlnLmJhc2VSb3V0ZTtcclxuXHJcblx0XHR2YXIgY2hhcnRVcmwgPSBcIi4vXCIgKyBzZXJpZXNVcmwgKyBcIi9cIiArIHNlbGVjdGVkU3ltYm9sKCkubGFiZWwoKTtcclxuXHJcblx0XHR2YXIgY2hhcnQgPSBjMy5nZW5lcmF0ZSh7XHJcblx0XHRcdGJpbmR0bzogXCIjXCIgKyBkaXZJZCxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdC8veDogXCJ0ZXN0U2VyaWVzXCIsXHJcblx0XHRcdFx0Ly94Rm9ybWF0OiBcIiVZLSVtLSVkICVIOiVNOiVTXCIsXHJcblx0XHRcdFx0dXJsOiBjaGFydFVybCxcclxuXHRcdFx0XHRtaW1lVHlwZTogXCJqc29uXCIsXHJcblx0XHRcdFx0Lypncm91cHM6IFtcclxuXHRcdFx0XHRcdFtcIkhVRi9VU0RcIl1cclxuXHRcdFx0XHRdLCovXHJcblx0XHRcdFx0a2V5czoge1xyXG5cdFx0XHRcdFx0eDogXCJ0aW1lXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogW3NlbGVjdGVkU3ltYm9sKCkubGFiZWwoKV1cclxuXHRcdFx0XHRcdC8veEZvcm1hdDogXCIlWS0lbS0lZCAlSDolTTolU1wiXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSxcclxuXHRcdFx0YXhpczoge1xyXG5cdFx0XHRcdHk6IHtcclxuXHRcdFx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IFwiUHJpY2VcIixcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IFwib3V0ZXItbWlkZGxlXCJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHg6IHtcclxuXHRcdFx0XHRcdHR5cGU6IFwidGltZXNlcmllc1wiLFxyXG5cdFx0XHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXCJUaW1lXCIsXHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiBcIm1pZGRsZVwiXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0dGljazoge1xyXG5cdFx0XHRcdFx0XHRmb3JtYXQ6IFwiJVktJW0tJWQgJUg6JU06JVNcIiwgLy9cIiVNOiVTXCIsXHJcblx0XHRcdFx0XHRcdGN1bGxpbmc6IHtcclxuXHRcdFx0XHRcdFx0XHRtYXg6IDdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0em9vbToge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IHRydWUsXHJcblx0XHRcdFx0cmVzY2FsZTogdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgem9vbUJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiVGVzdCBab29tXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Y2hhcnQuem9vbShbXHJcblx0XHRcdFx0XHRcdFwiMjAxNi0xMC0wMiAxNzowNDoxN1wiLFxyXG5cdFx0XHRcdFx0XHRcIjIwMTYtMTAtMDIgMTc6MDc6MjFcIl0pO1xyXG5cdFx0XHRcdH0sIDIwMDApO1xyXG5cdFx0XHRcdC8vY2hhcnQubG9hZChjaGFydFVybCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHJlc2V0QnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJSZXNldCBDaGFydFwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y2hhcnQudW56b29tKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRjaGFydDogY2hhcnQsXHJcblx0XHRcdGRpdklkOiBkaXZJZCxcclxuXHRcdFx0cmVzZXRCdXR0b246IHJlc2V0QnV0dG9uLFxyXG5cdFx0XHR6b29tQnV0dG9uOiB6b29tQnV0dG9uXHJcblx0XHR9O1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8ZGl2IGRhdGEtYmluZD0gXCJhdHRyOiB7XFxuXHRpZDogZGl2SWRcXG5cdH1cIj48L2Rpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHpvb21CdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiB6b29tQnV0dG9uLmNsaWNrXCI+XHRcdFxcblx0PC9rbm9iLWJ1dHRvbj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHJlc2V0QnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogcmVzZXRCdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY2hhcnRDb21wb25lbnRDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRDb21wb25lbnRDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGlmKCFkZXBlbmRlbmNpZXMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUxvZ2luU3VyZmFjZShjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcudXNlciAmJiB0eXBlb2YgY29uZmlnLnVzZXIgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXNlciBpcyBtYW5kYXRvcnkgYW5kIGl0IHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXI7XHJcblx0XHR2YXIgbG9naW5MYWJlbCA9IGNvbmZpZy5sb2dpbkxhYmVsO1xyXG5cdFx0dmFyIG1lbnUgPSBjb25maWcubWVudTtcclxuXHJcblx0XHR2YXIgdXNlcklucHV0ID0ge1xyXG5cdFx0XHRwbGFjZWhvbGRlcjogXCJVc2VyXCIsXHJcblx0XHRcdHZhbHVlOiBrby5vYnNlcnZhYmxlKG51bGwpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBwYXNzd29yZElucHV0ID0ge1xyXG5cdFx0XHRwbGFjZWhvbGRlcjogXCJQYXNzd29yZFwiLFxyXG5cdFx0XHR2YWx1ZToga28ub2JzZXJ2YWJsZShudWxsKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9naW5CdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIkxvZ2luXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgdXNlclBhcmFtcyA9IFwidXNlcj1cIiArIHVzZXJJbnB1dC52YWx1ZSgpICsgXCImcGFzcz1cIiArIHBhc3N3b3JkSW5wdXQudmFsdWUoKTtcclxuXHRcdFx0XHR2YXIgcG9zdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuXHRcdFx0XHRwb3N0Lm9wZW4oXCJQT1NUXCIsIFwiLi9sb2dpbnJlcXVlc3RcIiwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRcdHBvc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcdFx0XHRcdGlmKHBvc3QucmVhZHlTdGF0ZSA9PSA0ICYmIHBvc3Quc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2cocG9zdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIFx0XHRcdFx0dXNlcihKU09OLnBhcnNlKHBvc3QucmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgXHRcdFx0XHRtZW51WzBdLnZpc2libGUoZmFsc2UpO1xyXG4gICAgICAgIFx0XHRcdFx0bWVudVsxXS52aXNpYmxlKHRydWUpO1xyXG4gICAgICAgIFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IFwiL3VzZXJzL1wiICsgdXNlcigpLnVzZXJOYW1lO1xyXG4gICAgXHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRwb3N0LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XHJcblx0XHRcdFx0cG9zdC5zZW5kKHVzZXJQYXJhbXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHVzZXJJbnB1dDogdXNlcklucHV0LFxyXG5cdFx0XHRwYXNzd29yZElucHV0OiBwYXNzd29yZElucHV0LFxyXG5cdFx0XHRsb2dpbkJ1dHRvbjogbG9naW5CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHR2YWx1ZTogdXNlcklucHV0LnZhbHVlLFxcblx0XHRwbGFjZWhvbGRlcjogdXNlcklucHV0LnBsYWNlaG9sZGVyXFxuXHRcIj48L2tub2ItaW5wdXQ+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHR2YWx1ZTogcGFzc3dvcmRJbnB1dC52YWx1ZSxcXG5cdFx0cGxhY2Vob2xkZXI6IHBhc3N3b3JkSW5wdXQucGxhY2Vob2xkZXIsXFxuXHRcdHR5cGU6IFxcJ3Bhc3N3b3JkXFwnXFxuXHRcIj48L2tub2ItaW5wdXQ+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IGxvZ2luQnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogbG9naW5CdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgbG9naW5TdXJmYWNlQ29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ2luU3VyZmFjZUNvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbm9iID0gKHdpbmRvdy5rbm9iKTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImNoYXJ0LWNob29zZXJcIiwgcmVxdWlyZShcIi4vY2hhcnRDaG9vc2VyL3ZtXCIpLCByZXF1aXJlKFwiLi9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcInByb2ZpbGUtY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL3Byb2ZpbGVDb21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcInRyYWRlci1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vdHJhZGVyQ29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi90cmFkZXJDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImxvZ2luLXN1cmZhY2VcIiwgcmVxdWlyZShcIi4vbG9naW5TdXJmYWNlL3ZtXCIpLCByZXF1aXJlKFwiLi9sb2dpblN1cmZhY2UvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImNoYXJ0LWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi9jaGFydENvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vY2hhcnRDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcIm1haW4tY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL21haW5Db21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL21haW5Db21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5pdDsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0aWYoIWRlcGVuZGVuY2llcykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGNvbnN0IGJhc2VSb3V0ZSA9IFwibG9jYWxob3N0Ojg4ODhcIjtcclxuXHRcdGNvbnN0IHNlcmllc1F1ZXJ5VXJsID0gXCIuL3Nlcmllc05hbWVzXCI7XHJcblx0XHRjb25zdCBzZXJpZXNVcmwgPSBcImRhdGFQb2ludHNcIjtcclxuXHJcblx0XHRsZXQgc3ltYm9scyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XHJcblx0XHRsZXQgc2VsZWN0ZWRTeW1ib2wgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cclxuXHRcdGtvLmNvbXB1dGVkKCgpID0+IHtcclxuXHRcdFx0Y29uc29sZS5sb2coc2VsZWN0ZWRTeW1ib2woKSlcclxuXHRcdH0pXHJcblxyXG5cdFx0bGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0eGhyLm9wZW4oXCJHRVRcIiwgc2VyaWVzUXVlcnlVcmwpO1xyXG5cdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcclxuXHRcdFx0aWYoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcblx0XHRcdFx0bGV0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG5cclxuXHRcdFx0XHRwYXJzZWREYXRhLmZvckVhY2goKHNlcmllcykgPT4ge1xyXG5cdFx0XHRcdFx0c3ltYm9scy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0bGFiZWw6IHNlcmllcyxcclxuXHRcdFx0XHRcdFx0dmFsdWU6IHNlcmllcy50b1VwcGVyQ2FzZSgpXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHhoci5zZW5kKG51bGwpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU1lbnVJdGVtKGxhYmVsLCB1cmwpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRsYWJlbDogbGFiZWwsXHJcblx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0dmlzaWJsZToga28ub2JzZXJ2YWJsZSh0cnVlKSxcclxuXHRcdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZih1c2VyKCkgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IFwiIy9sb2dpblwiO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmKHVzZXIoKSAhPT0gbnVsbCAmJiBsYWJlbCA9PT0gXCJNeSBQb3J0Zm9saW9cIikge1xyXG5cdFx0XHRcdFx0XHR1cmwgPSBcIiMvdXNlcnMvXCIgKyB1c2VyKCkudXNlck5hbWU7XHJcblx0XHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSB1cmw7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gdXJsO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBtZW51ID0gW1xyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIkxvZ2luXCIsIFwiIy9sb2dpblwiKSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkxvZ291dFwiLFxyXG5cdFx0XHRcdHVybDogXCIjL2xvZ2luXCIsXHJcblx0XHRcdFx0dmlzaWJsZToga28ub2JzZXJ2YWJsZShmYWxzZSksXHJcblx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dXNlcihudWxsKTtcclxuXHRcdFx0XHRcdG1lbnVbMF0udmlzaWJsZSh0cnVlKTtcclxuXHRcdFx0XHRcdG1lbnVbMV0udmlzaWJsZShmYWxzZSk7XHJcblx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gXCIjL2xvZ2luXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIk15IFBvcnRmb2xpb1wiLCBcIiMvdXNlcnMvOnByb2ZpbGVJZFwiKSwgLy90aGluayBhYm91dCBzb2x1dGlvbiBmb3IgbG9nZ2VkIGluIHByb2ZpbGVzXHJcblx0XHRcdGNyZWF0ZU1lbnVJdGVtKFwiVHJhZGVcIiwgXCIjL3RyYWRlXCIpLFxyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIkNoYXJ0c1wiLCBcIiMvY2hhcnRzXCIpXHJcblx0XHRdO1xyXG5cclxuXHRcdHZhciByZXNvdXJjZSA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblx0XHR2YXIgc3ltYm9sID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHRcdHZhciB1c2VyID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHJcblx0XHRTYW1teShmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5nZXQoXCIjL2xvZ2luXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwibG9naW5cIik7XHJcblx0XHRcdFx0c3ltYm9sKG51bGwpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc291cmNlKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy91c2Vycy86cHJvZmlsZUlkXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwicHJvZmlsZVwiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL3RyYWRlXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwidHJhZGVcIik7XHJcblx0XHRcdFx0c3ltYm9sKG51bGwpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc291cmNlKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy9jaGFydHNcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJjaGFydHNcIik7XHJcblx0XHRcdFx0c3ltYm9sKG51bGwpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc291cmNlKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy9jaGFydHMvOnN5bWJvbFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzeW1ib2wodGhpcy5wYXJhbXMuc3ltYm9sKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcImEgY2hhcnQgc2hvdWxkIGJlIGhlcmUgd2l0aDogXCIgKyBzeW1ib2woKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCJcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJSb290IGxvbFwiKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KS5ydW4oKTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtZW51OiBtZW51LFxyXG5cdFx0XHRyZXNvdXJjZTogcmVzb3VyY2UsXHJcblx0XHRcdHN5bWJvbDogc3ltYm9sLFxyXG5cdFx0XHRzZWxlY3RlZFN5bWJvbDogc2VsZWN0ZWRTeW1ib2wsXHJcblx0XHRcdHN5bWJvbHM6IHN5bWJvbHMsXHJcblx0XHRcdGJhc2VSb3V0ZTogYmFzZVJvdXRlLFxyXG5cdFx0XHR1c2VyOiB1c2VyLFxyXG5cdFx0XHRzZXJpZXNRdWVyeVVybDogc2VyaWVzUXVlcnlVcmwsXHJcblx0XHRcdHNlcmllc1VybDogc2VyaWVzVXJsXHJcblx0XHR9O1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJtZW51XCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogeyBkYXRhOiBtZW51LCBhczogXFwnbWVudUl0ZW1cXCd9XCI+XFxuICAgIDxzcGFuPlxcbiAgICBcdDxrbm9iLWJ1dHRvbiBjbGFzcz1cIm1lbnUtaXRlbVwiIGRhdGEtYmluZD1cInZpc2libGU6IG1lbnVJdGVtLnZpc2libGVcIiBwYXJhbXM9XCJcXG4gICAgXHRcdGxhYmVsOiBtZW51SXRlbS5sYWJlbCxcXG4gICAgXHRcdGNsaWNrOiBtZW51SXRlbS5jbGlja1xcbiAgICBcdFwiPjwva25vYi1idXR0b24+XFxuICAgIDwvc3Bhbj5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBudWxsXCI+XFxuXHQ8aDEgZGF0YS1iaW5kPVwidGV4dDogXFwnV2VsY29tZSB0byB0aGUgVmlydHVhbCBTdG9jayBNYXJrZXQhXFwnXCI+PC9oMT5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdsb2dpblxcJyB8fCB1c2VyKCkgPT09IG51bGxcIj5cXG5cdDxsb2dpbi1zdXJmYWNlIHBhcmFtcz1cIlxcblx0XHR1c2VyOiB1c2VyLFxcblx0XHRtZW51OiBtZW51XFxuXHRcIj48L2xvZ2luLXN1cmZhY2U+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwncHJvZmlsZVxcJyAmJiB1c2VyKCkgIT09IG51bGxcIj5cXG5cdDxwcm9maWxlLWNvbXBvbmVudCBwYXJhbXM9XCJcXG5cdFx0bmFtZTogXFwnRGVmdWFsdCBVc2VyXFwnLFxcblx0XHRwcm9maWxlUGljdHVyZVVybDogXFwnaHR0cDovL3d3dy5tdWtlc2hhbWJhbmkuY29tL3Bob3RvL2RlZmF1bHQuanBnXFwnLFxcblx0XHRiYWxhbmNlOiAxMDAwMCxcXG5cdFx0dXNlcjogdXNlclxcblx0XCI+PC9wcm9maWxlLWNvbXBvbmVudD5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCd0cmFkZVxcJyAmJiB1c2VyKCkgIT0gbnVsbFwiPlxcblx0PHRyYWRlci1jb21wb25lbnQgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXJcXG5cdFwiPjwvdHJhZGVyLWNvbXBvbmVudD5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdjaGFydHNcXCcgJiYgc3ltYm9sKCkgPT0gbnVsbCAmJiB1c2VyKCkgIT09IG51bGxcIj5cXG5cdDxjaGFydC1jaG9vc2VyIHBhcmFtcz1cIlxcblx0XHR1c2VyOiB1c2VyLFxcblx0XHRiYXNlUm91dGU6IGJhc2VSb3V0ZSxcXG4gICAgc3ltYm9sczogc3ltYm9scyxcXG4gICAgc2VsZWN0ZWRTeW1ib2w6IHNlbGVjdGVkU3ltYm9sXFxuXHRcIj48L2NoYXJ0LWNob29zZXI+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwnY2hhcnRzXFwnICYmIHN5bWJvbCgpICE9IG51bGwgJiYgdXNlcigpICE9IG51bGxcIj5cXG5cdDxjaGFydC1jb21wb25lbnQgcGFyYW1zPVwiXFxuXHRcdFx0dXNlcjogdXNlcixcXG5cdFx0XHRzZXJpZXNVcmw6IHNlcmllc1VybCxcXG5cdFx0XHRkaXZJZDogXFwnY2hhcnRcXCcsXFxuICAgICAgYmFzZVJvdXRlOiBiYXNlUm91dGUsXFxuICAgICAgc2VsZWN0ZWRTeW1ib2w6IHNlbGVjdGVkU3ltYm9sXFxuXHRcdFwiPjwvY2hhcnQtY29tcG9uZW50PlxcbjwvZGl2Plxcbic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNyZWF0ZU1haW5Db21wb25lbnQgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVNYWluQ29tcG9uZW50KHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLm5hbWUgJiYgdHlwZW9mIGNvbmZpZy5uYW1lICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5uYW1lIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsICYmIHR5cGVvZiBjb25maWcucHJvZmlsZVBpY3R1cmVVcmwgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLmJhbGFuY2UgJiYgdHlwZW9mIGNvbmZpZy5iYWxhbmNlICE9PSBcIm51bWJlclwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5iYWxhbmNlIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgbnVtYmVyIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbmFtZSA9IGNvbmZpZy5uYW1lO1xyXG5cdFx0dmFyIHByb2ZpbGVQaWN0dXJlVXJsID0gY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsO1xyXG5cdFx0dmFyIGJhbGFuY2UgPSBjb25maWcuYmFsYW5jZTtcclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXIgfHwgZnVuY3Rpb24oKSB7fTsgLy9maXggdGhpcywgdGVtcG9yYXJ5XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZTogbmFtZSxcclxuXHRcdFx0cHJvZmlsZVBpY3R1cmVVcmw6IHByb2ZpbGVQaWN0dXJlVXJsLFxyXG5cdFx0XHRiYWxhbmNlOiBiYWxhbmNlLFxyXG5cdFx0XHR1c2VyOiB1c2VyXHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxkaXY+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IFxcJ1VzZXJuYW1lOiBcXCcgKyB1c2VyKCkubmFtZVwiPjwvc3Bhbj5cXG5cdFx0PGltZyBkYXRhLWJpbmQ9XCJhdHRyOiB7c3JjOiB1c2VyKCkucHJvZmlsZVVybCwgaGVpZ2h0OiAxMDAsIHdpZHRoOiAxMDB9XCI+XFxuXHQ8L2Rpdj5cXG5cdDxkaXY+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IFxcJ0JhbGFuY2U6IFxcJyArIHVzZXIoKS5iYWxhbmNlICsgXFwnJFxcJ1wiPjwvc3Bhbj5cXG5cdDwvZGl2PlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNyZWF0ZVByb2ZpbGVDb21wb25lbnQgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVQcm9maWxlQ29tcG9uZW50KHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZihjb25maWcudXNlciA9PT0gbnVsbCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXNlciBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXI7XHJcblxyXG5cdFx0Y29uc3QgaGVhZGVyID0gXCJUcmFkZVwiO1xyXG5cdFx0Y29uc3Qgc3ltYm9sTGFiZWwgPSBcIlN5bWJvbCBcIjtcclxuXHRcdGNvbnN0IHRyYW5zYWN0aW9uTGFiZWwgPSBcIlRyYW5zYWN0aW9uIFwiO1xyXG5cdFx0Y29uc3QgdHJhbnNhY3Rpb25RdWFudGl0eSA9IFwiUXVhbnRpdHkgXCI7XHJcblxyXG5cdFx0dmFyIHN5bWJvbHNEcm9wZG93biA9IHtcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2w6IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdHNlbGVjdGVkU3ltYm9sSWR4OiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzeW1ib2xzOiBrby5vYnNlcnZhYmxlQXJyYXkoW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxhYmVsOiBcIkdvb2dsZVwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwiR09PR1wiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJBcHBsZVwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwiQUFQTFwiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJWZXJ6aW9uXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJWWlwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgdHJhbnNhY3Rpb25WYWx1ZSA9IGtvLm9ic2VydmFibGUoMCk7XHJcblx0XHRcclxuXHRcdHZhciBvcHRpb25zRHJvcGRvd24gPSB7XHJcblx0XHRcdHNlbGVjdGVkT3B0aW9uOiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzZWxlY3RlZE9wdGlvbklkeDoga28ub2JzZXJ2YWJsZShudWxsKSxcclxuXHRcdFx0b3B0aW9ucyA6IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiQnV5XCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJidXlcIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiU2VsbFwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwic2VsbFwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdKVx0XHRcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHRyYW5zYWN0aW9uQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJNYWtlIHRyYW5zYWN0aW9uXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gXCIgKyBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb24oKS52YWx1ZSArXHJcblx0XHRcdFx0IFwiIFwiICsgdHJhbnNhY3Rpb25WYWx1ZSgpICsgXCIgc3RvY2tzXCIgK1xyXG5cdFx0XHRcdCBcIiBmcm9tIFwiICsgc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkubGFiZWwoKSArIFwiIHdpdGggdGhlIHN5bWJvbDogXCIgK1xyXG5cdFx0XHRcdCAgc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkudmFsdWUpO1xyXG5cclxuXHRcdFx0XHR2YXIgcG9zdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHRcdHZhciB0cmFkZVBhcmFtcyA9IFwidXNlcj1cIiArIHVzZXIoKS51c2VyTmFtZSArIFwiJnRyYW5zYWN0aW9uVHlwZT1cIiArXHJcblx0XHRcdFx0IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbigpLnZhbHVlICsgXCImdHJhbnNhY3Rpb25WYWx1ZT1cIiArIHRyYW5zYWN0aW9uVmFsdWUoKTtcclxuXHJcblx0XHRcdFx0IHBvc3Qub3BlbihcIlBPU1RcIiwgXCIuL3RyYW5zYWN0aW9uXCIsIHRydWUpO1xyXG5cclxuXHRcdFx0XHQgcG9zdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQgXHRpZihwb3N0LnJlYWR5U3RhdGUgPT0gNCwgcG9zdC5zdGF0dXMgPT0gMjAwKSB7XHJcblx0XHRcdFx0IFx0XHR2YXIgbW9kaWZpZWRCYWxhbmVVc2VyID0gdXNlcigpO1xyXG5cdFx0XHRcdCBcdFx0bW9kaWZpZWRCYWxhbmVVc2VyLmJhbGFuY2UgPSBwb3N0LnJlc3BvbnNlVGV4dDtcclxuXHRcdFx0XHQgXHRcdHVzZXIobW9kaWZpZWRCYWxhbmVVc2VyKTtcclxuXHRcdFx0XHQgXHRcdGxvY2F0aW9uLmhhc2ggPSBcIi91c2Vycy9cIiArIHVzZXIoKS51c2VyTmFtZTtcclxuXHRcdFx0XHQgXHR9XHJcblx0XHRcdFx0IH1cclxuXHJcblx0XHRcdFx0IHBvc3Quc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcclxuXHRcdFx0XHQgcG9zdC5zZW5kKHRyYWRlUGFyYW1zKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRoZWFkZXI6IGhlYWRlcixcclxuXHRcdFx0c3ltYm9sTGFiZWw6IHN5bWJvbExhYmVsLFxyXG5cdFx0XHR0cmFuc2FjdGlvbkxhYmVsOiB0cmFuc2FjdGlvbkxhYmVsLFxyXG5cdFx0XHR0cmFuc2FjdGlvblF1YW50aXR5OiB0cmFuc2FjdGlvblF1YW50aXR5LFxyXG5cdFx0XHRzeW1ib2xzRHJvcGRvd246IHN5bWJvbHNEcm9wZG93bixcclxuXHRcdFx0b3B0aW9uc0Ryb3Bkb3duOiBvcHRpb25zRHJvcGRvd24sXHJcblx0XHRcdHRyYW5zYWN0aW9uQnV0dG9uOiB0cmFuc2FjdGlvbkJ1dHRvbixcclxuXHRcdFx0dHJhbnNhY3Rpb25WYWx1ZTogdHJhbnNhY3Rpb25WYWx1ZVxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8aDIgZGF0YS1iaW5kPVwidGV4dDogaGVhZGVyXCI+PC9oMj5cXG5cdDxzcGFuPlxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBzeW1ib2xMYWJlbFwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRcdFx0c2VsZWN0ZWQ6IHN5bWJvbHNEcm9wZG93bi5zZWxlY3RlZFN5bWJvbCxcXG5cdFx0XHRpdGVtczogc3ltYm9sc0Ryb3Bkb3duLnN5bWJvbHMsXFxuXHRcdFx0c2VsZWN0ZWRJZHg6IHN5bWJvbHNEcm9wZG93bi5zZWxlY3RlZFN5bWJvbElkeCxcXG5cdFx0XHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnXFxuXHRcdFwiPjwva25vYi1kcm9wZG93bj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuPlxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0cmFuc2FjdGlvbkxhYmVsXCI+PC9zcGFuPlxcblx0XHQ8a25vYi1kcm9wZG93biBwYXJhbXM9XCJcXG5cdFx0XHRzZWxlY3RlZDogb3B0aW9uc0Ryb3Bkb3duLnNlbGVjdGVkT3B0aW9uLFxcblx0XHRcdGl0ZW1zOiBvcHRpb25zRHJvcGRvd24ub3B0aW9ucyxcXG5cdFx0XHRzZWxlY3RlZElkeDogb3B0aW9uc0Ryb3Bkb3duLnNlbGVjdGVkT3B0aW9uSWR4LFxcblx0XHRcdHJpZ2h0SWNvbjogXFwnI2ljb24tZXhwYW5kLW1vcmVcXCdcXG5cdFx0XCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRyYW5zYWN0aW9uUXVhbnRpdHlcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHRcdHZhbHVlOiB0cmFuc2FjdGlvblZhbHVlXFxuXHRcdFwiPjwva25vYi1pbnB1dD5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdFx0bGFiZWw6IHRyYW5zYWN0aW9uQnV0dG9uLmxhYmVsLFxcblx0XHRcdGNsaWNrOiB0cmFuc2FjdGlvbkJ1dHRvbi5jbGlja1xcblx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0PC9zcGFuPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIHRyYWRlckNvbXBvbmVudENvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0cmFkZXJDb21wb25lbnRDb3JlKHtcclxuXHRrbzoga29cclxufSk7Il19
