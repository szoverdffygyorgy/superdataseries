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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBrbyA9ICh3aW5kb3cua28pO1xyXG52YXIga25vYiA9ICh3aW5kb3cua25vYik7XHJcblxyXG52YXIgY29uZmlnID0ge1xyXG5cdHRoZW1lOiBcImJhY2tncm91bmRcIiwgLy9iYWNrZ3JvdW5kLCBib3JkZXIsIGJvcmRlci1maWxsLCBjaGFtYWlsZW9uXHJcblx0Ly8gZm9yIGRlZmF1bHQgYW5kIHRoZW1lNFxyXG5cdGNvbG9yczoge1xyXG5cdFx0cHJpbWFyeTogXCIjNDRjMGZjXCIsXHJcblx0XHRzZWNvbmRhcnk6IFwiI2Y0ZjRmNFwiLFxyXG5cclxuXHRcdGluZm86IFwiIzI1YWFmMlwiLFxyXG5cdFx0c3VjY2VzczogXCIjNTRjMDU5XCIsXHJcblx0XHR3YXJuaW5nOiBcIiNmNWE1MDBcIixcclxuXHRcdGVycm9yOiBcIiNlZTQ4M2JcIixcclxuXHJcblx0XHR3aGl0ZTogXCIjZmZmXCIsXHJcblx0XHRibGFjazogXCIjMDAwXCIsXHJcblxyXG5cdFx0bGlnaHRHcmF5OiBcIiNmNWY3ZjhcIixcclxuXHRcdG1lZGl1bUdyYXk6IFwiI2YwZjJmNFwiLFxyXG5cdFx0ZGFya0dyYXk6IFwiI2U1ZTllY1wiLFxyXG5cclxuXHRcdGJvcmRlcjogXCIjZDJjZGM2XCIgLy9vbmx5IGZvciB0aGUgY2hhbWFpbGVvbiBzdHlsZVxyXG5cdH0sXHJcblx0Ly8gZm9yIGNoYW1haWxlb24gdGhlbWVcclxuXHRjb2xvcjE6IHtcclxuXHRcdHByaW1hcnk6IFwiIzQ0YzBmY1wiLFxyXG5cdFx0c2Vjb25kYXJ5OiBcIiNmNGY0ZjRcIixcclxuXHJcblx0XHRpbmZvOiB7XHJcblx0XHRcdGJhY2tncm91bmQ6IFwiIzI1YWFmMlwiXHJcblx0XHR9LFxyXG5cdFx0c3VjY2Vzczoge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiBcIiM1NGMwNTlcIlxyXG5cdFx0fSxcclxuXHRcdHdhcm5pbmc6IHtcclxuXHRcdFx0YmFja2dyb3VuZDogXCIjZjVhNTAwXCJcclxuXHRcdH0sXHJcblx0XHRlcnJvcjoge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiBcIiNlZTQ4M2JcIlxyXG5cdFx0fSxcclxuXHJcblx0XHR3aGl0ZTogXCIjZmZmXCIsXHJcblxyXG5cdFx0bGlnaHRHcmF5OiBcIiNmNWY3ZjhcIixcclxuXHRcdG1lZGl1bUdyYXk6IFwiI2YwZjJmNFwiLFxyXG5cdFx0ZGFya0dyYXk6IFwiI2U1ZTllY1wiLFxyXG5cdFx0Ym9yZGVyOiBcIiNkMmNkYzZcIixcclxuXHJcblx0XHRibGFjazogXCIjMDAwXCIsXHJcblx0XHR0cmFuc3BhcmVudDogXCJ0cmFuc3BhcmVudFwiXHJcblx0fSxcclxuXHRpY29uczoge1xyXG5cdFx0c2VhcmNoOiBcIiNpY29uLXNlYXJjaFwiXHJcblx0fVxyXG59O1xyXG5cclxua25vYi5pbml0KGNvbmZpZyk7XHJcbnN1cGVyZGF0YXNlcmllcygpO1xyXG5rby5hcHBseUJpbmRpbmdzKHt9KTsiXX0=
