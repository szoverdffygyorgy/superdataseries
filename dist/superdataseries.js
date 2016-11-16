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

		var chart = c3.generate({
			bindto: '#test_chart',
			data: {
				x: 'x',
				xFormat: '%Y-%m-%d %H:%M:%S',
				mimeType: 'csv',
				url: './chart_data/forex_data_test',
				groups: [
					['HUF/USD']
				],
				keys: {
					xFormat: '%Y-%m-%d %H:%M:%S'
				}

			},
			axis: {
				y: {
					label: {
						text: 'Price',
						position: 'outer-middle'
					}
				},
				x: {
					type: 'timeseries',
					label: {
						text: 'Time',
						position: 'middle'
					},
					tick: {
						format: '%H:%M:%S'
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
						'2016-10-02 17:04:17',
						'2016-10-02 17:07:21']);
				}, 2000);
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
			resetButton: resetButton,
			zoomButton: zoomButton
		};
	};
};
},{}],2:[function(require,module,exports){
module.exports = '<div>\n	<div id="test_chart"></div>\n	<knob-button params="\n		label: zoomButton.label,\n		click: zoomButton.click">		\n	</knob-button>\n	<knob-button params="\n		label: resetButton.label,\n		click: resetButton.click\n	"></knob-button>\n</div>';
},{}],3:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var chartComponentCore = require("./core");

module.exports = chartComponentCore({
	ko: ko
});
},{"./core":1}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
module.exports = '<div>\n	<knob-input params="\n		value: userInput.value,\n		placeholder: userInput.placeholder\n	"></knob-input>\n</div>\n<div>\n	<knob-input params="\n		value: passwordInput.value,\n		placeholder: passwordInput.placeholder,\n		type: \'password\'\n	"></knob-input>\n</div>\n<div>\n	<knob-button params="\n		label: loginButton.label,\n		click: loginButton.click\n	"></knob-button>\n</div>';
},{}],6:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var loginSurfaceCore = require("./core");

