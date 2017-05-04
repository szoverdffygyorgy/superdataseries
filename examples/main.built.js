(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.superdataseries = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ko = (window.ko);
var knob = (window.knob);

var config = {
	theme: "background", //background, border, border-fill, chamaileon
	// for default and theme4
	colors: {
		primary: "#44c0fc",
		secondary: "#f4f4f4",

		info: "#25aaf2",
		success: "#54c059",
		warning: "#f5a500",
		error: "#ee483b",

		white: "#fff",
		black: "#000",

		lightGray: "#f5f7f8",
		mediumGray: "#f0f2f4",
		darkGray: "#e5e9ec",

		border: "#d2cdc6" //only for the chamaileon style
	},
	// for chamaileon theme
	color1: {
		primary: "#44c0fc",
		secondary: "#f4f4f4",

		info: {
			background: "#25aaf2"
		},
		success: {
			background: "#54c059"
		},
		warning: {
			background: "#f5a500"
		},
		error: {
			background: "#ee483b"
		},

		white: "#fff",

		lightGray: "#f5f7f8",
		mediumGray: "#f0f2f4",
		darkGray: "#e5e9ec",
		border: "#d2cdc6",

		black: "#000",
		transparent: "transparent"
	},
	icons: {
		search: "#icon-search"
	}
};

knob.init(config);
superdataseries();
ko.applyBindings({});

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGtvID0gKHdpbmRvdy5rbyk7XHJcbnZhciBrbm9iID0gKHdpbmRvdy5rbm9iKTtcclxuXHJcbnZhciBjb25maWcgPSB7XHJcblx0dGhlbWU6IFwiYmFja2dyb3VuZFwiLCAvL2JhY2tncm91bmQsIGJvcmRlciwgYm9yZGVyLWZpbGwsIGNoYW1haWxlb25cclxuXHQvLyBmb3IgZGVmYXVsdCBhbmQgdGhlbWU0XHJcblx0Y29sb3JzOiB7XHJcblx0XHRwcmltYXJ5OiBcIiM0NGMwZmNcIixcclxuXHRcdHNlY29uZGFyeTogXCIjZjRmNGY0XCIsXHJcblxyXG5cdFx0aW5mbzogXCIjMjVhYWYyXCIsXHJcblx0XHRzdWNjZXNzOiBcIiM1NGMwNTlcIixcclxuXHRcdHdhcm5pbmc6IFwiI2Y1YTUwMFwiLFxyXG5cdFx0ZXJyb3I6IFwiI2VlNDgzYlwiLFxyXG5cclxuXHRcdHdoaXRlOiBcIiNmZmZcIixcclxuXHRcdGJsYWNrOiBcIiMwMDBcIixcclxuXHJcblx0XHRsaWdodEdyYXk6IFwiI2Y1ZjdmOFwiLFxyXG5cdFx0bWVkaXVtR3JheTogXCIjZjBmMmY0XCIsXHJcblx0XHRkYXJrR3JheTogXCIjZTVlOWVjXCIsXHJcblxyXG5cdFx0Ym9yZGVyOiBcIiNkMmNkYzZcIiAvL29ubHkgZm9yIHRoZSBjaGFtYWlsZW9uIHN0eWxlXHJcblx0fSxcclxuXHQvLyBmb3IgY2hhbWFpbGVvbiB0aGVtZVxyXG5cdGNvbG9yMToge1xyXG5cdFx0cHJpbWFyeTogXCIjNDRjMGZjXCIsXHJcblx0XHRzZWNvbmRhcnk6IFwiI2Y0ZjRmNFwiLFxyXG5cclxuXHRcdGluZm86IHtcclxuXHRcdFx0YmFja2dyb3VuZDogXCIjMjVhYWYyXCJcclxuXHRcdH0sXHJcblx0XHRzdWNjZXNzOiB7XHJcblx0XHRcdGJhY2tncm91bmQ6IFwiIzU0YzA1OVwiXHJcblx0XHR9LFxyXG5cdFx0d2FybmluZzoge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiBcIiNmNWE1MDBcIlxyXG5cdFx0fSxcclxuXHRcdGVycm9yOiB7XHJcblx0XHRcdGJhY2tncm91bmQ6IFwiI2VlNDgzYlwiXHJcblx0XHR9LFxyXG5cclxuXHRcdHdoaXRlOiBcIiNmZmZcIixcclxuXHJcblx0XHRsaWdodEdyYXk6IFwiI2Y1ZjdmOFwiLFxyXG5cdFx0bWVkaXVtR3JheTogXCIjZjBmMmY0XCIsXHJcblx0XHRkYXJrR3JheTogXCIjZTVlOWVjXCIsXHJcblx0XHRib3JkZXI6IFwiI2QyY2RjNlwiLFxyXG5cclxuXHRcdGJsYWNrOiBcIiMwMDBcIixcclxuXHRcdHRyYW5zcGFyZW50OiBcInRyYW5zcGFyZW50XCJcclxuXHR9LFxyXG5cdGljb25zOiB7XHJcblx0XHRzZWFyY2g6IFwiI2ljb24tc2VhcmNoXCJcclxuXHR9XHJcbn07XHJcblxyXG5rbm9iLmluaXQoY29uZmlnKTtcclxuc3VwZXJkYXRhc2VyaWVzKCk7XHJcbmtvLmFwcGx5QmluZGluZ3Moe30pO1xyXG4iXX0=
