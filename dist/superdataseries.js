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
		var urlSplit = chartUrl.split("/");
		var seriesName = urlSplit[urlSplit.length - 1];
		var divId = config.divId;

		var chart = c3.generate({
			bindto: "#" + divId,
			data: {
				//x: "testSeries",
				//xFormat: "%Y-%m-%d %H:%M:%S",
				mimeType: "json",
				url: chartUrl,
				/*groups: [
					["HUF/USD"]
				],*/
				keys: {
					x: "time",
					value: [seriesName]
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
			baseRoute: baseRoute,
			user: user
		};
	};
};
},{}],12:[function(require,module,exports){
module.exports = '<div class="menu" data-bind="foreach: { data: menu, as: \'menuItem\'}">\n    <span>\n    	<knob-button class="menu-item" data-bind="visible: menuItem.visible" params="\n    		label: menuItem.label,\n    		click: menuItem.click\n    	"></knob-button>\n    </span>\n</div>\n<div data-bind="if: resource() === null">\n	<h1 data-bind="text: \'Welcome to the Virtual Stock Market!\'"></h1>\n</div>\n<div data-bind="if: resource() === \'login\' || user() === null">\n	<login-surface params="\n		user: user,\n		menu: menu\n	"></login-surface>\n</div>\n<div data-bind="if: resource() === \'profile\' && user() !== null">\n	<profile-component params="\n		name: \'Defualt User\',\n		profilePictureUrl: \'http://www.mukeshambani.com/photo/default.jpg\',\n		balance: 10000,\n		user: user\n	"></profile-component>\n</div>\n<div data-bind="if: resource() === \'trade\' && user() != null">\n	<trader-component params="\n		user: user\n	"></trader-component>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() == null && user() !== null">\n	<chart-chooser params="\n		user: user,\n		baseRoute: baseRoute\n	"></chart-chooser>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() != null && user() != null">\n	<chart-component params="\n			user: user,\n			url: \'./chart_data/formatted50\',\n			divId: \'format50\'\n		"></chart-component>\n</div>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q2hvb3Nlci9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvY2hhcnRDaG9vc2VyL3ZtLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL2NvcmUuanMiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2Uvdm0uanMiLCJzcmMvcHVibGljL21haW4uanMiLCJzcmMvcHVibGljL21haW5Db21wb25lbnQvY29yZS5qcyIsInNyYy9wdWJsaWMvbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9tYWluQ29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9wcm9maWxlQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvcHJvZmlsZUNvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvdHJhZGVyQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy90cmFkZXJDb21wb25lbnQvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRkZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMgfHwge307XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5iYXNlUm91dGUgJiYgdHlwZW9mIGNvbmZpZy5iYXNlUm91dGUgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmJhc2VSb3V0ZSBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgYmFzZVJvdXRlID0gY29uZmlnLmJhc2VSb3V0ZTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgZHJvcGRvd25MYWJlbCA9IFwiU3RvY2tzOiBcIjtcclxuXHRcdHZhciBzeW1ib2xzID0ga28ub2JzZXJ2YWJsZUFycmF5KFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkdvb2dsZVwiLFxyXG5cdFx0XHRcdHZhbHVlOiBcIlNZTUJPTDFcIlxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGFiZWw6IFwiQXBwbGVcIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wyXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIlZlcnppb25cIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wzXCJcclxuXHRcdFx0fVxyXG5cdFx0XSk7XHJcblxyXG5cdFx0dmFyIHNlbGVjdGVkID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHRcdHZhciBzZWxlY3RlZElkeCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblxyXG5cdFx0dmFyIGxvYWRDaGFydCA9IHtcclxuXHRcdFx0bGFiZWw6IFwiU2VsZWN0XCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gbG9jYXRpb24uaGFzaCArIFwiL1wiICsgc2VsZWN0ZWQoKS52YWx1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZHJvcGRvd25MYWJlbDogZHJvcGRvd25MYWJlbCxcclxuXHRcdFx0c3ltYm9sczogc3ltYm9scyxcclxuXHRcdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxyXG5cdFx0XHRzZWxlY3RlZElkeDogc2VsZWN0ZWRJZHgsXHJcblx0XHRcdGxvYWRDaGFydDogbG9hZENoYXJ0XHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGRyb3Bkb3duTGFiZWxcIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuPlxcblx0XHQ8a25vYi1kcm9wZG93biBwYXJhbXM9XCJcXG5cdFx0XHRzZWxlY3RlZDogc2VsZWN0ZWQsXFxuXHRcdFx0aXRlbXM6IHN5bWJvbHMsXFxuXHRcdFx0c2VsZWN0ZWRJZHg6IHNlbGVjdGVkSWR4LFxcblx0XHRcdHJpZ2h0SWNvbjogXFwnI2ljb24tZXhwYW5kLW1vcmVcXCdcXG5cdFx0XCI+XFxuXHRcdDwva25vYi1kcm9wZG93bj5cXG5cdDwvc3Bhbj5cXG48L2Rpdj5cXG48ZGl2Plxcblx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRsYWJlbDogbG9hZENoYXJ0LmxhYmVsLFxcblx0XHRjbGljazogbG9hZENoYXJ0LmNsaWNrXFxuXHRcIj5cXG5cdDwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY2hhcnRDaG9vc2VyQ29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0Q2hvb3NlckNvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcudXJsKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy51cmwgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLmRpdklkKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5kaXZJZCBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBjaGFydFVybCA9IGNvbmZpZy51cmw7XHJcblx0XHR2YXIgdXJsU3BsaXQgPSBjaGFydFVybC5zcGxpdChcIi9cIik7XHJcblx0XHR2YXIgc2VyaWVzTmFtZSA9IHVybFNwbGl0W3VybFNwbGl0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0dmFyIGRpdklkID0gY29uZmlnLmRpdklkO1xyXG5cclxuXHRcdHZhciBjaGFydCA9IGMzLmdlbmVyYXRlKHtcclxuXHRcdFx0YmluZHRvOiBcIiNcIiArIGRpdklkLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0Ly94OiBcInRlc3RTZXJpZXNcIixcclxuXHRcdFx0XHQvL3hGb3JtYXQ6IFwiJVktJW0tJWQgJUg6JU06JVNcIixcclxuXHRcdFx0XHRtaW1lVHlwZTogXCJqc29uXCIsXHJcblx0XHRcdFx0dXJsOiBjaGFydFVybCxcclxuXHRcdFx0XHQvKmdyb3VwczogW1xyXG5cdFx0XHRcdFx0W1wiSFVGL1VTRFwiXVxyXG5cdFx0XHRcdF0sKi9cclxuXHRcdFx0XHRrZXlzOiB7XHJcblx0XHRcdFx0XHR4OiBcInRpbWVcIixcclxuXHRcdFx0XHRcdHZhbHVlOiBbc2VyaWVzTmFtZV1cclxuXHRcdFx0XHRcdC8veEZvcm1hdDogXCIlWS0lbS0lZCAlSDolTTolU1wiXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSxcclxuXHRcdFx0YXhpczoge1xyXG5cdFx0XHRcdHk6IHtcclxuXHRcdFx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IFwiUHJpY2VcIixcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IFwib3V0ZXItbWlkZGxlXCJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHg6IHtcclxuXHRcdFx0XHRcdHR5cGU6IFwidGltZXNlcmllc1wiLFxyXG5cdFx0XHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXCJUaW1lXCIsXHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiBcIm1pZGRsZVwiXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0dGljazoge1xyXG5cdFx0XHRcdFx0XHRmb3JtYXQ6IFwiJU06JVNcIlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0em9vbToge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IHRydWUsXHJcblx0XHRcdFx0cmVzY2FsZTogdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgem9vbUJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiVGVzdCBab29tXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Y2hhcnQuem9vbShbXHJcblx0XHRcdFx0XHRcdFwiMjAxNi0xMC0wMiAxNzowNDoxN1wiLFxyXG5cdFx0XHRcdFx0XHRcIjIwMTYtMTAtMDIgMTc6MDc6MjFcIl0pO1xyXG5cdFx0XHRcdH0sIDIwMDApO1xyXG5cdFx0XHRcdC8vY2hhcnQubG9hZChjaGFydFVybCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHJlc2V0QnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJSZXNldCBDaGFydFwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y2hhcnQudW56b29tKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRjaGFydDogY2hhcnQsXHJcblx0XHRcdGRpdklkOiBkaXZJZCxcclxuXHRcdFx0cmVzZXRCdXR0b246IHJlc2V0QnV0dG9uLFxyXG5cdFx0XHR6b29tQnV0dG9uOiB6b29tQnV0dG9uXHJcblx0XHR9O1xyXG5cdH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8ZGl2IGRhdGEtYmluZD0gXCJhdHRyOiB7XFxuXHRpZDogZGl2SWRcXG5cdH1cIj48L2Rpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHpvb21CdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiB6b29tQnV0dG9uLmNsaWNrXCI+XHRcdFxcblx0PC9rbm9iLWJ1dHRvbj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHJlc2V0QnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogcmVzZXRCdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY2hhcnRDb21wb25lbnRDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRDb21wb25lbnRDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGlmKCFkZXBlbmRlbmNpZXMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUxvZ2luU3VyZmFjZShjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcudXNlciAmJiB0eXBlb2YgY29uZmlnLnVzZXIgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXNlciBpcyBtYW5kYXRvcnkgYW5kIGl0IHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXI7XHJcblx0XHR2YXIgbG9naW5MYWJlbCA9IGNvbmZpZy5sb2dpbkxhYmVsO1xyXG5cdFx0dmFyIG1lbnUgPSBjb25maWcubWVudTtcclxuXHJcblx0XHR2YXIgdXNlcklucHV0ID0ge1xyXG5cdFx0XHRwbGFjZWhvbGRlcjogXCJVc2VyXCIsXHJcblx0XHRcdHZhbHVlOiBrby5vYnNlcnZhYmxlKG51bGwpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBwYXNzd29yZElucHV0ID0ge1xyXG5cdFx0XHRwbGFjZWhvbGRlcjogXCJQYXNzd29yZFwiLFxyXG5cdFx0XHR2YWx1ZToga28ub2JzZXJ2YWJsZShudWxsKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9naW5CdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIkxvZ2luXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgdXNlclBhcmFtcyA9IFwidXNlcj1cIiArIHVzZXJJbnB1dC52YWx1ZSgpICsgXCImcGFzcz1cIiArIHBhc3N3b3JkSW5wdXQudmFsdWUoKTtcclxuXHRcdFx0XHR2YXIgcG9zdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuXHRcdFx0XHRwb3N0Lm9wZW4oXCJQT1NUXCIsIFwiLi9sb2dpbnJlcXVlc3RcIiwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRcdHBvc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcdFx0XHRcdGlmKHBvc3QucmVhZHlTdGF0ZSA9PSA0ICYmIHBvc3Quc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2cocG9zdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIFx0XHRcdFx0dXNlcihKU09OLnBhcnNlKHBvc3QucmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgXHRcdFx0XHRtZW51WzBdLnZpc2libGUoZmFsc2UpO1xyXG4gICAgICAgIFx0XHRcdFx0bWVudVsxXS52aXNpYmxlKHRydWUpO1xyXG4gICAgICAgIFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IFwiL3VzZXJzL1wiICsgdXNlcigpLnVzZXJOYW1lO1xyXG4gICAgXHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRwb3N0LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XHJcblx0XHRcdFx0cG9zdC5zZW5kKHVzZXJQYXJhbXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHVzZXJJbnB1dDogdXNlcklucHV0LFxyXG5cdFx0XHRwYXNzd29yZElucHV0OiBwYXNzd29yZElucHV0LFxyXG5cdFx0XHRsb2dpbkJ1dHRvbjogbG9naW5CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHR2YWx1ZTogdXNlcklucHV0LnZhbHVlLFxcblx0XHRwbGFjZWhvbGRlcjogdXNlcklucHV0LnBsYWNlaG9sZGVyXFxuXHRcIj48L2tub2ItaW5wdXQ+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHR2YWx1ZTogcGFzc3dvcmRJbnB1dC52YWx1ZSxcXG5cdFx0cGxhY2Vob2xkZXI6IHBhc3N3b3JkSW5wdXQucGxhY2Vob2xkZXIsXFxuXHRcdHR5cGU6IFxcJ3Bhc3N3b3JkXFwnXFxuXHRcIj48L2tub2ItaW5wdXQ+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IGxvZ2luQnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogbG9naW5CdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgbG9naW5TdXJmYWNlQ29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ2luU3VyZmFjZUNvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbm9iID0gKHdpbmRvdy5rbm9iKTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImNoYXJ0LWNob29zZXJcIiwgcmVxdWlyZShcIi4vY2hhcnRDaG9vc2VyL3ZtXCIpLCByZXF1aXJlKFwiLi9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcInByb2ZpbGUtY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL3Byb2ZpbGVDb21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcInRyYWRlci1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vdHJhZGVyQ29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi90cmFkZXJDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImxvZ2luLXN1cmZhY2VcIiwgcmVxdWlyZShcIi4vbG9naW5TdXJmYWNlL3ZtXCIpLCByZXF1aXJlKFwiLi9sb2dpblN1cmZhY2UvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImNoYXJ0LWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi9jaGFydENvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vY2hhcnRDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcIm1haW4tY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL21haW5Db21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL21haW5Db21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5pdDsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0aWYoIWRlcGVuZGVuY2llcykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fSBcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRjb25zdCBiYXNlUm91dGUgPSBcImxvY2FsaG9zdDo4ODg4XCI7XHJcblxyXG5cdFx0ZnVuY3Rpb24gY3JlYXRlTWVudUl0ZW0obGFiZWwsIHVybCkge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGxhYmVsOiBsYWJlbCxcclxuXHRcdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0XHR2aXNpYmxlOiBrby5vYnNlcnZhYmxlKHRydWUpLFxyXG5cdFx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmKHVzZXIoKSA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gXCIjL2xvZ2luXCI7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYodXNlcigpICE9PSBudWxsICYmIGxhYmVsID09PSBcIk15IFBvcnRmb2xpb1wiKSB7XHJcblx0XHRcdFx0XHRcdHVybCA9IFwiIy91c2Vycy9cIiArIHVzZXIoKS51c2VyTmFtZTtcclxuXHRcdFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IHVybDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSB1cmw7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG1lbnUgPSBbXHJcblx0XHRcdGNyZWF0ZU1lbnVJdGVtKFwiTG9naW5cIiwgXCIjL2xvZ2luXCIpLFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGFiZWw6IFwiTG9nb3V0XCIsXHJcblx0XHRcdFx0dXJsOiBcIiMvbG9naW5cIixcclxuXHRcdFx0XHR2aXNpYmxlOiBrby5vYnNlcnZhYmxlKGZhbHNlKSxcclxuXHRcdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR1c2VyKG51bGwpO1xyXG5cdFx0XHRcdFx0bWVudVswXS52aXNpYmxlKHRydWUpO1xyXG5cdFx0XHRcdFx0bWVudVsxXS52aXNpYmxlKGZhbHNlKTtcclxuXHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSBcIiMvbG9naW5cIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGNyZWF0ZU1lbnVJdGVtKFwiTXkgUG9ydGZvbGlvXCIsIFwiIy91c2Vycy86cHJvZmlsZUlkXCIpLCAvL3RoaW5rIGFib3V0IHNvbHV0aW9uIGZvciBsb2dnZWQgaW4gcHJvZmlsZXNcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJUcmFkZVwiLCBcIiMvdHJhZGVcIiksXHJcblx0XHRcdGNyZWF0ZU1lbnVJdGVtKFwiQ2hhcnRzXCIsIFwiIy9jaGFydHNcIilcclxuXHRcdF07XHJcblxyXG5cdFx0dmFyIHJlc291cmNlID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHRcdHZhciBzeW1ib2wgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cdFx0dmFyIHVzZXIgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cclxuXHRcdFNhbW15KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmdldChcIiMvbG9naW5cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJsb2dpblwiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL3VzZXJzLzpwcm9maWxlSWRcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJwcm9maWxlXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvdHJhZGVcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJ0cmFkZVwiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL2NoYXJ0c1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcImNoYXJ0c1wiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL2NoYXJ0cy86c3ltYm9sXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHN5bWJvbCh0aGlzLnBhcmFtcy5zeW1ib2wpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiYSBjaGFydCBzaG91bGQgYmUgaGVyZSB3aXRoOiBcIiArIHN5bWJvbCgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIlwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlJvb3QgbG9sXCIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pLnJ1bigpO1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1lbnU6IG1lbnUsXHJcblx0XHRcdHJlc291cmNlOiByZXNvdXJjZSxcclxuXHRcdFx0c3ltYm9sOiBzeW1ib2wsXHJcblx0XHRcdGJhc2VSb3V0ZTogYmFzZVJvdXRlLFxyXG5cdFx0XHR1c2VyOiB1c2VyXHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cIm1lbnVcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiB7IGRhdGE6IG1lbnUsIGFzOiBcXCdtZW51SXRlbVxcJ31cIj5cXG4gICAgPHNwYW4+XFxuICAgIFx0PGtub2ItYnV0dG9uIGNsYXNzPVwibWVudS1pdGVtXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogbWVudUl0ZW0udmlzaWJsZVwiIHBhcmFtcz1cIlxcbiAgICBcdFx0bGFiZWw6IG1lbnVJdGVtLmxhYmVsLFxcbiAgICBcdFx0Y2xpY2s6IG1lbnVJdGVtLmNsaWNrXFxuICAgIFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG4gICAgPC9zcGFuPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IG51bGxcIj5cXG5cdDxoMSBkYXRhLWJpbmQ9XCJ0ZXh0OiBcXCdXZWxjb21lIHRvIHRoZSBWaXJ0dWFsIFN0b2NrIE1hcmtldCFcXCdcIj48L2gxPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2xvZ2luXFwnIHx8IHVzZXIoKSA9PT0gbnVsbFwiPlxcblx0PGxvZ2luLXN1cmZhY2UgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXIsXFxuXHRcdG1lbnU6IG1lbnVcXG5cdFwiPjwvbG9naW4tc3VyZmFjZT5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdwcm9maWxlXFwnICYmIHVzZXIoKSAhPT0gbnVsbFwiPlxcblx0PHByb2ZpbGUtY29tcG9uZW50IHBhcmFtcz1cIlxcblx0XHRuYW1lOiBcXCdEZWZ1YWx0IFVzZXJcXCcsXFxuXHRcdHByb2ZpbGVQaWN0dXJlVXJsOiBcXCdodHRwOi8vd3d3Lm11a2VzaGFtYmFuaS5jb20vcGhvdG8vZGVmYXVsdC5qcGdcXCcsXFxuXHRcdGJhbGFuY2U6IDEwMDAwLFxcblx0XHR1c2VyOiB1c2VyXFxuXHRcIj48L3Byb2ZpbGUtY29tcG9uZW50PlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ3RyYWRlXFwnICYmIHVzZXIoKSAhPSBudWxsXCI+XFxuXHQ8dHJhZGVyLWNvbXBvbmVudCBwYXJhbXM9XCJcXG5cdFx0dXNlcjogdXNlclxcblx0XCI+PC90cmFkZXItY29tcG9uZW50PlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2NoYXJ0c1xcJyAmJiBzeW1ib2woKSA9PSBudWxsICYmIHVzZXIoKSAhPT0gbnVsbFwiPlxcblx0PGNoYXJ0LWNob29zZXIgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXIsXFxuXHRcdGJhc2VSb3V0ZTogYmFzZVJvdXRlXFxuXHRcIj48L2NoYXJ0LWNob29zZXI+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwnY2hhcnRzXFwnICYmIHN5bWJvbCgpICE9IG51bGwgJiYgdXNlcigpICE9IG51bGxcIj5cXG5cdDxjaGFydC1jb21wb25lbnQgcGFyYW1zPVwiXFxuXHRcdFx0dXNlcjogdXNlcixcXG5cdFx0XHR1cmw6IFxcJy4vY2hhcnRfZGF0YS9mb3JtYXR0ZWQ1MFxcJyxcXG5cdFx0XHRkaXZJZDogXFwnZm9ybWF0NTBcXCdcXG5cdFx0XCI+PC9jaGFydC1jb21wb25lbnQ+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY3JlYXRlTWFpbkNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZU1haW5Db21wb25lbnQoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcubmFtZSAmJiB0eXBlb2YgY29uZmlnLm5hbWUgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm5hbWUgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBzdHJpbmchXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcucHJvZmlsZVBpY3R1cmVVcmwgJiYgdHlwZW9mIGNvbmZpZy5wcm9maWxlUGljdHVyZVVybCAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcucHJvZmlsZVBpY3R1cmVVcmwgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBzdHJpbmchXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcuYmFsYW5jZSAmJiB0eXBlb2YgY29uZmlnLmJhbGFuY2UgIT09IFwibnVtYmVyXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJhbGFuY2UgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBudW1iZXIhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBuYW1lID0gY29uZmlnLm5hbWU7XHJcblx0XHR2YXIgcHJvZmlsZVBpY3R1cmVVcmwgPSBjb25maWcucHJvZmlsZVBpY3R1cmVVcmw7XHJcblx0XHR2YXIgYmFsYW5jZSA9IGNvbmZpZy5iYWxhbmNlO1xyXG5cdFx0dmFyIHVzZXIgPSBjb25maWcudXNlciB8fCBmdW5jdGlvbigpIHt9OyAvL2ZpeCB0aGlzLCB0ZW1wb3JhcnlcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lOiBuYW1lLFxyXG5cdFx0XHRwcm9maWxlUGljdHVyZVVybDogcHJvZmlsZVBpY3R1cmVVcmwsXHJcblx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXHJcblx0XHRcdHVzZXI6IHVzZXJcclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGRpdj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogXFwnVXNlcm5hbWU6IFxcJyArIHVzZXIoKS5uYW1lXCI+PC9zcGFuPlxcblx0XHQ8aW1nIGRhdGEtYmluZD1cImF0dHI6IHtzcmM6IHVzZXIoKS5wcm9maWxlVXJsLCBoZWlnaHQ6IDEwMCwgd2lkdGg6IDEwMH1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogXFwnQmFsYW5jZTogXFwnICsgdXNlcigpLmJhbGFuY2UgKyBcXCckXFwnXCI+PC9zcGFuPlxcblx0PC9kaXY+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY3JlYXRlUHJvZmlsZUNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVByb2ZpbGVDb21wb25lbnQoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKGNvbmZpZy51c2VyID09PSBudWxsKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy51c2VyIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHVzZXIgPSBjb25maWcudXNlcjtcclxuXHJcblx0XHRjb25zdCBoZWFkZXIgPSBcIlRyYWRlXCI7XHJcblx0XHRjb25zdCBzeW1ib2xMYWJlbCA9IFwiU3ltYm9sIFwiO1xyXG5cdFx0Y29uc3QgdHJhbnNhY3Rpb25MYWJlbCA9IFwiVHJhbnNhY3Rpb24gXCI7XHJcblx0XHRjb25zdCB0cmFuc2FjdGlvblF1YW50aXR5ID0gXCJRdWFudGl0eSBcIjtcclxuXHJcblx0XHR2YXIgc3ltYm9sc0Ryb3Bkb3duID0ge1xyXG5cdFx0XHRzZWxlY3RlZFN5bWJvbDoga28ub2JzZXJ2YWJsZShudWxsKSxcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2xJZHg6IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdHN5bWJvbHM6IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiR29vZ2xlXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJHT09HXCJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxhYmVsOiBcIkFwcGxlXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJBQVBMXCJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxhYmVsOiBcIlZlcnppb25cIixcclxuXHRcdFx0XHRcdHZhbHVlOiBcIlZaXCJcclxuXHRcdFx0XHR9XHJcblx0XHRcdF0pXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciB0cmFuc2FjdGlvblZhbHVlID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuXHRcdFxyXG5cdFx0dmFyIG9wdGlvbnNEcm9wZG93biA9IHtcclxuXHRcdFx0c2VsZWN0ZWRPcHRpb246IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdHNlbGVjdGVkT3B0aW9uSWR4OiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRvcHRpb25zIDoga28ub2JzZXJ2YWJsZUFycmF5KFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJCdXlcIixcclxuXHRcdFx0XHRcdHZhbHVlOiBcImJ1eVwiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJTZWxsXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJzZWxsXCJcclxuXHRcdFx0XHR9XHJcblx0XHRcdF0pXHRcdFxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgdHJhbnNhY3Rpb25CdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIk1ha2UgdHJhbnNhY3Rpb25cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiQXR0ZW1wdGluZyB0byBcIiArIG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbigpLnZhbHVlICtcclxuXHRcdFx0XHQgXCIgXCIgKyB0cmFuc2FjdGlvblZhbHVlKCkgKyBcIiBzdG9ja3NcIiArXHJcblx0XHRcdFx0IFwiIGZyb20gXCIgKyBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2woKS5sYWJlbCgpICsgXCIgd2l0aCB0aGUgc3ltYm9sOiBcIiArXHJcblx0XHRcdFx0ICBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2woKS52YWx1ZSk7XHJcblxyXG5cdFx0XHRcdHZhciBwb3N0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdFx0dmFyIHRyYWRlUGFyYW1zID0gXCJ1c2VyPVwiICsgdXNlcigpLnVzZXJOYW1lICsgXCImdHJhbnNhY3Rpb25UeXBlPVwiICtcclxuXHRcdFx0XHQgb3B0aW9uc0Ryb3Bkb3duLnNlbGVjdGVkT3B0aW9uKCkudmFsdWUgKyBcIiZ0cmFuc2FjdGlvblZhbHVlPVwiICsgdHJhbnNhY3Rpb25WYWx1ZSgpO1xyXG5cclxuXHRcdFx0XHQgcG9zdC5vcGVuKFwiUE9TVFwiLCBcIi4vdHJhbnNhY3Rpb25cIiwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRcdCBwb3N0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCBcdGlmKHBvc3QucmVhZHlTdGF0ZSA9PSA0LCBwb3N0LnN0YXR1cyA9PSAyMDApIHtcclxuXHRcdFx0XHQgXHRcdHZhciBtb2RpZmllZEJhbGFuZVVzZXIgPSB1c2VyKCk7XHJcblx0XHRcdFx0IFx0XHRtb2RpZmllZEJhbGFuZVVzZXIuYmFsYW5jZSA9IHBvc3QucmVzcG9uc2VUZXh0O1xyXG5cdFx0XHRcdCBcdFx0dXNlcihtb2RpZmllZEJhbGFuZVVzZXIpO1xyXG5cdFx0XHRcdCBcdFx0bG9jYXRpb24uaGFzaCA9IFwiL3VzZXJzL1wiICsgdXNlcigpLnVzZXJOYW1lO1xyXG5cdFx0XHRcdCBcdH1cclxuXHRcdFx0XHQgfVxyXG5cclxuXHRcdFx0XHQgcG9zdC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xyXG5cdFx0XHRcdCBwb3N0LnNlbmQodHJhZGVQYXJhbXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGhlYWRlcjogaGVhZGVyLFxyXG5cdFx0XHRzeW1ib2xMYWJlbDogc3ltYm9sTGFiZWwsXHJcblx0XHRcdHRyYW5zYWN0aW9uTGFiZWw6IHRyYW5zYWN0aW9uTGFiZWwsXHJcblx0XHRcdHRyYW5zYWN0aW9uUXVhbnRpdHk6IHRyYW5zYWN0aW9uUXVhbnRpdHksXHJcblx0XHRcdHN5bWJvbHNEcm9wZG93bjogc3ltYm9sc0Ryb3Bkb3duLFxyXG5cdFx0XHRvcHRpb25zRHJvcGRvd246IG9wdGlvbnNEcm9wZG93bixcclxuXHRcdFx0dHJhbnNhY3Rpb25CdXR0b246IHRyYW5zYWN0aW9uQnV0dG9uLFxyXG5cdFx0XHR0cmFuc2FjdGlvblZhbHVlOiB0cmFuc2FjdGlvblZhbHVlXHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxoMiBkYXRhLWJpbmQ9XCJ0ZXh0OiBoZWFkZXJcIj48L2gyPlxcblx0PHNwYW4+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHN5bWJvbExhYmVsXCI+PC9zcGFuPlxcblx0XHQ8a25vYi1kcm9wZG93biBwYXJhbXM9XCJcXG5cdFx0XHRzZWxlY3RlZDogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sLFxcblx0XHRcdGl0ZW1zOiBzeW1ib2xzRHJvcGRvd24uc3ltYm9scyxcXG5cdFx0XHRzZWxlY3RlZElkeDogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sSWR4LFxcblx0XHRcdHJpZ2h0SWNvbjogXFwnI2ljb24tZXhwYW5kLW1vcmVcXCdcXG5cdFx0XCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRyYW5zYWN0aW9uTGFiZWxcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdHNlbGVjdGVkOiBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb24sXFxuXHRcdFx0aXRlbXM6IG9wdGlvbnNEcm9wZG93bi5vcHRpb25zLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb25JZHgsXFxuXHRcdFx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJ1xcblx0XHRcIj48L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdHJhbnNhY3Rpb25RdWFudGl0eVwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdFx0dmFsdWU6IHRyYW5zYWN0aW9uVmFsdWVcXG5cdFx0XCI+PC9rbm9iLWlucHV0Plxcblx0PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRsYWJlbDogdHJhbnNhY3Rpb25CdXR0b24ubGFiZWwsXFxuXHRcdFx0Y2xpY2s6IHRyYW5zYWN0aW9uQnV0dG9uLmNsaWNrXFxuXHRcdFwiPjwva25vYi1idXR0b24+XFxuXHQ8L3NwYW4+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgdHJhZGVyQ29tcG9uZW50Q29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRyYWRlckNvbXBvbmVudENvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiXX0=