module.exports = loginSurfaceCore({
	ko: ko
});
},{"./core":4}],7:[function(require,module,exports){
"use strict";

var knob = (window.knob);

function init() {
	knob.registerComponent("login-surface", require("./loginSurface/vm"), require("./loginSurface/template.html"));
	knob.registerComponent("chart-component", require("./chartComponent/vm"), require("./chartComponent/template.html"));
	knob.registerComponent("main-component", require("./mainComponent/vm"), require("./mainComponent/template.html"));
}

module.exports = init;

/*var forex_chart = require("./forex-chart");

setTimeout(function() {
	forex_chart.zoom([
		'2016-10-02 17:04:17',
		'2016-10-02 17:07:21'
		]);
}, 2000);

var chart = c3.generate({
		bindto: '#chart',
		data: {
			url: './chart_data/test_data'
		}
	});

	data: {
			columns: [
			['data1', 30, 200, 100, 400, 150, 250],
			['data2', 50, 20, 10, 40, 15, 25]
			],
			axes: {
				data2: 'y2'
			},
			types: {
				data2: 'bar'
			}
	},
	axis: {
		x: {
			label: {
				text: 'X Label',
				position: 'middle'
			}
		},
		y: {
			label: {
				text: 'Y Label',
				position: 'outer-middle'
			},
			tick: {
				format: d3.format("$,")
			}
		},
		y2: {
			show: true,
			label: {
				text: 'Test Label',
				position: 'outer-middle'
			},
			tick: {
				format: d3.format("$,")
			}
		}
	}
});*/

/*chart.legend.show(['data1', 'data2']);
chart.legend.show();

setTimeout(function() {
	chart.zoom([1, 4]);
}, 2000);*/
},{"./chartComponent/template.html":2,"./chartComponent/vm":3,"./loginSurface/template.html":5,"./loginSurface/vm":6,"./mainComponent/template.html":9,"./mainComponent/vm":10}],8:[function(require,module,exports){
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

		var baseRoute = "localhost:8888";

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
			createMenuItem("My Portfolio", "#/profile"),
			createMenuItem("Trade", "#/trade"),
			createMenuItem("Charts", "#/charts")
		];

		var resource = ko.observable(null);
		var symbol = ko.observable(null);

		Sammy(function() {
			this.get("#/profile", function() {
				resource("profile");
				symbol(null);
			});

			this.get("#/trade", function() {
				resource("trade");
				symbol(null);
			});

			this.get("#/charts", function() {
				resource("charts");
				symbol(null);
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
			symbol: symbol
		};
	};
};
},{}],9:[function(require,module,exports){
module.exports = '<div class="menu" data-bind="foreach: { data: menu, as: \'menuItem\'}">\n    <span>\n    	<knob-button class="menu-item" params="\n    		label: menuItem.label,\n    		click: menuItem.click\n    	"></knob-button>\n    </span>\n</div>\n';
},{}],10:[function(require,module,exports){
"use strict";

var ko = (window.ko);
var createMainComponent = require("./core");

module.exports = createMainComponent({
	ko: ko
});
},{"./core":8}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q29tcG9uZW50L2NvcmUuanMiLCJzcmMvcHVibGljL2NoYXJ0Q29tcG9uZW50L3RlbXBsYXRlLmh0bWwiLCJzcmMvcHVibGljL2NoYXJ0Q29tcG9uZW50L3ZtLmpzIiwic3JjL3B1YmxpYy9sb2dpblN1cmZhY2UvY29yZS5qcyIsInNyYy9wdWJsaWMvbG9naW5TdXJmYWNlL3RlbXBsYXRlLmh0bWwiLCJzcmMvcHVibGljL2xvZ2luU3VyZmFjZS92bS5qcyIsInNyYy9wdWJsaWMvbWFpbi5qcyIsInNyYy9wdWJsaWMvbWFpbkNvbXBvbmVudC9jb3JlLmpzIiwic3JjL3B1YmxpYy9tYWluQ29tcG9uZW50L3RlbXBsYXRlLmh0bWwiLCJzcmMvcHVibGljL21haW5Db21wb25lbnQvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRkZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMgfHwge307XHJcblxyXG5cdGlmKCFkZXBlbmRlbmNpZXMua28pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcy5rbyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGtvID0gZGVwZW5kZW5jaWVzLmtvO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oY29uZmlnKSB7XHJcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cdFx0dmFyIGNoYXJ0ID0gYzMuZ2VuZXJhdGUoe1xyXG5cdFx0XHRiaW5kdG86ICcjdGVzdF9jaGFydCcsXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHR4OiAneCcsXHJcblx0XHRcdFx0eEZvcm1hdDogJyVZLSVtLSVkICVIOiVNOiVTJyxcclxuXHRcdFx0XHRtaW1lVHlwZTogJ2NzdicsXHJcblx0XHRcdFx0dXJsOiAnLi9jaGFydF9kYXRhL2ZvcmV4X2RhdGFfdGVzdCcsXHJcblx0XHRcdFx0Z3JvdXBzOiBbXHJcblx0XHRcdFx0XHRbJ0hVRi9VU0QnXVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0a2V5czoge1xyXG5cdFx0XHRcdFx0eEZvcm1hdDogJyVZLSVtLSVkICVIOiVNOiVTJ1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdGF4aXM6IHtcclxuXHRcdFx0XHR5OiB7XHJcblx0XHRcdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdFx0XHR0ZXh0OiAnUHJpY2UnLFxyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogJ291dGVyLW1pZGRsZSdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHg6IHtcclxuXHRcdFx0XHRcdHR5cGU6ICd0aW1lc2VyaWVzJyxcclxuXHRcdFx0XHRcdGxhYmVsOiB7XHJcblx0XHRcdFx0XHRcdHRleHQ6ICdUaW1lJyxcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdtaWRkbGUnXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0dGljazoge1xyXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICclSDolTTolUydcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHpvb206IHtcclxuXHRcdFx0XHRlbmFibGVkOiB0cnVlLFxyXG5cdFx0XHRcdHJlc2NhbGU6IHRydWVcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIHpvb21CdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIlRlc3QgWm9vbVwiLFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGNoYXJ0Lnpvb20oW1xyXG5cdFx0XHRcdFx0XHQnMjAxNi0xMC0wMiAxNzowNDoxNycsXHJcblx0XHRcdFx0XHRcdCcyMDE2LTEwLTAyIDE3OjA3OjIxJ10pO1xyXG5cdFx0XHRcdH0sIDIwMDApO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciByZXNldEJ1dHRvbiA9IHtcclxuXHRcdFx0bGFiZWw6IFwiUmVzZXQgQ2hhcnRcIixcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNoYXJ0LnVuem9vbSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Y2hhcnQ6IGNoYXJ0LFxyXG5cdFx0XHRyZXNldEJ1dHRvbjogcmVzZXRCdXR0b24sXHJcblx0XHRcdHpvb21CdXR0b246IHpvb21CdXR0b25cclxuXHRcdH07XHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGRpdiBpZD1cInRlc3RfY2hhcnRcIj48L2Rpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHpvb21CdXR0b24ubGFiZWwsXFxuXHRcdGNsaWNrOiB6b29tQnV0dG9uLmNsaWNrXCI+XHRcdFxcblx0PC9rbm9iLWJ1dHRvbj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IHJlc2V0QnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogcmVzZXRCdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY2hhcnRDb21wb25lbnRDb3JlID0gcmVxdWlyZShcIi4vY29yZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hhcnRDb21wb25lbnRDb3JlKHtcclxuXHRrbzoga29cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcykge1xyXG5cdGlmKCFkZXBlbmRlbmNpZXMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlcGVuZGVuY2llcyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdH1cclxuXHJcblx0aWYoIWRlcGVuZGVuY2llcy5rbykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVwZW5kZW5jaWVzLmtvIGlzIG1hbmRhdG9yeVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUxvZ2luU3VyZmFjZShjb25maWcpIHtcclxuXHRcdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblx0XHRpZighY29uZmlnKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB1c2VySW5wdXQgPSB7XHJcblx0XHRcdHBsYWNlaG9sZGVyOiBcIlVzZXJOYW1lXCIsXHJcblx0XHRcdHZhbHVlOiBrby5vYnNlcnZhYmxlKG51bGwpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBwYXNzd29yZElucHV0ID0ge1xyXG5cdFx0XHRwbGFjZWhvbGRlcjogXCJwYXNzd29yZFwiLFxyXG5cdFx0XHR2YWx1ZToga28ub2JzZXJ2YWJsZShudWxsKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgbG9naW5CdXR0b24gPSB7XHJcblx0XHRcdGxhYmVsOiBcIkxvZ2luXCIsXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyh1c2VySW5wdXQudmFsdWUoKSArIFwiIGF0dGVtcHRpbmcgdG8gbG9nIGluIHdpdGggcGFzc3dvcmQ6IFwiICsgcGFzc3dvcmRJbnB1dC52YWx1ZSgpKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR1c2VySW5wdXQ6IHVzZXJJbnB1dCxcclxuXHRcdFx0cGFzc3dvcmRJbnB1dDogcGFzc3dvcmRJbnB1dCxcclxuXHRcdFx0bG9naW5CdXR0b246IGxvZ2luQnV0dG9uXHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHR2YWx1ZTogdXNlcklucHV0LnZhbHVlLFxcblx0XHRwbGFjZWhvbGRlcjogdXNlcklucHV0LnBsYWNlaG9sZGVyXFxuXHRcIj48L2tub2ItaW5wdXQ+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWlucHV0IHBhcmFtcz1cIlxcblx0XHR2YWx1ZTogcGFzc3dvcmRJbnB1dC52YWx1ZSxcXG5cdFx0cGxhY2Vob2xkZXI6IHBhc3N3b3JkSW5wdXQucGxhY2Vob2xkZXIsXFxuXHRcdHR5cGU6IFxcJ3Bhc3N3b3JkXFwnXFxuXHRcIj48L2tub2ItaW5wdXQ+XFxuPC9kaXY+XFxuPGRpdj5cXG5cdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0bGFiZWw6IGxvZ2luQnV0dG9uLmxhYmVsLFxcblx0XHRjbGljazogbG9naW5CdXR0b24uY2xpY2tcXG5cdFwiPjwva25vYi1idXR0b24+XFxuPC9kaXY+JzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgbG9naW5TdXJmYWNlQ29yZSA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ2luU3VyZmFjZUNvcmUoe1xyXG5cdGtvOiBrb1xyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbm9iID0gKHdpbmRvdy5rbm9iKTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImxvZ2luLXN1cmZhY2VcIiwgcmVxdWlyZShcIi4vbG9naW5TdXJmYWNlL3ZtXCIpLCByZXF1aXJlKFwiLi9sb2dpblN1cmZhY2UvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcImNoYXJ0LWNvbXBvbmVudFwiLCByZXF1aXJlKFwiLi9jaGFydENvbXBvbmVudC92bVwiKSwgcmVxdWlyZShcIi4vY2hhcnRDb21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcblx0a25vYi5yZWdpc3RlckNvbXBvbmVudChcIm1haW4tY29tcG9uZW50XCIsIHJlcXVpcmUoXCIuL21haW5Db21wb25lbnQvdm1cIiksIHJlcXVpcmUoXCIuL21haW5Db21wb25lbnQvdGVtcGxhdGUuaHRtbFwiKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5pdDtcclxuXHJcbi8qdmFyIGZvcmV4X2NoYXJ0ID0gcmVxdWlyZShcIi4vZm9yZXgtY2hhcnRcIik7XHJcblxyXG5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdGZvcmV4X2NoYXJ0Lnpvb20oW1xyXG5cdFx0JzIwMTYtMTAtMDIgMTc6MDQ6MTcnLFxyXG5cdFx0JzIwMTYtMTAtMDIgMTc6MDc6MjEnXHJcblx0XHRdKTtcclxufSwgMjAwMCk7XHJcblxyXG52YXIgY2hhcnQgPSBjMy5nZW5lcmF0ZSh7XHJcblx0XHRiaW5kdG86ICcjY2hhcnQnLFxyXG5cdFx0ZGF0YToge1xyXG5cdFx0XHR1cmw6ICcuL2NoYXJ0X2RhdGEvdGVzdF9kYXRhJ1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRkYXRhOiB7XHJcblx0XHRcdGNvbHVtbnM6IFtcclxuXHRcdFx0WydkYXRhMScsIDMwLCAyMDAsIDEwMCwgNDAwLCAxNTAsIDI1MF0sXHJcblx0XHRcdFsnZGF0YTInLCA1MCwgMjAsIDEwLCA0MCwgMTUsIDI1XVxyXG5cdFx0XHRdLFxyXG5cdFx0XHRheGVzOiB7XHJcblx0XHRcdFx0ZGF0YTI6ICd5MidcclxuXHRcdFx0fSxcclxuXHRcdFx0dHlwZXM6IHtcclxuXHRcdFx0XHRkYXRhMjogJ2JhcidcclxuXHRcdFx0fVxyXG5cdH0sXHJcblx0YXhpczoge1xyXG5cdFx0eDoge1xyXG5cdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdHRleHQ6ICdYIExhYmVsJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ21pZGRsZSdcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHk6IHtcclxuXHRcdFx0bGFiZWw6IHtcclxuXHRcdFx0XHR0ZXh0OiAnWSBMYWJlbCcsXHJcblx0XHRcdFx0cG9zaXRpb246ICdvdXRlci1taWRkbGUnXHJcblx0XHRcdH0sXHJcblx0XHRcdHRpY2s6IHtcclxuXHRcdFx0XHRmb3JtYXQ6IGQzLmZvcm1hdChcIiQsXCIpXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR5Mjoge1xyXG5cdFx0XHRzaG93OiB0cnVlLFxyXG5cdFx0XHRsYWJlbDoge1xyXG5cdFx0XHRcdHRleHQ6ICdUZXN0IExhYmVsJyxcclxuXHRcdFx0XHRwb3NpdGlvbjogJ291dGVyLW1pZGRsZSdcclxuXHRcdFx0fSxcclxuXHRcdFx0dGljazoge1xyXG5cdFx0XHRcdGZvcm1hdDogZDMuZm9ybWF0KFwiJCxcIilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSk7Ki9cclxuXHJcbi8qY2hhcnQubGVnZW5kLnNob3coWydkYXRhMScsICdkYXRhMiddKTtcclxuY2hhcnQubGVnZW5kLnNob3coKTtcclxuXHJcbnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0Y2hhcnQuem9vbShbMSwgNF0pO1xyXG59LCAyMDAwKTsqLyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMpIHtcclxuXHRpZighZGVwZW5kZW5jaWVzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMgaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9IFxyXG5cclxuXHRpZighZGVwZW5kZW5jaWVzLmtvKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZXBlbmRlbmNpZXMua28gaXMgbWFuZGF0b3J5IVwiKTtcclxuXHR9XHJcblxyXG5cdHZhciBrbyA9IGRlcGVuZGVuY2llcy5rbztcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHRcdHZhciBiYXNlUm91dGUgPSBcImxvY2FsaG9zdDo4ODg4XCI7XHJcblxyXG5cdFx0ZnVuY3Rpb24gY3JlYXRlTWVudUl0ZW0obGFiZWwsIHVybCkge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGxhYmVsOiBsYWJlbCxcclxuXHRcdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gdXJsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBtZW51ID0gW1xyXG5cdFx0XHRjcmVhdGVNZW51SXRlbShcIk15IFBvcnRmb2xpb1wiLCBcIiMvcHJvZmlsZVwiKSxcclxuXHRcdFx0Y3JlYXRlTWVudUl0ZW0oXCJUcmFkZVwiLCBcIiMvdHJhZGVcIiksXHJcblx0XHRcdGNyZWF0ZU1lbnVJdGVtKFwiQ2hhcnRzXCIsIFwiIy9jaGFydHNcIilcclxuXHRcdF07XHJcblxyXG5cdFx0dmFyIHJlc291cmNlID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuXHRcdHZhciBzeW1ib2wgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG5cclxuXHRcdFNhbW15KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmdldChcIiMvcHJvZmlsZVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcInByb2ZpbGVcIik7XHJcblx0XHRcdFx0c3ltYm9sKG51bGwpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiIy90cmFkZVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXNvdXJjZShcInRyYWRlXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvY2hhcnRzXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlc291cmNlKFwiY2hhcnRzXCIpO1xyXG5cdFx0XHRcdHN5bWJvbChudWxsKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdldChcIiMvY2hhcnRzLzpzeW1ib2xcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3ltYm9sKHRoaXMucGFyYW1zLnN5bWJvbCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJhIGNoYXJ0IHNob3VsZCBiZSBoZXJlIHdpdGg6IFwiICsgc3ltYm9sKCkpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2V0KFwiXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUm9vdCBsb2xcIik7XHJcblx0XHRcdH0pO1x0XHJcblx0XHR9KS5ydW4oKTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtZW51OiBtZW51LFxyXG5cdFx0XHRyZXNvdXJjZTogcmVzb3VyY2UsXHJcblx0XHRcdHN5bWJvbDogc3ltYm9sXHJcblx0XHR9O1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cIm1lbnVcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiB7IGRhdGE6IG1lbnUsIGFzOiBcXCdtZW51SXRlbVxcJ31cIj5cXG4gICAgPHNwYW4+XFxuICAgIFx0PGtub2ItYnV0dG9uIGNsYXNzPVwibWVudS1pdGVtXCIgcGFyYW1zPVwiXFxuICAgIFx0XHRsYWJlbDogbWVudUl0ZW0ubGFiZWwsXFxuICAgIFx0XHRjbGljazogbWVudUl0ZW0uY2xpY2tcXG4gICAgXHRcIj48L2tub2ItYnV0dG9uPlxcbiAgICA8L3NwYW4+XFxuPC9kaXY+XFxuJzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIgY3JlYXRlTWFpbkNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2NvcmVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZU1haW5Db21wb25lbnQoe1xyXG5cdGtvOiBrb1xyXG59KTsiXX0=
