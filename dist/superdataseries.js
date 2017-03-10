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
				click: function() {
					
					if(user() === null) {
						location.hash = "#/login";
					} else if(user() !== null && label === "My Portfolio") {
						url = "#/users/" + user().userName;
					}

					location.hash = url;
				}
			}
		}

		var menu = ko.observableArray([
			createMenuItem("Login", "#/login"),
			createMenuItem("My Portfolio", "#/users/:profileId"), //think about solution for logged in profiles
			createMenuItem("Trade", "#/trade"),
			createMenuItem("Charts", "#/charts")
		]);

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
				console.log(resource(), menu());
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
module.exports = '<div class="menu" data-bind="foreach: { data: menu, as: \'menuItem\'}">\n    <span>\n    	<knob-button class="menu-item" params="\n    		label: menuItem.label,\n    		click: menuItem.click\n    	"></knob-button>\n    </span>\n</div>\n<div data-bind="if: resource() === null">\n	<h1 data-bind="text: \'Welcome to the Virtual Stock Market!\'"></h1>\n</div>\n<div data-bind="if: resource() === \'login\' || user() === null">\n	<login-surface params="\n		user: user\n	"></login-surface>\n</div>\n<div data-bind="if: resource() === \'profile\' && user() !== null">\n	<profile-component params="\n		name: \'Defualt User\',\n		profilePictureUrl: \'http://www.mukeshambani.com/photo/default.jpg\',\n		balance: 10000,\n		user: user\n	"></profile-component>\n</div>\n<div data-bind="if: resource() === \'trade\' && user() != null">\n	<trader-component params="\n		user: user\n	"></trader-component>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() == null && user() !== null">\n	<chart-chooser params="\n		user: user,\n		baseRoute: baseRoute\n	"></chart-chooser>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() != null && user() != null">\n	<chart-component params="\n			user: user,\n			url: \'./chart_data/formatted50\',\n			divId: \'format50\'\n		"></chart-component>\n</div>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q2hvb3Nlci9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvY2hhcnRDaG9vc2VyL3ZtLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL2NvcmUuanMiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2Uvdm0uanMiLCJzcmMvcHVibGljL21haW4uanMiLCJzcmMvcHVibGljL21haW5Db21wb25lbnQvY29yZS5qcyIsInNyYy9wdWJsaWMvbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9tYWluQ29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9wcm9maWxlQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvcHJvZmlsZUNvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvdHJhZGVyQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy90cmFkZXJDb21wb25lbnQvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcuYmFzZVJvdXRlICYmIHR5cGVvZiBjb25maWcuYmFzZVJvdXRlICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5iYXNlUm91dGUgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBzdHJpbmchXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGJhc2VSb3V0ZSA9IGNvbmZpZy5iYXNlUm91dGU7XHJcblx0XHRcclxuXHRcdGNvbnN0IGRyb3Bkb3duTGFiZWwgPSBcIlN0b2NrczogXCI7XHJcblx0XHR2YXIgc3ltYm9scyA9IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJHb29nbGVcIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wxXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkFwcGxlXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MMlwiXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsYWJlbDogXCJWZXJ6aW9uXCIsXHJcblx0XHRcdFx0dmFsdWU6IFwiU1lNQk9MM1wiXHJcblx0XHRcdH1cclxuXHRcdF0pO1xyXG5cclxuXHRcdHZhciBzZWxlY3RlZCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblx0XHR2YXIgc2VsZWN0ZWRJZHggPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cclxuXHRcdHZhciBsb2FkQ2hhcnQgPSB7XHJcblx0XHRcdGxhYmVsOiBcIlNlbGVjdFwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IGxvY2F0aW9uLmhhc2ggKyBcIi9cIiArIHNlbGVjdGVkKCkudmFsdWVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRyb3Bkb3duTGFiZWw6IGRyb3Bkb3duTGFiZWwsXHJcblx0XHRcdHN5bWJvbHM6IHN5bWJvbHMsXHJcblx0XHRcdHNlbGVjdGVkOiBzZWxlY3RlZCxcclxuXHRcdFx0c2VsZWN0ZWRJZHg6IHNlbGVjdGVkSWR4LFxyXG5cdFx0XHRsb2FkQ2hhcnQ6IGxvYWRDaGFydFxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBkcm9wZG93bkxhYmVsXCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRcdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxcblx0XHRcdGl0ZW1zOiBzeW1ib2xzLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBzZWxlY3RlZElkeCxcXG5cdFx0XHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnXFxuXHRcdFwiPlxcblx0XHQ8L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IGxvYWRDaGFydC5sYWJlbCxcXG5cdFx0Y2xpY2s6IGxvYWRDaGFydC5jbGlja1xcblx0XCI+XFxuXHQ8L2tub2ItYnV0dG9uPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNoYXJ0Q2hvb3NlckNvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGFydENob29zZXJDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyB8fCB7fTtcclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnLnVybCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXJsIGlzIG1hbmRhdG9yeSFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5kaXZJZCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZGl2SWQgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2hhcnRVcmwgPSBjb25maWcudXJsO1xyXG5cdFx0dmFyIGRpdklkID0gY29uZmlnLmRpdklkO1xyXG5cclxuXHRcdHZhciBjaGFydCA9IGMzLmdlbmVyYXRlKHtcclxuXHRcdFx0YmluZHRvOiBcIiNcIiArIGRpdklkLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0eDogXCJ4XCIsXHJcblx0XHRcdFx0eEZvcm1hdDogXCIlWS0lbS0lZCAlSDolTTolU1wiLFxyXG5cdFx0XHRcdG1pbWVUeXBlOiBcImNzdlwiLFxyXG5cdFx0XHRcdHVybDogY2hhcnRVcmwsXHJcblx0XHRcdFx0Z3JvdXBzOiBbXHJcblx0XHRcdFx0XHRbXCJIVUYvVVNEXCJdXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRrZXlzOiB7XHJcblx0XHRcdFx0XHR4Rm9ybWF0OiBcIiVZLSVtLSVkICVIOiVNOiVTXCJcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRheGlzOiB7XHJcblx0XHRcdFx0eToge1xyXG5cdFx0XHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHRcdFx0dGV4dDogXCJQcmljZVwiLFxyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogXCJvdXRlci1taWRkbGVcIlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0eDoge1xyXG5cdFx0XHRcdFx0dHlwZTogXCJ0aW1lc2VyaWVzXCIsXHJcblx0XHRcdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBcIlRpbWVcIixcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IFwibWlkZGxlXCJcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHR0aWNrOiB7XHJcblx0XHRcdFx0XHRcdGZvcm1hdDogXCIlTTolU1wiXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR6b29tOiB7XHJcblx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcclxuXHRcdFx0XHRyZXNjYWxlOiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciB6b29tQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJUZXN0IFpvb21cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRjaGFydC56b29tKFtcclxuXHRcdFx0XHRcdFx0XCIyMDE2LTEwLTAyIDE3OjA0OjE3XCIsXHJcblx0XHRcdFx0XHRcdFwiMjAxNi0xMC0wMiAxNzowNzoyMVwiXSk7XHJcblx0XHRcdFx0fSwgMjAwMCk7XHJcblx0XHRcdFx0Ly9jaGFydC5sb2FkKGNoYXJ0VXJsKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgcmVzZXRCdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIlJlc2V0IENoYXJ0XCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjaGFydC51bnpvb20oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGNoYXJ0OiBjaGFydCxcclxuXHRcdFx0ZGl2SWQ6IGRpdklkLFxyXG5cdFx0XHRyZXNldEJ1dHRvbjogcmVzZXRCdXR0b24sXHJcblx0XHRcdHpvb21CdXR0b246IHpvb21CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGRpdiBkYXRhLWJpbmQ9IFwiYXR0cjoge1xcblx0aWQ6IGRpdklkXFxuXHR9XCI+PC9kaXY+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiB6b29tQnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogem9vbUJ1dHRvbi5jbGlja1wiPlx0XHRcXG5cdDwva25vYi1idXR0b24+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiByZXNldEJ1dHRvbi5sYWJlbCxcXG5cdFx0Y2xpY2s6IHJlc2V0QnV0dG9uLmNsaWNrXFxuXHRcIj48L2tub2ItYnV0dG9uPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGNoYXJ0Q29tcG9uZW50Q29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0Q29tcG9uZW50Q29yZSh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRpZighZGVwZW5kZW5jaWVzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnlcIik7XHJcblx0fVxyXG5cclxuXHR2YXIga28gPSBkZXBlbmRlbmNpZXMua287XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiBjcmVhdGVMb2dpblN1cmZhY2UoY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZykge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLnVzZXIgJiYgdHlwZW9mIGNvbmZpZy51c2VyICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnVzZXIgaXMgbWFuZGF0b3J5IGFuZCBpdCBzaG91bGQgYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdXNlciA9IGNvbmZpZy51c2VyO1xyXG5cclxuXHRcdHZhciB1c2VySW5wdXQgPSB7XHJcblx0XHRcdHBsYWNlaG9sZGVyOiBcIlVzZXJOYW1lXCIsXHJcblx0XHRcdHZhbHVlOiBrby5vYnNlcnZhYmxlKG51bGwpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBwYXNzd29yZElucHV0ID0ge1xyXG5cdFx0XHRwbGFjZWhvbGRlcjogXCJwYXNzd29yZFwiLFxyXG5cdFx0XHR2YWx1ZToga28ub2JzZXJ2YWJsZShudWxsKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9naW5CdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIkxvZ2luXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgdXNlclBhcmFtcyA9IFwidXNlcj1cIiArIHVzZXJJbnB1dC52YWx1ZSgpICsgXCImcGFzcz1cIiArIHBhc3N3b3JkSW5wdXQudmFsdWUoKTtcclxuXHRcdFx0XHR2YXIgcG9zdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHRcdHBvc3Qub3BlbihcIlBPU1RcIiwgXCIuL2xvZ2lucmVxdWVzdFwiLCB0cnVlKTtcclxuXHJcblx0XHRcdFx0cG9zdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgIFx0XHRcdFx0aWYocG9zdC5yZWFkeVN0YXRlID09IDQgJiYgcG9zdC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgXHRcdFx0XHRjb25zb2xlLmxvZyhwb3N0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgXHRcdFx0XHR1c2VyKEpTT04ucGFyc2UocG9zdC5yZXNwb25zZVRleHQpKTtcclxuICAgICAgICBcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSBcIi91c2Vycy9cIiArIHVzZXIoKS51c2VyTmFtZTtcclxuICAgIFx0XHRcdFx0fVx0XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRwb3N0LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XHJcblx0XHRcdFx0cG9zdC5zZW5kKHVzZXJQYXJhbXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHVzZXJJbnB1dDogdXNlcklucHV0LFxyXG5cdFx0XHRwYXNzd29yZElucHV0OiBwYXNzd29yZElucHV0LFxyXG5cdFx0XHRsb2dpbkJ1dHRvbjogbG9naW5CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdHZhbHVlOiB1c2VySW5wdXQudmFsdWUsXFxuXHRcdHBsYWNlaG9sZGVyOiB1c2VySW5wdXQucGxhY2Vob2xkZXJcXG5cdFwiPjwva25vYi1pbnB1dD5cXG48L2Rpdj5cXG48ZGl2Plxcblx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdHZhbHVlOiBwYXNzd29yZElucHV0LnZhbHVlLFxcblx0XHRwbGFjZWhvbGRlcjogcGFzc3dvcmRJbnB1dC5wbGFjZWhvbGRlcixcXG5cdFx0dHlwZTogXFwncGFzc3dvcmRcXCdcXG5cdFwiPjwva25vYi1pbnB1dD5cXG48L2Rpdj5cXG48ZGl2Plxcblx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRsYWJlbDogbG9naW5CdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiBsb2dpbkJ1dHRvbi5jbGlja1xcblx0XCI+PC9rbm9iLWJ1dHRvbj5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBsb2dpblN1cmZhY2VDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbG9naW5TdXJmYWNlQ29yZSh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtub2IgPSAod2luZG93Lmtub2IpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwiY2hhcnQtY2hvb3NlclwiLCByZXF1aXJlKFwiLi9jaGFydENob29zZXIvdm1cIiksIHJlcXVpcmUoXCIuL2NoYXJ0Q2hvb3Nlci90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwicHJvZmlsZS1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vcHJvZmlsZUNvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vcHJvZmlsZUNvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwidHJhZGVyLWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi90cmFkZXJDb21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwibG9naW4tc3VyZmFjZVwiLCByZXF1aXJlKFwiLi9sb2dpblN1cmZhY2Uvdm1cIiksIHJlcXVpcmUoXCIuL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwiY2hhcnQtY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL2NoYXJ0Q29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxuXHRrbm9iLnJlZ2lzdGVyQ29tcG9uZW50KFwibWFpbi1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vbWFpbkNvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sXCIpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbml0OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRpZighZGVwZW5kZW5jaWVzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9IFxyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGNvbnN0IGJhc2VSb3V0ZSA9IFwibG9jYWxob3N0Ojg4ODhcIjtcclxuXHJcblx0XHRmdW5jdGlvbiBjcmVhdGVNZW51SXRlbShsYWJlbCwgdXJsKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bGFiZWw6IGxhYmVsLFxyXG5cdFx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYodXNlcigpID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSBcIiMvbG9naW5cIjtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZih1c2VyKCkgIT09IG51bGwgJiYgbGFiZWwgPT09IFwiTXkgUG9ydGZvbGlvXCIpIHtcclxuXHRcdFx0XHRcdFx0dXJsID0gXCIjL3VzZXJzL1wiICsgdXNlcigpLnVzZXJOYW1lO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSB1cmw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG1lbnUgPSBrby5vYnNlcnZhYmxlQXJyYXkoW1xyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIkxvZ2luXCIsIFwiIy9sb2dpblwiKSxcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJNeSBQb3J0Zm9saW9cIiwgXCIjL3VzZXJzLzpwcm9maWxlSWRcIiksIC8vdGhpbmsgYWJvdXQgc29sdXRpb24gZm9yIGxvZ2dlZCBpbiBwcm9maWxlc1xyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIlRyYWRlXCIsIFwiIy90cmFkZVwiKSxcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJDaGFydHNcIiwgXCIjL2NoYXJ0c1wiKVxyXG5cdFx0XSk7XHJcblxyXG5cdFx0dmFyIHJlc291cmNlID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHRcdHZhciBzeW1ib2wgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cdFx0dmFyIHVzZXIgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cclxuXHRcdFNhbW15KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmdldChcIiMvbG9naW5cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJsb2dpblwiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL3VzZXJzLzpwcm9maWxlSWRcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJwcm9maWxlXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpLCBtZW51KCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy90cmFkZVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcInRyYWRlXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvY2hhcnRzXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwiY2hhcnRzXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvY2hhcnRzLzpzeW1ib2xcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3ltYm9sKHRoaXMucGFyYW1zLnN5bWJvbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJhIGNoYXJ0IHNob3VsZCBiZSBoZXJlIHdpdGg6IFwiICsgc3ltYm9sKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUm9vdCBsb2xcIik7XHJcblx0XHRcdH0pO1x0XHJcblx0XHR9KS5ydW4oKTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtZW51OiBtZW51LFxyXG5cdFx0XHRyZXNvdXJjZTogcmVzb3VyY2UsXHJcblx0XHRcdHN5bWJvbDogc3ltYm9sLFxyXG5cdFx0XHRiYXNlUm91dGU6IGJhc2VSb3V0ZSxcclxuXHRcdFx0dXNlcjogdXNlclxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJtZW51XCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogeyBkYXRhOiBtZW51LCBhczogXFwnbWVudUl0ZW1cXCd9XCI+XFxuICAgIDxzcGFuPlxcbiAgICBcdDxrbm9iLWJ1dHRvbiBjbGFzcz1cIm1lbnUtaXRlbVwiIHBhcmFtcz1cIlxcbiAgICBcdFx0bGFiZWw6IG1lbnVJdGVtLmxhYmVsLFxcbiAgICBcdFx0Y2xpY2s6IG1lbnVJdGVtLmNsaWNrXFxuICAgIFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG4gICAgPC9zcGFuPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IG51bGxcIj5cXG5cdDxoMSBkYXRhLWJpbmQ9XCJ0ZXh0OiBcXCdXZWxjb21lIHRvIHRoZSBWaXJ0dWFsIFN0b2NrIE1hcmtldCFcXCdcIj48L2gxPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2xvZ2luXFwnIHx8IHVzZXIoKSA9PT0gbnVsbFwiPlxcblx0PGxvZ2luLXN1cmZhY2UgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXJcXG5cdFwiPjwvbG9naW4tc3VyZmFjZT5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdwcm9maWxlXFwnICYmIHVzZXIoKSAhPT0gbnVsbFwiPlxcblx0PHByb2ZpbGUtY29tcG9uZW50IHBhcmFtcz1cIlxcblx0XHRuYW1lOiBcXCdEZWZ1YWx0IFVzZXJcXCcsXFxuXHRcdHByb2ZpbGVQaWN0dXJlVXJsOiBcXCdodHRwOi8vd3d3Lm11a2VzaGFtYmFuaS5jb20vcGhvdG8vZGVmYXVsdC5qcGdcXCcsXFxuXHRcdGJhbGFuY2U6IDEwMDAwLFxcblx0XHR1c2VyOiB1c2VyXFxuXHRcIj48L3Byb2ZpbGUtY29tcG9uZW50PlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ3RyYWRlXFwnICYmIHVzZXIoKSAhPSBudWxsXCI+XFxuXHQ8dHJhZGVyLWNvbXBvbmVudCBwYXJhbXM9XCJcXG5cdFx0dXNlcjogdXNlclxcblx0XCI+PC90cmFkZXItY29tcG9uZW50PlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2NoYXJ0c1xcJyAmJiBzeW1ib2woKSA9PSBudWxsICYmIHVzZXIoKSAhPT0gbnVsbFwiPlxcblx0PGNoYXJ0LWNob29zZXIgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXIsXFxuXHRcdGJhc2VSb3V0ZTogYmFzZVJvdXRlXFxuXHRcIj48L2NoYXJ0LWNob29zZXI+XFxuPC9kaXY+XFxuPGRpdiBkYXRhLWJpbmQ9XCJpZjogcmVzb3VyY2UoKSA9PT0gXFwnY2hhcnRzXFwnICYmIHN5bWJvbCgpICE9IG51bGwgJiYgdXNlcigpICE9IG51bGxcIj5cXG5cdDxjaGFydC1jb21wb25lbnQgcGFyYW1zPVwiXFxuXHRcdFx0dXNlcjogdXNlcixcXG5cdFx0XHR1cmw6IFxcJy4vY2hhcnRfZGF0YS9mb3JtYXR0ZWQ1MFxcJyxcXG5cdFx0XHRkaXZJZDogXFwnZm9ybWF0NTBcXCdcXG5cdFx0XCI+PC9jaGFydC1jb21wb25lbnQ+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY3JlYXRlTWFpbkNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZU1haW5Db21wb25lbnQoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcubmFtZSAmJiB0eXBlb2YgY29uZmlnLm5hbWUgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm5hbWUgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBzdHJpbmchXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcucHJvZmlsZVBpY3R1cmVVcmwgJiYgdHlwZW9mIGNvbmZpZy5wcm9maWxlUGljdHVyZVVybCAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcucHJvZmlsZVBpY3R1cmVVcmwgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBzdHJpbmchXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcuYmFsYW5jZSAmJiB0eXBlb2YgY29uZmlnLmJhbGFuY2UgIT09IFwibnVtYmVyXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJhbGFuY2UgaXMgbWFuZGF0b3J5IGFuZCBzaG91bGQgYmUgYSBudW1iZXIhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBuYW1lID0gY29uZmlnLm5hbWU7XHJcblx0XHR2YXIgcHJvZmlsZVBpY3R1cmVVcmwgPSBjb25maWcucHJvZmlsZVBpY3R1cmVVcmw7XHJcblx0XHR2YXIgYmFsYW5jZSA9IGNvbmZpZy5iYWxhbmNlO1xyXG5cdFx0dmFyIHVzZXIgPSBjb25maWcudXNlciB8fCBmdW5jdGlvbigpIHt9OyAvL2ZpeCB0aGlzLCB0ZW1wb3JhcnlcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lOiBuYW1lLFxyXG5cdFx0XHRwcm9maWxlUGljdHVyZVVybDogcHJvZmlsZVBpY3R1cmVVcmwsXHJcblx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXHJcblx0XHRcdHVzZXI6IHVzZXJcclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGRpdj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogXFwnVXNlcm5hbWU6IFxcJyArIHVzZXIoKS5uYW1lXCI+PC9zcGFuPlxcblx0XHQ8aW1nIGRhdGEtYmluZD1cImF0dHI6IHtzcmM6IHVzZXIoKS5wcm9maWxlVXJsLCBoZWlnaHQ6IDEwMCwgd2lkdGg6IDEwMH1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogXFwnQmFsYW5jZTogXFwnICsgdXNlcigpLmJhbGFuY2UgKyBcXCckXFwnXCI+PC9zcGFuPlxcblx0PC9kaXY+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY3JlYXRlUHJvZmlsZUNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVByb2ZpbGVDb21wb25lbnQoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGNvbnN0IGhlYWRlciA9IFwiVHJhZGVcIjtcclxuXHRcdGNvbnN0IHN5bWJvbExhYmVsID0gXCJTeW1ib2wgXCI7XHJcblx0XHRjb25zdCB0cmFuc2FjdGlvbkxhYmVsID0gXCJUcmFuc2FjdGlvbiBcIjtcclxuXHRcdGNvbnN0IHRyYW5zYWN0aW9uUXVhbnRpdHkgPSBcIlF1YW50aXR5IFwiO1xyXG5cclxuXHRcdHZhciBzeW1ib2xzRHJvcGRvd24gPSB7XHJcblx0XHRcdHNlbGVjdGVkU3ltYm9sOiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzZWxlY3RlZFN5bWJvbElkeDoga28ub2JzZXJ2YWJsZShudWxsKSxcclxuXHRcdFx0c3ltYm9sczoga28ub2JzZXJ2YWJsZUFycmF5KFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJHb29nbGVcIixcclxuXHRcdFx0XHRcdHZhbHVlOiBcIkdPT0dcIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiQXBwbGVcIixcclxuXHRcdFx0XHRcdHZhbHVlOiBcIkFBUExcIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiVmVyemlvblwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwiVlpcIlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XSlcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHRyYW5zYWN0aW9uVmFsdWUgPSBrby5vYnNlcnZhYmxlKDApO1xyXG5cdFx0XHJcblx0XHR2YXIgb3B0aW9uc0Ryb3Bkb3duID0ge1xyXG5cdFx0XHRzZWxlY3RlZE9wdGlvbjoga28ub2JzZXJ2YWJsZShudWxsKSxcclxuXHRcdFx0c2VsZWN0ZWRPcHRpb25JZHg6IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdG9wdGlvbnMgOiBrby5vYnNlcnZhYmxlQXJyYXkoW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxhYmVsOiBcIkJ1eVwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwiYnV5XCJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxhYmVsOiBcIlNlbGxcIixcclxuXHRcdFx0XHRcdHZhbHVlOiBcInNlbGxcIlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XSlcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciB0cmFuc2FjdGlvbkJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiTWFrZSB0cmFuc2FjdGlvblwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJBdHRlbXB0aW5nIHRvIFwiICsgb3B0aW9uc0Ryb3Bkb3duLnNlbGVjdGVkT3B0aW9uKCkudmFsdWUgKyBcIiBcIiArIHRyYW5zYWN0aW9uVmFsdWUoKSArIFwiIHN0b2Nrc1wiICtcclxuXHRcdFx0XHQgXCIgZnJvbSBcIiArIHN5bWJvbHNEcm9wZG93bi5zZWxlY3RlZFN5bWJvbCgpLmxhYmVsKCkgKyBcIiB3aXRoIHRoZSBzeW1ib2w6IFwiICsgc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkudmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGhlYWRlcjogaGVhZGVyLFxyXG5cdFx0XHRzeW1ib2xMYWJlbDogc3ltYm9sTGFiZWwsXHJcblx0XHRcdHRyYW5zYWN0aW9uTGFiZWw6IHRyYW5zYWN0aW9uTGFiZWwsXHJcblx0XHRcdHRyYW5zYWN0aW9uUXVhbnRpdHk6IHRyYW5zYWN0aW9uUXVhbnRpdHksXHJcblx0XHRcdHN5bWJvbHNEcm9wZG93bjogc3ltYm9sc0Ryb3Bkb3duLFxyXG5cdFx0XHRvcHRpb25zRHJvcGRvd246IG9wdGlvbnNEcm9wZG93bixcclxuXHRcdFx0dHJhbnNhY3Rpb25CdXR0b246IHRyYW5zYWN0aW9uQnV0dG9uLFxyXG5cdFx0XHR0cmFuc2FjdGlvblZhbHVlOiB0cmFuc2FjdGlvblZhbHVlXHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxoMiBkYXRhLWJpbmQ9XCJ0ZXh0OiBoZWFkZXJcIj48L2gyPlxcblx0PHNwYW4+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHN5bWJvbExhYmVsXCI+PC9zcGFuPlxcblx0XHQ8a25vYi1kcm9wZG93biBwYXJhbXM9XCJcXG5cdFx0XHRzZWxlY3RlZDogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sLFxcblx0XHRcdGl0ZW1zOiBzeW1ib2xzRHJvcGRvd24uc3ltYm9scyxcXG5cdFx0XHRzZWxlY3RlZElkeDogc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sSWR4LFxcblx0XHRcdHJpZ2h0SWNvbjogXFwnI2ljb24tZXhwYW5kLW1vcmVcXCdcXG5cdFx0XCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRyYW5zYWN0aW9uTGFiZWxcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdHNlbGVjdGVkOiBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb24sXFxuXHRcdFx0aXRlbXM6IG9wdGlvbnNEcm9wZG93bi5vcHRpb25zLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb25JZHgsXFxuXHRcdFx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJ1xcblx0XHRcIj48L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdHJhbnNhY3Rpb25RdWFudGl0eVwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItaW5wdXQgcGFyYW1zPVwiXFxuXHRcdFx0dmFsdWU6IHRyYW5zYWN0aW9uVmFsdWVcXG5cdFx0XCI+PC9rbm9iLWlucHV0Plxcblx0PC9zcGFuPlxcblx0PHNwYW4+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRsYWJlbDogdHJhbnNhY3Rpb25CdXR0b24ubGFiZWwsXFxuXHRcdFx0Y2xpY2s6IHRyYW5zYWN0aW9uQnV0dG9uLmNsaWNrXFxuXHRcdFwiPjwva25vYi1idXR0b24+XFxuXHQ8L3NwYW4+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgdHJhZGVyQ29tcG9uZW50Q29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRyYWRlckNvbXBvbmVudENvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiXX0=
