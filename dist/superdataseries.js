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

		if(!config.user && typeof config.user !== "function") {
			throw new Error("config.user is mandatory and it should be a knockout observable!");
		}

		var user = config.user;
		var loginLabel = config.loginLabel;
		var menu = config.menu;

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
				 		//console.log(post.responseText);
				 		var modifiedBalaneUser = user();
				 		modifiedBalaneUser.balance = post.responseText;
				 		user(modifiedBalaneUser);
				 		//console.log(user());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q2hvb3Nlci9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvY2hhcnRDaG9vc2VyL3ZtLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL2NvcmUuanMiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2Uvdm0uanMiLCJzcmMvcHVibGljL21haW4uanMiLCJzcmMvcHVibGljL21haW5Db21wb25lbnQvY29yZS5qcyIsInNyYy9wdWJsaWMvbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9tYWluQ29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9wcm9maWxlQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvcHJvZmlsZUNvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvdHJhZGVyQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy90cmFkZXJDb21wb25lbnQvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcuYmFzZVJvdXRlICYmIHR5cGVvZiBjb25maWcuYmFzZVJvdXRlICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5iYXNlUm91dGUgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBzdHJpbmchXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGJhc2VSb3V0ZSA9IGNvbmZpZy5iYXNlUm91dGU7XHJcblx0XHRcclxuXHRcdGNvbnN0IGRyb3Bkb3duTGFiZWwgPSBcIlN0b2NrczogXCI7XHJcblx0XHR2YXIgc3ltYm9scyA9IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJHb29nbGVcIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wxXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkFwcGxlXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MMlwiXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJWZXJ6aW9uXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MM1wiXHJcblx0XHRcdH1cclxuXHRcdF0pO1xyXG5cclxuXHRcdHZhciBzZWxlY3RlZCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblx0XHR2YXIgc2VsZWN0ZWRJZHggPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cclxuXHRcdHZhciBsb2FkQ2hhcnQgPSB7XHJcblx0XHRcdGxhYmVsOiBcIlNlbGVjdFwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IGxvY2F0aW9uLmhhc2ggKyBcIi9cIiArIHNlbGVjdGVkKCkudmFsdWVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRyb3Bkb3duTGFiZWw6IGRyb3Bkb3duTGFiZWwsXHJcblx0XHRcdHN5bWJvbHM6IHN5bWJvbHMsXHJcblx0XHRcdHNlbGVjdGVkOiBzZWxlY3RlZCxcclxuXHRcdFx0c2VsZWN0ZWRJZHg6IHNlbGVjdGVkSWR4LFxyXG5cdFx0XHRsb2FkQ2hhcnQ6IGxvYWRDaGFydFxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBkcm9wZG93bkxhYmVsXCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRcdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxcblx0XHRcdGl0ZW1zOiBzeW1ib2xzLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBzZWxlY3RlZElkeCxcXG5cdFx0XHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnXFxuXHRcdFwiPlxcblx0XHQ8L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IGxvYWRDaGFydC5sYWJlbCxcXG5cdFx0Y2xpY2s6IGxvYWRDaGFydC5jbGlja1xcblx0XCI+XFxuXHQ8L2tub2ItYnV0dG9uPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNoYXJ0Q2hvb3NlckNvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydENob29zZXJDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLnVybCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXJsIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5kaXZJZCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZGl2SWQgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2hhcnRVcmwgPSBjb25maWcudXJsO1xyXG5cdFx0dmFyIGRpdklkID0gY29uZmlnLmRpdklkO1xyXG5cclxuXHRcdHZhciBjaGFydCA9IGMzLmdlbmVyYXRlKHtcclxuXHRcdFx0YmluZHRvOiBcIiNcIiArIGRpdklkLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0eDogXCJ4XCIsXHJcblx0XHRcdFx0eEZvcm1hdDogXCIlWS0lbS0lZCAlSDolTTolU1wiLFxyXG5cdFx0XHRcdG1pbWVUeXBlOiBcImNzdlwiLFxyXG5cdFx0XHRcdHVybDogY2hhcnRVcmwsXHJcblx0XHRcdFx0Z3JvdXBzOiBbXHJcblx0XHRcdFx0XHRbXCJIVUYvVVNEXCJdXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRrZXlzOiB7XHJcblx0XHRcdFx0XHR4Rm9ybWF0OiBcIiVZLSVtLSVkICVIOiVNOiVTXCJcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRheGlzOiB7XHJcblx0XHRcdFx0eToge1xyXG5cdFx0XHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXCJQcmljZVwiLFxyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogXCJvdXRlci1taWRkbGVcIlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0eDoge1xyXG5cdFx0XHRcdFx0dHlwZTogXCJ0aW1lc2VyaWVzXCIsXHJcblx0XHRcdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBcIlRpbWVcIixcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IFwibWlkZGxlXCJcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHR0aWNrOiB7XHJcblx0XHRcdFx0XHRcdGZvcm1hdDogXCIlTTolU1wiXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR6b29tOiB7XHJcblx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcclxuXHRcdFx0XHRyZXNjYWxlOiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciB6b29tQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJUZXN0IFpvb21cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRjaGFydC56b29tKFtcclxuXHRcdFx0XHRcdFx0XCIyMDE2LTEwLTAyIDE3OjA0OjE3XCIsXHJcblx0XHRcdFx0XHRcdFwiMjAxNi0xMC0wMiAxNzowNzoyMVwiXSk7XHJcblx0XHRcdFx0fSwgMjAwMCk7XHJcblx0XHRcdFx0Ly9jaGFydC5sb2FkKGNoYXJ0VXJsKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgcmVzZXRCdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIlJlc2V0IENoYXJ0XCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjaGFydC51bnpvb20oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGNoYXJ0OiBjaGFydCxcclxuXHRcdFx0ZGl2SWQ6IGRpdklkLFxyXG5cdFx0XHRyZXNldEJ1dHRvbjogcmVzZXRCdXR0b24sXHJcblx0XHRcdHpvb21CdXR0b246IHpvb21CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGRpdiBkYXRhLWJpbmQ9IFwiYXR0cjoge1xcblx0aWQ6IGRpdklkXFxuXHR9XCI+PC9kaXY+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiB6b29tQnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogem9vbUJ1dHRvbi5jbGlja1wiPlx0XHRcXG5cdDwva25vYi1idXR0b24+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiByZXNldEJ1dHRvbi5sYWJlbCxcXG5cdFx0Y2xpY2s6IHJlc2V0QnV0dG9uLmNsaWNrXFxuXHRcIj48L2tub2ItYnV0dG9uPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNoYXJ0Q29tcG9uZW50Q29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0Q29tcG9uZW50Q29yZSh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRpZighZGVwZW5kZW5jaWVzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnlcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiBjcmVhdGVMb2dpblN1cmZhY2UoY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZykge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnVzZXIgJiYgdHlwZW9mIGNvbmZpZy51c2VyICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnVzZXIgaXMgbWFuZGF0b3J5IGFuZCBpdCBzaG91bGQgYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdXNlciA9IGNvbmZpZy51c2VyO1xyXG5cdFx0dmFyIGxvZ2luTGFiZWwgPSBjb25maWcubG9naW5MYWJlbDtcclxuXHRcdHZhciBtZW51ID0gY29uZmlnLm1lbnU7XHJcblxyXG5cdFx0dmFyIHVzZXJJbnB1dCA9IHtcclxuXHRcdFx0cGxhY2Vob2xkZXI6IFwiVXNlck5hbWVcIixcclxuXHRcdFx0dmFsdWU6IGtvLm9ic2VydmFibGUobnVsbClcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHBhc3N3b3JkSW5wdXQgPSB7XHJcblx0XHRcdHBsYWNlaG9sZGVyOiBcInBhc3N3b3JkXCIsXHJcblx0XHRcdHZhbHVlOiBrby5vYnNlcnZhYmxlKG51bGwpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2dpbkJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiTG9naW5cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciB1c2VyUGFyYW1zID0gXCJ1c2VyPVwiICsgdXNlcklucHV0LnZhbHVlKCkgKyBcIiZwYXNzPVwiICsgcGFzc3dvcmRJbnB1dC52YWx1ZSgpO1xyXG5cdFx0XHRcdHZhciBwb3N0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0cG9zdC5vcGVuKFwiUE9TVFwiLCBcIi4vbG9naW5yZXF1ZXN0XCIsIHRydWUpO1xyXG5cclxuXHRcdFx0XHRwb3N0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXHRcdFx0XHRpZihwb3N0LnJlYWR5U3RhdGUgPT0gNCAmJiBwb3N0LnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICBcdFx0XHRcdGNvbnNvbGUubG9nKHBvc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBcdFx0XHRcdHVzZXIoSlNPTi5wYXJzZShwb3N0LnJlc3BvbnNlVGV4dCkpO1xyXG4gICAgICAgIFx0XHRcdFx0bWVudVswXS52aXNpYmxlKGZhbHNlKTtcclxuICAgICAgICBcdFx0XHRcdG1lbnVbMV0udmlzaWJsZSh0cnVlKTtcclxuICAgICAgICBcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSBcIi91c2Vycy9cIiArIHVzZXIoKS51c2VyTmFtZTtcclxuICAgIFx0XHRcdFx0fVx0XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRwb3N0LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XHJcblx0XHRcdFx0cG9zdC5zZW5kKHVzZXJQYXJhbXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHVzZXJJbnB1dDogdXNlcklucHV0LFxyXG5cdFx0XHRwYXNzd29yZElucHV0OiBwYXNzd29yZElucHV0LFxyXG5cdFx0XHRsb2dpbkJ1dHRvbjogbG9naW5CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdHZhbHVlOiB1c2VySW5wdXQudmFsdWUsXFxuXHRcdHBsYWNlaG9sZGVyOiB1c2VySW5wdXQucGxhY2Vob2xkZXJcXG5cdFwiPjwva25vYi1pbnB1dD5cXG48L2Rpdj5cXG48ZGl2Plxcblx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdHZhbHVlOiBwYXNzd29yZElucHV0LnZhbHVlLFxcblx0XHRwbGFjZWhvbGRlcjogcGFzc3dvcmRJbnB1dC5wbGFjZWhvbGRlcixcXG5cdFx0dHlwZTogXFwncGFzc3dvcmRcXCdcXG5cdFwiPjwva25vYi1pbnB1dD5cXG48L2Rpdj5cXG48ZGl2Plxcblx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRsYWJlbDogbG9naW5CdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiBsb2dpbkJ1dHRvbi5jbGlja1xcblx0XCI+PC9rbm9iLWJ1dHRvbj5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBsb2dpblN1cmZhY2VDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbG9naW5TdXJmYWNlQ29yZSh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtub2IgPSAod2luZG93Lmtub2IpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwiY2hhcnQtY2hvb3NlclwiLCByZXF1aXJlKFwiLi9jaGFydENob29zZXIvdm1cIiksIHJlcXVpcmUoXCIuL2NoYXJ0Q2hvb3Nlci90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwicHJvZmlsZS1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vcHJvZmlsZUNvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vcHJvZmlsZUNvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwidHJhZGVyLWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi90cmFkZXJDb21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwibG9naW4tc3VyZmFjZVwiLCByZXF1aXJlKFwiLi9sb2dpblN1cmZhY2Uvdm1cIiksIHJlcXVpcmUoXCIuL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwiY2hhcnQtY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL2NoYXJ0Q29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwibWFpbi1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vbWFpbkNvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbml0OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRpZighZGVwZW5kZW5jaWVzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9IFxyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGNvbnN0IGJhc2VSb3V0ZSA9IFwibG9jYWxob3N0Ojg4ODhcIjtcclxuXHJcblx0XHRmdW5jdGlvbiBjcmVhdGVNZW51SXRlbShsYWJlbCwgdXJsKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bGFiZWw6IGxhYmVsLFxyXG5cdFx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRcdHZpc2libGU6IGtvLm9ic2VydmFibGUodHJ1ZSksXHJcblx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYodXNlcigpID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSBcIiMvbG9naW5cIjtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZih1c2VyKCkgIT09IG51bGwgJiYgbGFiZWwgPT09IFwiTXkgUG9ydGZvbGlvXCIpIHtcclxuXHRcdFx0XHRcdFx0dXJsID0gXCIjL3VzZXJzL1wiICsgdXNlcigpLnVzZXJOYW1lO1xyXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gdXJsO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IHVybDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbWVudSA9IFtcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJMb2dpblwiLCBcIiMvbG9naW5cIiksXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJMb2dvdXRcIixcclxuXHRcdFx0XHR1cmw6IFwiIy9sb2dpblwiLFxyXG5cdFx0XHRcdHZpc2libGU6IGtvLm9ic2VydmFibGUoZmFsc2UpLFxyXG5cdFx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHVzZXIobnVsbCk7XHJcblx0XHRcdFx0XHRtZW51WzBdLnZpc2libGUodHJ1ZSk7XHJcblx0XHRcdFx0XHRtZW51WzFdLnZpc2libGUoZmFsc2UpO1xyXG5cdFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IFwiIy9sb2dpblwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJNeSBQb3J0Zm9saW9cIiwgXCIjL3VzZXJzLzpwcm9maWxlSWRcIiksIC8vdGhpbmsgYWJvdXQgc29sdXRpb24gZm9yIGxvZ2dlZCBpbiBwcm9maWxlc1xyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIlRyYWRlXCIsIFwiIy90cmFkZVwiKSxcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJDaGFydHNcIiwgXCIjL2NoYXJ0c1wiKVxyXG5cdFx0XTtcclxuXHJcblx0XHR2YXIgcmVzb3VyY2UgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cdFx0dmFyIHN5bWJvbCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblx0XHR2YXIgdXNlciA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblxyXG5cdFx0U2FtbXkoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuZ2V0KFwiIy9sb2dpblwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcImxvZ2luXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvdXNlcnMvOnByb2ZpbGVJZFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcInByb2ZpbGVcIik7XHJcblx0XHRcdFx0c3ltYm9sKG51bGwpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc291cmNlKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy90cmFkZVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcInRyYWRlXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvY2hhcnRzXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwiY2hhcnRzXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvY2hhcnRzLzpzeW1ib2xcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3ltYm9sKHRoaXMucGFyYW1zLnN5bWJvbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJhIGNoYXJ0IHNob3VsZCBiZSBoZXJlIHdpdGg6IFwiICsgc3ltYm9sKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUm9vdCBsb2xcIik7XHJcblx0XHRcdH0pO1x0XHJcblx0XHR9KS5ydW4oKTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtZW51OiBtZW51LFxyXG5cdFx0XHRyZXNvdXJjZTogcmVzb3VyY2UsXHJcblx0XHRcdHN5bWJvbDogc3ltYm9sLFxyXG5cdFx0XHRiYXNlUm91dGU6IGJhc2VSb3V0ZSxcclxuXHRcdFx0dXNlcjogdXNlclxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJtZW51XCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogeyBkYXRhOiBtZW51LCBhczogXFwnbWVudUl0ZW1cXCd9XCI+XFxuICAgIDxzcGFuPlxcbiAgICBcdDxrbm9iLWJ1dHRvbiBjbGFzcz1cIm1lbnUtaXRlbVwiIGRhdGEtYmluZD1cInZpc2libGU6IG1lbnVJdGVtLnZpc2libGVcIiBwYXJhbXM9XCJcXG4gICAgXHRcdGxhYmVsOiBtZW51SXRlbS5sYWJlbCxcXG4gICAgXHRcdGNsaWNrOiBtZW51SXRlbS5jbGlja1xcbiAgICBcdFwiPjwva25vYi1idXR0b24+XFxuICAgIDwvc3Bhbj5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBudWxsXCI+XFxuXHQ8aDEgZGF0YS1iaW5kPVwidGV4dDogXFwnV2VsY29tZSB0byB0aGUgVmlydHVhbCBTdG9jayBNYXJrZXQhXFwnXCI+PC9oMT5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdsb2dpblxcJyB8fCB1c2VyKCkgPT09IG51bGxcIj5cXG5cdDxsb2dpbi1zdXJmYWNlIHBhcmFtcz1cIlxcblx0XHR1c2VyOiB1c2VyLFxcblx0XHRtZW51OiBtZW51XFxuXHRcIj48L2xvZ2luLXN1cmZhY2U+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwncHJvZmlsZVxcJyAmJiB1c2VyKCkgIT09IG51bGxcIj5cXG5cdDxwcm9maWxlLWNvbXBvbmVudCBwYXJhbXM9XCJcXG5cdFx0bmFtZTogXFwnRGVmdWFsdCBVc2VyXFwnLFxcblx0XHRwcm9maWxlUGljdHVyZVVybDogXFwnaHR0cDovL3d3dy5tdWtlc2hhbWJhbmkuY29tL3Bob3RvL2RlZmF1bHQuanBnXFwnLFxcblx0XHRiYWxhbmNlOiAxMDAwMCxcXG5cdFx0dXNlcjogdXNlclxcblx0XCI+PC9wcm9maWxlLWNvbXBvbmVudD5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCd0cmFkZVxcJyAmJiB1c2VyKCkgIT0gbnVsbFwiPlxcblx0PHRyYWRlci1jb21wb25lbnQgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXJcXG5cdFwiPjwvdHJhZGVyLWNvbXBvbmVudD5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdjaGFydHNcXCcgJiYgc3ltYm9sKCkgPT0gbnVsbCAmJiB1c2VyKCkgIT09IG51bGxcIj5cXG5cdDxjaGFydC1jaG9vc2VyIHBhcmFtcz1cIlxcblx0XHR1c2VyOiB1c2VyLFxcblx0XHRiYXNlUm91dGU6IGJhc2VSb3V0ZVxcblx0XCI+PC9jaGFydC1jaG9vc2VyPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2NoYXJ0c1xcJyAmJiBzeW1ib2woKSAhPSBudWxsICYmIHVzZXIoKSAhPSBudWxsXCI+XFxuXHQ8Y2hhcnQtY29tcG9uZW50IHBhcmFtcz1cIlxcblx0XHRcdHVzZXI6IHVzZXIsXFxuXHRcdFx0dXJsOiBcXCcuL2NoYXJ0X2RhdGEvZm9ybWF0dGVkNTBcXCcsXFxuXHRcdFx0ZGl2SWQ6IFxcJ2Zvcm1hdDUwXFwnXFxuXHRcdFwiPjwvY2hhcnQtY29tcG9uZW50PlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNyZWF0ZU1haW5Db21wb25lbnQgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVNYWluQ29tcG9uZW50KHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLm5hbWUgJiYgdHlwZW9mIGNvbmZpZy5uYW1lICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5uYW1lIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsICYmIHR5cGVvZiBjb25maWcucHJvZmlsZVBpY3R1cmVVcmwgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLmJhbGFuY2UgJiYgdHlwZW9mIGNvbmZpZy5iYWxhbmNlICE9PSBcIm51bWJlclwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5iYWxhbmNlIGlzIG1hbmRhdG9yeSBhbmQgc2hvdWxkIGJlIGEgbnVtYmVyIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbmFtZSA9IGNvbmZpZy5uYW1lO1xyXG5cdFx0dmFyIHByb2ZpbGVQaWN0dXJlVXJsID0gY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsO1xyXG5cdFx0dmFyIGJhbGFuY2UgPSBjb25maWcuYmFsYW5jZTtcclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXIgfHwgZnVuY3Rpb24oKSB7fTsgLy9maXggdGhpcywgdGVtcG9yYXJ5XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZTogbmFtZSxcclxuXHRcdFx0cHJvZmlsZVBpY3R1cmVVcmw6IHByb2ZpbGVQaWN0dXJlVXJsLFxyXG5cdFx0XHRiYWxhbmNlOiBiYWxhbmNlLFxyXG5cdFx0XHR1c2VyOiB1c2VyXHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxkaXY+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IFxcJ1VzZXJuYW1lOiBcXCcgKyB1c2VyKCkubmFtZVwiPjwvc3Bhbj5cXG5cdFx0PGltZyBkYXRhLWJpbmQ9XCJhdHRyOiB7c3JjOiB1c2VyKCkucHJvZmlsZVVybCwgaGVpZ2h0OiAxMDAsIHdpZHRoOiAxMDB9XCI+XFxuXHQ8L2Rpdj5cXG5cdDxkaXY+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IFxcJ0JhbGFuY2U6IFxcJyArIHVzZXIoKS5iYWxhbmNlICsgXFwnJFxcJ1wiPjwvc3Bhbj5cXG5cdDwvZGl2PlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNyZWF0ZVByb2ZpbGVDb21wb25lbnQgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVQcm9maWxlQ29tcG9uZW50KHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZihjb25maWcudXNlciA9PT0gbnVsbCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXNlciBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXI7XHJcblxyXG5cdFx0Y29uc3QgaGVhZGVyID0gXCJUcmFkZVwiO1xyXG5cdFx0Y29uc3Qgc3ltYm9sTGFiZWwgPSBcIlN5bWJvbCBcIjtcclxuXHRcdGNvbnN0IHRyYW5zYWN0aW9uTGFiZWwgPSBcIlRyYW5zYWN0aW9uIFwiO1xyXG5cdFx0Y29uc3QgdHJhbnNhY3Rpb25RdWFudGl0eSA9IFwiUXVhbnRpdHkgXCI7XHJcblxyXG5cdFx0dmFyIHN5bWJvbHNEcm9wZG93biA9IHtcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2w6IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdHNlbGVjdGVkU3ltYm9sSWR4OiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzeW1ib2xzOiBrby5vYnNlcnZhYmxlQXJyYXkoW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxhYmVsOiBcIkdvb2dsZVwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwiR09PR1wiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJBcHBsZVwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwiQUFQTFwiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJWZXJ6aW9uXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJWWlwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgdHJhbnNhY3Rpb25WYWx1ZSA9IGtvLm9ic2VydmFibGUoMCk7XHJcblx0XHRcclxuXHRcdHZhciBvcHRpb25zRHJvcGRvd24gPSB7XHJcblx0XHRcdHNlbGVjdGVkT3B0aW9uOiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzZWxlY3RlZE9wdGlvbklkeDoga28ub2JzZXJ2YWJsZShudWxsKSxcclxuXHRcdFx0b3B0aW9ucyA6IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiQnV5XCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJidXlcIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiU2VsbFwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwic2VsbFwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdKVx0XHRcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHRyYW5zYWN0aW9uQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJNYWtlIHRyYW5zYWN0aW9uXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gXCIgKyBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb24oKS52YWx1ZSArXHJcblx0XHRcdFx0IFwiIFwiICsgdHJhbnNhY3Rpb25WYWx1ZSgpICsgXCIgc3RvY2tzXCIgK1xyXG5cdFx0XHRcdCBcIiBmcm9tIFwiICsgc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkubGFiZWwoKSArIFwiIHdpdGggdGhlIHN5bWJvbDogXCIgK1xyXG5cdFx0XHRcdCAgc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkudmFsdWUpO1xyXG5cclxuXHRcdFx0XHR2YXIgcG9zdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHRcdHZhciB0cmFkZVBhcmFtcyA9IFwidXNlcj1cIiArIHVzZXIoKS51c2VyTmFtZSArIFwiJnRyYW5zYWN0aW9uVHlwZT1cIiArXHJcblx0XHRcdFx0IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbigpLnZhbHVlICsgXCImdHJhbnNhY3Rpb25WYWx1ZT1cIiArIHRyYW5zYWN0aW9uVmFsdWUoKTtcclxuXHJcblx0XHRcdFx0IHBvc3Qub3BlbihcIlBPU1RcIiwgXCIuL3RyYW5zYWN0aW9uXCIsIHRydWUpO1xyXG5cclxuXHRcdFx0XHQgcG9zdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQgXHRpZihwb3N0LnJlYWR5U3RhdGUgPT0gNCwgcG9zdC5zdGF0dXMgPT0gMjAwKSB7XHJcblx0XHRcdFx0IFx0XHQvL2NvbnNvbGUubG9nKHBvc3QucmVzcG9uc2VUZXh0KTtcclxuXHRcdFx0XHQgXHRcdHZhciBtb2RpZmllZEJhbGFuZVVzZXIgPSB1c2VyKCk7XHJcblx0XHRcdFx0IFx0XHRtb2RpZmllZEJhbGFuZVVzZXIuYmFsYW5jZSA9IHBvc3QucmVzcG9uc2VUZXh0O1xyXG5cdFx0XHRcdCBcdFx0dXNlcihtb2RpZmllZEJhbGFuZVVzZXIpO1xyXG5cdFx0XHRcdCBcdFx0Ly9jb25zb2xlLmxvZyh1c2VyKCkpO1xyXG5cdFx0XHRcdCBcdFx0bG9jYXRpb24uaGFzaCA9IFwiL3VzZXJzL1wiICsgdXNlcigpLnVzZXJOYW1lO1xyXG5cdFx0XHRcdCBcdH1cclxuXHRcdFx0XHQgfVxyXG5cclxuXHRcdFx0XHQgcG9zdC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xyXG5cdFx0XHRcdCBwb3N0LnNlbmQodHJhZGVQYXJhbXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGhlYWRlcjogaGVhZGVyLFxyXG5cdFx0XHRzeW1ib2xMYWJlbDogc3ltYm9sTGFiZWwsXHJcblx0XHRcdHRyYW5zYWN0aW9uTGFiZWw6IHRyYW5zYWN0aW9uTGFiZWwsXHJcblx0XHRcdHRyYW5zYWN0aW9uUXVhbnRpdHk6IHRyYW5zYWN0aW9uUXVhbnRpdHksXHJcblx0XHRcdHN5bWJvbHNEcm9wZG93bjogc3ltYm9sc0Ryb3Bkb3duLFxyXG5cdFx0XHRvcHRpb25zRHJvcGRvd246IG9wdGlvbnNEcm9wZG93bixcclxuXHRcdFx0dHJhbnNhY3Rpb25CdXR0b246IHRyYW5zYWN0aW9uQnV0dG9uLFxyXG5cdFx0XHR0cmFuc2FjdGlvblZhbHVlOiB0cmFuc2FjdGlvblZhbHVlXHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxoMiBkYXRhLWJpbmQ9XCJ0ZXh0OiBoZWFkZXJcIj48L2gyPlxcblx0PHNwYW4+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHN5bWJvbExhYmVsXCI+PC9zcGFuPlxcblx0XHQ8a25vYi1kcm9wZG93biBwYXJhbXM9XCJcXG5cdFx0XHRzZWxlY3RlZDogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sLFxcblx0XHRcdGl0ZW1zOiBzeW1ib2xzRHJvcGRvd24uc3ltYm9scyxcXG5cdFx0XHRzZWxlY3RlZElkeDogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sSWR4LFxcblx0XHRcdHJpZ2h0SWNvbjogXFwnI2ljb24tZXhwYW5kLW1vcmVcXCdcXG5cdFx0XCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRyYW5zYWN0aW9uTGFiZWxcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdHNlbGVjdGVkOiBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb24sXFxuXHRcdFx0aXRlbXM6IG9wdGlvbnNEcm9wZG93bi5vcHRpb25zLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb25JZHgsXFxuXHRcdFx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJ1xcblx0XHRcIj48L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdHJhbnNhY3Rpb25RdWFudGl0eVwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdFx0dmFsdWU6IHRyYW5zYWN0aW9uVmFsdWVcXG5cdFx0XCI+PC9rbm9iLWlucHV0Plxcblx0PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRsYWJlbDogdHJhbnNhY3Rpb25CdXR0b24ubGFiZWwsXFxuXHRcdFx0Y2xpY2s6IHRyYW5zYWN0aW9uQnV0dG9uLmNsaWNrXFxuXHRcdFwiPjwva25vYi1idXR0b24+XFxuXHQ8L3NwYW4+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgdHJhZGVyQ29tcG9uZW50Q29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRyYWRlckNvbXBvbmVudENvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiXX0=
