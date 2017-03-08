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
					console.log(menu());
					location.hash = url;
				}
			}
		}

		function updateProfieButton(profileButton, userName) {
			console.log(userName, "!!!!!!!44");
			profileButton.url = "#/users/" + userName;
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

		ko.computed(function() {
			if(user() !== null) {
				console.log("TRIGGERED");
				menu()[1].url = updateProfieButton(menu()[1], user().userName);
				console.log(menu());
			}
		});

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
module.exports = '<div class="menu" data-bind="foreach: { data: menu, as: \'menuItem\'}">\n    <span>\n    	<knob-button class="menu-item" params="\n    		label: menuItem.label,\n    		click: menuItem.click\n    	"></knob-button>\n    </span>\n</div>\n<div data-bind="if: resource() === null">\n	<h1 data-bind="text: \'Welcome to the Virtual Stock Market!\'"></h1>\n</div>\n<div data-bind="if: resource() === \'login\'">\n	<login-surface params="\n		user: user\n	"></login-surface>\n</div>\n<div data-bind="if: resource() === \'profile\'">\n	<profile-component params="\n		name: \'Defualt User\',\n		profilePictureUrl: \'http://www.mukeshambani.com/photo/default.jpg\',\n		balance: 10000,\n		user: user\n	"></profile-component>\n	<!--<profile-component params="\n		user: user\n	"></profile-component>-->\n</div>\n<div data-bind="if: resource() === \'trade\'">\n	<trader-component params="\n		user: user\n	"></trader-component>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() == null">\n	<chart-chooser params="\n		user: user,\n		baseRoute: baseRoute\n	"></chart-chooser>\n</div>\n<div data-bind="if: resource() === \'charts\' && symbol() != null">\n	<chart-component params="\n			user: user,\n			url: \'./chart_data/formatted50\',\n			divId: \'format50\'\n		"></chart-component>\n</div>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q2hvb3Nlci9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENob29zZXIvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvY2hhcnRDaG9vc2VyL3ZtLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC9jb3JlLmpzIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9jaGFydENvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL2NvcmUuanMiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2Uvdm0uanMiLCJzcmMvcHVibGljL21haW4uanMiLCJzcmMvcHVibGljL21haW5Db21wb25lbnQvY29yZS5qcyIsInNyYy9wdWJsaWMvbWFpbkNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy9tYWluQ29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9wcm9maWxlQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3Byb2ZpbGVDb21wb25lbnQvdGVtcGxhdGUuaHRtbCIsInNyYy9wdWJsaWMvcHJvZmlsZUNvbXBvbmVudC92bS5qcyIsInNyYy9wdWJsaWMvdHJhZGVyQ29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL3RyYWRlckNvbXBvbmVudC90ZW1wbGF0ZS5odG1sIiwic3JjL3B1YmxpYy90cmFkZXJDb21wb25lbnQvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRkZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMgfHwge307XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5iYXNlUm91dGUgJiYgdHlwZW9mIGNvbmZpZy5iYXNlUm91dGUgIT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmJhc2VSb3V0ZSBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgYmFzZVJvdXRlID0gY29uZmlnLmJhc2VSb3V0ZTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgZHJvcGRvd25MYWJlbCA9IFwiU3RvY2tzOiBcIjtcclxuXHRcdHZhciBzeW1ib2xzID0ga28ub2JzZXJ2YWJsZUFycmF5KFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIkdvb2dsZVwiLFxyXG5cdFx0XHRcdHZhbHVlOiBcIlNZTUJPTDFcIlxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGFiZWw6IFwiQXBwbGVcIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wyXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxhYmVsOiBcIlZlcnppb25cIixcclxuXHRcdFx0XHR2YWx1ZTogXCJTWU1CT0wzXCJcclxuXHRcdFx0fVxyXG5cdFx0XSk7XHJcblxyXG5cdFx0dmFyIHNlbGVjdGVkID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHRcdHZhciBzZWxlY3RlZElkeCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblxyXG5cdFx0dmFyIGxvYWRDaGFydCA9IHtcclxuXHRcdFx0bGFiZWw6IFwiU2VsZWN0XCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gbG9jYXRpb24uaGFzaCArIFwiL1wiICsgc2VsZWN0ZWQoKS52YWx1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZHJvcGRvd25MYWJlbDogZHJvcGRvd25MYWJlbCxcclxuXHRcdFx0c3ltYm9sczogc3ltYm9scyxcclxuXHRcdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxyXG5cdFx0XHRzZWxlY3RlZElkeDogc2VsZWN0ZWRJZHgsXHJcblx0XHRcdGxvYWRDaGFydDogbG9hZENoYXJ0XHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGRyb3Bkb3duTGFiZWxcIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuPlxcblx0XHQ8a25vYi1kcm9wZG93biBwYXJhbXM9XCJcXG5cdFx0XHRzZWxlY3RlZDogc2VsZWN0ZWQsXFxuXHRcdFx0aXRlbXM6IHN5bWJvbHMsXFxuXHRcdFx0c2VsZWN0ZWRJZHg6IHNlbGVjdGVkSWR4LFxcblx0XHRcdHJpZ2h0SWNvbjogXFwnI2ljb24tZXhwYW5kLW1vcmVcXCdcXG5cdFx0XCI+XFxuXHRcdDwva25vYi1kcm9wZG93bj5cXG5cdDwvc3Bhbj5cXG48L2Rpdj5cXG48ZGl2Plxcblx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRsYWJlbDogbG9hZENoYXJ0LmxhYmVsLFxcblx0XHRjbGljazogbG9hZENoYXJ0LmNsaWNrXFxuXHRcIj5cXG5cdDwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY2hhcnRDaG9vc2VyQ29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJ0Q2hvb3NlckNvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzKSB7XHJcblx0ZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzIHx8IHt9O1xyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdGlmKCFjb25maWcudXJsKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy51cmwgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighY29uZmlnLmRpdklkKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5kaXZJZCBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBjaGFydFVybCA9IGNvbmZpZy51cmw7XHJcblx0XHR2YXIgZGl2SWQgPSBjb25maWcuZGl2SWQ7XHJcblxyXG5cdFx0dmFyIGNoYXJ0ID0gYzMuZ2VuZXJhdGUoe1xyXG5cdFx0XHRiaW5kdG86IFwiI1wiICsgZGl2SWQsXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHR4OiBcInhcIixcclxuXHRcdFx0XHR4Rm9ybWF0OiBcIiVZLSVtLSVkICVIOiVNOiVTXCIsXHJcblx0XHRcdFx0bWltZVR5cGU6IFwiY3N2XCIsXHJcblx0XHRcdFx0dXJsOiBjaGFydFVybCxcclxuXHRcdFx0XHRncm91cHM6IFtcclxuXHRcdFx0XHRcdFtcIkhVRi9VU0RcIl1cclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGtleXM6IHtcclxuXHRcdFx0XHRcdHhGb3JtYXQ6IFwiJVktJW0tJWQgJUg6JU06JVNcIlxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdGF4aXM6IHtcclxuXHRcdFx0XHR5OiB7XHJcblx0XHRcdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiBcIlByaWNlXCIsXHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiBcIm91dGVyLW1pZGRsZVwiXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR4OiB7XHJcblx0XHRcdFx0XHR0eXBlOiBcInRpbWVzZXJpZXNcIixcclxuXHRcdFx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6IFwiVGltZVwiLFxyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogXCJtaWRkbGVcIlxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHRpY2s6IHtcclxuXHRcdFx0XHRcdFx0Zm9ybWF0OiBcIiVNOiVTXCJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHpvb206IHtcclxuXHRcdFx0XHRlbmFibGVkOiB0cnVlLFxyXG5cdFx0XHRcdHJlc2NhbGU6IHRydWVcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIHpvb21CdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIlRlc3QgWm9vbVwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGNoYXJ0Lnpvb20oW1xyXG5cdFx0XHRcdFx0XHRcIjIwMTYtMTAtMDIgMTc6MDQ6MTdcIixcclxuXHRcdFx0XHRcdFx0XCIyMDE2LTEwLTAyIDE3OjA3OjIxXCJdKTtcclxuXHRcdFx0XHR9LCAyMDAwKTtcclxuXHRcdFx0XHQvL2NoYXJ0LmxvYWQoY2hhcnRVcmwpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciByZXNldEJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiUmVzZXQgQ2hhcnRcIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNoYXJ0LnVuem9vbSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Y2hhcnQ6IGNoYXJ0LFxyXG5cdFx0XHRkaXZJZDogZGl2SWQsXHJcblx0XHRcdHJlc2V0QnV0dG9uOiByZXNldEJ1dHRvbixcclxuXHRcdFx0em9vbUJ1dHRvbjogem9vbUJ1dHRvblxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8ZGl2IGRhdGEtYmluZD0gXCJhdHRyOiB7XFxuXHRpZDogZGl2SWRcXG5cdH1cIj48L2Rpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHpvb21CdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiB6b29tQnV0dG9uLmNsaWNrXCI+XHRcdFxcblx0PC9rbm9iLWJ1dHRvbj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHJlc2V0QnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogcmVzZXRCdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY2hhcnRDb21wb25lbnRDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRDb21wb25lbnRDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGlmKCFkZXBlbmRlbmNpZXMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUxvZ2luU3VyZmFjZShjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCFjb25maWcudXNlciAmJiB0eXBlb2YgY29uZmlnLnVzZXIgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudXNlciBpcyBtYW5kYXRvcnkgYW5kIGl0IHNob3VsZCBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB1c2VyID0gY29uZmlnLnVzZXI7XHJcblxyXG5cdFx0dmFyIHVzZXJJbnB1dCA9IHtcclxuXHRcdFx0cGxhY2Vob2xkZXI6IFwiVXNlck5hbWVcIixcclxuXHRcdFx0dmFsdWU6IGtvLm9ic2VydmFibGUobnVsbClcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHBhc3N3b3JkSW5wdXQgPSB7XHJcblx0XHRcdHBsYWNlaG9sZGVyOiBcInBhc3N3b3JkXCIsXHJcblx0XHRcdHZhbHVlOiBrby5vYnNlcnZhYmxlKG51bGwpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBsb2dpbkJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiTG9naW5cIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciB1c2VyUGFyYW1zID0gXCJ1c2VyPVwiICsgdXNlcklucHV0LnZhbHVlKCkgKyBcIiZwYXNzPVwiICsgcGFzc3dvcmRJbnB1dC52YWx1ZSgpO1xyXG5cdFx0XHRcdHZhciBwb3N0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdFx0cG9zdC5vcGVuKFwiUE9TVFwiLCBcIi4vbG9naW5yZXF1ZXN0XCIsIHRydWUpO1xyXG5cclxuXHRcdFx0XHRwb3N0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXHRcdFx0XHRpZihwb3N0LnJlYWR5U3RhdGUgPT0gNCAmJiBwb3N0LnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICBcdFx0XHRcdGNvbnNvbGUubG9nKHBvc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBcdFx0XHRcdHVzZXIoSlNPTi5wYXJzZShwb3N0LnJlc3BvbnNlVGV4dCkpO1xyXG4gICAgICAgIFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9IFwiL3VzZXJzL1wiICsgdXNlcigpLnVzZXJOYW1lO1xyXG4gICAgXHRcdFx0XHR9XHRcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHBvc3Quc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcclxuXHRcdFx0XHRwb3N0LnNlbmQodXNlclBhcmFtcyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0dXNlcklucHV0OiB1c2VySW5wdXQsXHJcblx0XHRcdHBhc3N3b3JkSW5wdXQ6IHBhc3N3b3JkSW5wdXQsXHJcblx0XHRcdGxvZ2luQnV0dG9uOiBsb2dpbkJ1dHRvblxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJcXG5cdFx0dmFsdWU6IHVzZXJJbnB1dC52YWx1ZSxcXG5cdFx0cGxhY2Vob2xkZXI6IHVzZXJJbnB1dC5wbGFjZWhvbGRlclxcblx0XCI+PC9rbm9iLWlucHV0PlxcbjwvZGl2PlxcbjxkaXY+XFxuXHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJcXG5cdFx0dmFsdWU6IHBhc3N3b3JkSW5wdXQudmFsdWUsXFxuXHRcdHBsYWNlaG9sZGVyOiBwYXNzd29yZElucHV0LnBsYWNlaG9sZGVyLFxcblx0XHR0eXBlOiBcXCdwYXNzd29yZFxcJ1xcblx0XCI+PC9rbm9iLWlucHV0PlxcbjwvZGl2PlxcbjxkaXY+XFxuXHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdGxhYmVsOiBsb2dpbkJ1dHRvbi5sYWJlbCxcXG5cdFx0Y2xpY2s6IGxvZ2luQnV0dG9uLmNsaWNrXFxuXHRcIj48L2tub2ItYnV0dG9uPlxcbjwvZGl2Pic7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGxvZ2luU3VyZmFjZUNvcmUgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsb2dpblN1cmZhY2VDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga25vYiA9ICh3aW5kb3cua25vYik7XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJjaGFydC1jaG9vc2VyXCIsIHJlcXVpcmUoXCIuL2NoYXJ0Q2hvb3Nlci92bVwiKSwgcmVxdWlyZShcIi4vY2hhcnRDaG9vc2VyL3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJwcm9maWxlLWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi9wcm9maWxlQ29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi9wcm9maWxlQ29tcG9uZW50L3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJ0cmFkZXItY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL3RyYWRlckNvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vdHJhZGVyQ29tcG9uZW50L3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJsb2dpbi1zdXJmYWNlXCIsIHJlcXVpcmUoXCIuL2xvZ2luU3VyZmFjZS92bVwiKSwgcmVxdWlyZShcIi4vbG9naW5TdXJmYWNlL3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJjaGFydC1jb21wb25lbnRcIiwgcmVxdWlyZShcIi4vY2hhcnRDb21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL2NoYXJ0Q29tcG9uZW50L3RlbXBsYXRlLmh0bWxcIikpO1xyXG5cdGtub2IucmVnaXN0ZXJDb21wb25lbnQoXCJtYWluLWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi9tYWluQ29tcG9uZW50L3ZtXCIpLCByZXF1aXJlKFwiLi9tYWluQ29tcG9uZW50L3RlbXBsYXRlLmh0bWxcIikpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGluaXQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGlmKCFkZXBlbmRlbmNpZXMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH0gXHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0Y29uc3QgYmFzZVJvdXRlID0gXCJsb2NhbGhvc3Q6ODg4OFwiO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU1lbnVJdGVtKGxhYmVsLCB1cmwpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRsYWJlbDogbGFiZWwsXHJcblx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cobWVudSgpKTtcclxuXHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSB1cmw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdXBkYXRlUHJvZmllQnV0dG9uKHByb2ZpbGVCdXR0b24sIHVzZXJOYW1lKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHVzZXJOYW1lLCBcIiEhISEhISE0NFwiKTtcclxuXHRcdFx0cHJvZmlsZUJ1dHRvbi51cmwgPSBcIiMvdXNlcnMvXCIgKyB1c2VyTmFtZTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbWVudSA9IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdGNyZWF0ZU1lbnVJdGVtKFwiTG9naW5cIiwgXCIjL2xvZ2luXCIpLFxyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIk15IFBvcnRmb2xpb1wiLCBcIiMvdXNlcnMvOnByb2ZpbGVJZFwiKSwgLy90aGluayBhYm91dCBzb2x1dGlvbiBmb3IgbG9nZ2VkIGluIHByb2ZpbGVzXHJcblx0XHRcdGNyZWF0ZU1lbnVJdGVtKFwiVHJhZGVcIiwgXCIjL3RyYWRlXCIpLFxyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIkNoYXJ0c1wiLCBcIiMvY2hhcnRzXCIpXHJcblx0XHRdKTtcclxuXHJcblx0XHR2YXIgcmVzb3VyY2UgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cdFx0dmFyIHN5bWJvbCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblx0XHR2YXIgdXNlciA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcblxyXG5cdFx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKHVzZXIoKSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiVFJJR0dFUkVEXCIpO1xyXG5cdFx0XHRcdG1lbnUoKVsxXS51cmwgPSB1cGRhdGVQcm9maWVCdXR0b24obWVudSgpWzFdLCB1c2VyKCkudXNlck5hbWUpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKG1lbnUoKSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdFNhbW15KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmdldChcIiMvbG9naW5cIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJsb2dpblwiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL3VzZXJzLzpwcm9maWxlSWRcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJwcm9maWxlXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNvdXJjZSgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvdHJhZGVcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVzb3VyY2UoXCJ0cmFkZVwiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL2NoYXJ0c1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcImNoYXJ0c1wiKTtcclxuXHRcdFx0XHRzeW1ib2wobnVsbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzb3VyY2UoKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nZXQoXCIjL2NoYXJ0cy86c3ltYm9sXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHN5bWJvbCh0aGlzLnBhcmFtcy5zeW1ib2wpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiYSBjaGFydCBzaG91bGQgYmUgaGVyZSB3aXRoOiBcIiArIHN5bWJvbCgpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIlwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlJvb3QgbG9sXCIpO1xyXG5cdFx0XHR9KTtcdFxyXG5cdFx0fSkucnVuKCk7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bWVudTogbWVudSxcclxuXHRcdFx0cmVzb3VyY2U6IHJlc291cmNlLFxyXG5cdFx0XHRzeW1ib2w6IHN5bWJvbCxcclxuXHRcdFx0YmFzZVJvdXRlOiBiYXNlUm91dGUsXHJcblx0XHRcdHVzZXI6IHVzZXJcclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwibWVudVwiIGRhdGEtYmluZD1cImZvcmVhY2g6IHsgZGF0YTogbWVudSwgYXM6IFxcJ21lbnVJdGVtXFwnfVwiPlxcbiAgICA8c3Bhbj5cXG4gICAgXHQ8a25vYi1idXR0b24gY2xhc3M9XCJtZW51LWl0ZW1cIiBwYXJhbXM9XCJcXG4gICAgXHRcdGxhYmVsOiBtZW51SXRlbS5sYWJlbCxcXG4gICAgXHRcdGNsaWNrOiBtZW51SXRlbS5jbGlja1xcbiAgICBcdFwiPjwva25vYi1idXR0b24+XFxuICAgIDwvc3Bhbj5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBudWxsXCI+XFxuXHQ8aDEgZGF0YS1iaW5kPVwidGV4dDogXFwnV2VsY29tZSB0byB0aGUgVmlydHVhbCBTdG9jayBNYXJrZXQhXFwnXCI+PC9oMT5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdsb2dpblxcJ1wiPlxcblx0PGxvZ2luLXN1cmZhY2UgcGFyYW1zPVwiXFxuXHRcdHVzZXI6IHVzZXJcXG5cdFwiPjwvbG9naW4tc3VyZmFjZT5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdwcm9maWxlXFwnXCI+XFxuXHQ8cHJvZmlsZS1jb21wb25lbnQgcGFyYW1zPVwiXFxuXHRcdG5hbWU6IFxcJ0RlZnVhbHQgVXNlclxcJyxcXG5cdFx0cHJvZmlsZVBpY3R1cmVVcmw6IFxcJ2h0dHA6Ly93d3cubXVrZXNoYW1iYW5pLmNvbS9waG90by9kZWZhdWx0LmpwZ1xcJyxcXG5cdFx0YmFsYW5jZTogMTAwMDAsXFxuXHRcdHVzZXI6IHVzZXJcXG5cdFwiPjwvcHJvZmlsZS1jb21wb25lbnQ+XFxuXHQ8IS0tPHByb2ZpbGUtY29tcG9uZW50IHBhcmFtcz1cIlxcblx0XHR1c2VyOiB1c2VyXFxuXHRcIj48L3Byb2ZpbGUtY29tcG9uZW50Pi0tPlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ3RyYWRlXFwnXCI+XFxuXHQ8dHJhZGVyLWNvbXBvbmVudCBwYXJhbXM9XCJcXG5cdFx0dXNlcjogdXNlclxcblx0XCI+PC90cmFkZXItY29tcG9uZW50PlxcbjwvZGl2PlxcbjxkaXYgZGF0YS1iaW5kPVwiaWY6IHJlc291cmNlKCkgPT09IFxcJ2NoYXJ0c1xcJyAmJiBzeW1ib2woKSA9PSBudWxsXCI+XFxuXHQ8Y2hhcnQtY2hvb3NlciBwYXJhbXM9XCJcXG5cdFx0dXNlcjogdXNlcixcXG5cdFx0YmFzZVJvdXRlOiBiYXNlUm91dGVcXG5cdFwiPjwvY2hhcnQtY2hvb3Nlcj5cXG48L2Rpdj5cXG48ZGl2IGRhdGEtYmluZD1cImlmOiByZXNvdXJjZSgpID09PSBcXCdjaGFydHNcXCcgJiYgc3ltYm9sKCkgIT0gbnVsbFwiPlxcblx0PGNoYXJ0LWNvbXBvbmVudCBwYXJhbXM9XCJcXG5cdFx0XHR1c2VyOiB1c2VyLFxcblx0XHRcdHVybDogXFwnLi9jaGFydF9kYXRhL2Zvcm1hdHRlZDUwXFwnLFxcblx0XHRcdGRpdklkOiBcXCdmb3JtYXQ1MFxcJ1xcblx0XHRcIj48L2NoYXJ0LWNvbXBvbmVudD5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBjcmVhdGVNYWluQ29tcG9uZW50ID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTWFpbkNvbXBvbmVudCh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRkZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMgfHwge307XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5uYW1lICYmIHR5cGVvZiBjb25maWcubmFtZSAhPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcubmFtZSBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5wcm9maWxlUGljdHVyZVVybCAmJiB0eXBlb2YgY29uZmlnLnByb2ZpbGVQaWN0dXJlVXJsICE9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5wcm9maWxlUGljdHVyZVVybCBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIHN0cmluZyFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWNvbmZpZy5iYWxhbmNlICYmIHR5cGVvZiBjb25maWcuYmFsYW5jZSAhPT0gXCJudW1iZXJcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYmFsYW5jZSBpcyBtYW5kYXRvcnkgYW5kIHNob3VsZCBiZSBhIG51bWJlciFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG5hbWUgPSBjb25maWcubmFtZTtcclxuXHRcdHZhciBwcm9maWxlUGljdHVyZVVybCA9IGNvbmZpZy5wcm9maWxlUGljdHVyZVVybDtcclxuXHRcdHZhciBiYWxhbmNlID0gY29uZmlnLmJhbGFuY2U7XHJcblx0XHR2YXIgdXNlciA9IGNvbmZpZy51c2VyIHx8IGZ1bmN0aW9uKCkge307IC8vZml4IHRoaXMsIHRlbXBvcmFyeVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG5hbWU6IG5hbWUsXHJcblx0XHRcdHByb2ZpbGVQaWN0dXJlVXJsOiBwcm9maWxlUGljdHVyZVVybCxcclxuXHRcdFx0YmFsYW5jZTogYmFsYW5jZSxcclxuXHRcdFx0dXNlcjogdXNlclxyXG5cdFx0fTtcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8ZGl2Plxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBcXCdVc2VybmFtZTogXFwnICsgdXNlcigpLm5hbWVcIj48L3NwYW4+XFxuXHRcdDxpbWcgZGF0YS1iaW5kPVwiYXR0cjoge3NyYzogdXNlcigpLnByb2ZpbGVVcmwsIGhlaWdodDogMTAwLCB3aWR0aDogMTAwfVwiPlxcblx0PC9kaXY+XFxuXHQ8ZGl2Plxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBcXCdCYWxhbmNlOiBcXCcgKyB1c2VyKCkuYmFsYW5jZSArIFxcJyRcXCdcIj48L3NwYW4+XFxuXHQ8L2Rpdj5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBjcmVhdGVQcm9maWxlQ29tcG9uZW50ID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUHJvZmlsZUNvbXBvbmVudCh7XHJcblx0a286IGtvXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRkZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMgfHwge307XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0Y29uc3QgaGVhZGVyID0gXCJUcmFkZVwiO1xyXG5cdFx0Y29uc3Qgc3ltYm9sTGFiZWwgPSBcIlN5bWJvbCBcIjtcclxuXHRcdGNvbnN0IHRyYW5zYWN0aW9uTGFiZWwgPSBcIlRyYW5zYWN0aW9uIFwiO1xyXG5cdFx0Y29uc3QgdHJhbnNhY3Rpb25RdWFudGl0eSA9IFwiUXVhbnRpdHkgXCI7XHJcblxyXG5cdFx0dmFyIHN5bWJvbHNEcm9wZG93biA9IHtcclxuXHRcdFx0c2VsZWN0ZWRTeW1ib2w6IGtvLm9ic2VydmFibGUobnVsbCksXHJcblx0XHRcdHNlbGVjdGVkU3ltYm9sSWR4OiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzeW1ib2xzOiBrby5vYnNlcnZhYmxlQXJyYXkoW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxhYmVsOiBcIkdvb2dsZVwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwiR09PR1wiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJBcHBsZVwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwiQUFQTFwiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsYWJlbDogXCJWZXJ6aW9uXCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJWWlwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgdHJhbnNhY3Rpb25WYWx1ZSA9IGtvLm9ic2VydmFibGUoMCk7XHJcblx0XHRcclxuXHRcdHZhciBvcHRpb25zRHJvcGRvd24gPSB7XHJcblx0XHRcdHNlbGVjdGVkT3B0aW9uOiBrby5vYnNlcnZhYmxlKG51bGwpLFxyXG5cdFx0XHRzZWxlY3RlZE9wdGlvbklkeDoga28ub2JzZXJ2YWJsZShudWxsKSxcclxuXHRcdFx0b3B0aW9ucyA6IGtvLm9ic2VydmFibGVBcnJheShbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiQnV5XCIsXHJcblx0XHRcdFx0XHR2YWx1ZTogXCJidXlcIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGFiZWw6IFwiU2VsbFwiLFxyXG5cdFx0XHRcdFx0dmFsdWU6IFwic2VsbFwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdKVx0XHRcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHRyYW5zYWN0aW9uQnV0dG9uID0ge1xyXG5cdFx0XHRsYWJlbDogXCJNYWtlIHRyYW5zYWN0aW9uXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gXCIgKyBvcHRpb25zRHJvcGRvd24uc2VsZWN0ZWRPcHRpb24oKS52YWx1ZSArIFwiIFwiICsgdHJhbnNhY3Rpb25WYWx1ZSgpICsgXCIgc3RvY2tzXCIgK1xyXG5cdFx0XHRcdCBcIiBmcm9tIFwiICsgc3ltYm9sc0Ryb3Bkb3duLnNlbGVjdGVkU3ltYm9sKCkubGFiZWwoKSArIFwiIHdpdGggdGhlIHN5bWJvbDogXCIgKyBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2woKS52YWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aGVhZGVyOiBoZWFkZXIsXHJcblx0XHRcdHN5bWJvbExhYmVsOiBzeW1ib2xMYWJlbCxcclxuXHRcdFx0dHJhbnNhY3Rpb25MYWJlbDogdHJhbnNhY3Rpb25MYWJlbCxcclxuXHRcdFx0dHJhbnNhY3Rpb25RdWFudGl0eTogdHJhbnNhY3Rpb25RdWFudGl0eSxcclxuXHRcdFx0c3ltYm9sc0Ryb3Bkb3duOiBzeW1ib2xzRHJvcGRvd24sXHJcblx0XHRcdG9wdGlvbnNEcm9wZG93bjogb3B0aW9uc0Ryb3Bkb3duLFxyXG5cdFx0XHR0cmFuc2FjdGlvbkJ1dHRvbjogdHJhbnNhY3Rpb25CdXR0b24sXHJcblx0XHRcdHRyYW5zYWN0aW9uVmFsdWU6IHRyYW5zYWN0aW9uVmFsdWVcclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGgyIGRhdGEtYmluZD1cInRleHQ6IGhlYWRlclwiPjwvaDI+XFxuXHQ8c3Bhbj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogc3ltYm9sTGFiZWxcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0XHRcdHNlbGVjdGVkOiBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2wsXFxuXHRcdFx0aXRlbXM6IHN5bWJvbHNEcm9wZG93bi5zeW1ib2xzLFxcblx0XHRcdHNlbGVjdGVkSWR4OiBzeW1ib2xzRHJvcGRvd24uc2VsZWN0ZWRTeW1ib2xJZHgsXFxuXHRcdFx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJ1xcblx0XHRcIj48L2tub2ItZHJvcGRvd24+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdHJhbnNhY3Rpb25MYWJlbFwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRcdFx0c2VsZWN0ZWQ6IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbixcXG5cdFx0XHRpdGVtczogb3B0aW9uc0Ryb3Bkb3duLm9wdGlvbnMsXFxuXHRcdFx0c2VsZWN0ZWRJZHg6IG9wdGlvbnNEcm9wZG93bi5zZWxlY3RlZE9wdGlvbklkeCxcXG5cdFx0XHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnXFxuXHRcdFwiPjwva25vYi1kcm9wZG93bj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuPlxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0cmFuc2FjdGlvblF1YW50aXR5XCI+PC9zcGFuPlxcblx0XHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJcXG5cdFx0XHR2YWx1ZTogdHJhbnNhY3Rpb25WYWx1ZVxcblx0XHRcIj48L2tub2ItaW5wdXQ+XFxuXHQ8L3NwYW4+XFxuXHQ8c3Bhbj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRcdGxhYmVsOiB0cmFuc2FjdGlvbkJ1dHRvbi5sYWJlbCxcXG5cdFx0XHRjbGljazogdHJhbnNhY3Rpb25CdXR0b24uY2xpY2tcXG5cdFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG48L2Rpdj4nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciB0cmFkZXJDb21wb25lbnRDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdHJhZGVyQ29tcG9uZW50Q29yZSh7XHJcblx0a286IGtvXHJcbn0pOyJdfQ==
