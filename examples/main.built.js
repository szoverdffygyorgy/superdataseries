(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ko = (window.ko);
var knob = (window.knob);

var config = {
	theme: "superdata",
	//for default and theme 4
	colorSet01: {
		primaryColor: "#ff4e00",
		secondaryColor: "#8ea604",

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

		lightGray: "#f5bb00",
		mediumGray: "#ec9f05",
		darkGray: "#bf3100",
		border: "maroon",

		black: "#000",
		transparent: "transparent"
	},
	colorSet: {
		primaryColor: "#44c0fc",
		secondaryColor: "#9b9b9b",

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
superdata();
ko.applyBindings({});	
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIga28gPSAod2luZG93LmtvKTtcclxudmFyIGtub2IgPSAod2luZG93Lmtub2IpO1xyXG5cclxudmFyIGNvbmZpZyA9IHtcclxuXHR0aGVtZTogXCJzdXBlcmRhdGFcIixcclxuXHQvL2ZvciBkZWZhdWx0IGFuZCB0aGVtZSA0XHJcblx0Y29sb3JTZXQwMToge1xyXG5cdFx0cHJpbWFyeUNvbG9yOiBcIiNmZjRlMDBcIixcclxuXHRcdHNlY29uZGFyeUNvbG9yOiBcIiM4ZWE2MDRcIixcclxuXHJcblx0XHRpbmZvOiB7XHJcblx0XHRcdGJhY2tncm91bmQ6IFwiIzI1YWFmMlwiXHJcblx0XHR9LFxyXG5cdFx0c3VjY2Vzczoge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiBcIiM1NGMwNTlcIlxyXG5cdFx0fSxcclxuXHRcdHdhcm5pbmc6IHtcclxuXHRcdFx0YmFja2dyb3VuZDogXCIjZjVhNTAwXCJcclxuXHRcdH0sXHJcblx0XHRlcnJvcjoge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiBcIiNlZTQ4M2JcIlxyXG5cdFx0fSxcclxuXHJcblx0XHR3aGl0ZTogXCIjZmZmXCIsXHJcblxyXG5cdFx0bGlnaHRHcmF5OiBcIiNmNWJiMDBcIixcclxuXHRcdG1lZGl1bUdyYXk6IFwiI2VjOWYwNVwiLFxyXG5cdFx0ZGFya0dyYXk6IFwiI2JmMzEwMFwiLFxyXG5cdFx0Ym9yZGVyOiBcIm1hcm9vblwiLFxyXG5cclxuXHRcdGJsYWNrOiBcIiMwMDBcIixcclxuXHRcdHRyYW5zcGFyZW50OiBcInRyYW5zcGFyZW50XCJcclxuXHR9LFxyXG5cdGNvbG9yU2V0OiB7XHJcblx0XHRwcmltYXJ5Q29sb3I6IFwiIzQ0YzBmY1wiLFxyXG5cdFx0c2Vjb25kYXJ5Q29sb3I6IFwiIzliOWI5YlwiLFxyXG5cclxuXHRcdGluZm86IHtcclxuXHRcdFx0YmFja2dyb3VuZDogXCIjMjVhYWYyXCJcclxuXHRcdH0sXHJcblx0XHRzdWNjZXNzOiB7XHJcblx0XHRcdGJhY2tncm91bmQ6IFwiIzU0YzA1OVwiXHJcblx0XHR9LFxyXG5cdFx0d2FybmluZzoge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiBcIiNmNWE1MDBcIlxyXG5cdFx0fSxcclxuXHRcdGVycm9yOiB7XHJcblx0XHRcdGJhY2tncm91bmQ6IFwiI2VlNDgzYlwiXHJcblx0XHR9LFxyXG5cclxuXHRcdHdoaXRlOiBcIiNmZmZcIixcclxuXHJcblx0XHRsaWdodEdyYXk6IFwiI2Y1ZjdmOFwiLFxyXG5cdFx0bWVkaXVtR3JheTogXCIjZjBmMmY0XCIsXHJcblx0XHRkYXJrR3JheTogXCIjZTVlOWVjXCIsXHJcblx0XHRib3JkZXI6IFwiI2QyY2RjNlwiLFxyXG5cclxuXHRcdGJsYWNrOiBcIiMwMDBcIixcclxuXHRcdHRyYW5zcGFyZW50OiBcInRyYW5zcGFyZW50XCJcclxuXHR9LFxyXG5cdGljb25zOiB7XHJcblx0XHRzZWFyY2g6IFwiI2ljb24tc2VhcmNoXCJcclxuXHR9XHJcbn07XHJcblxyXG5rbm9iLmluaXQoY29uZmlnKTtcclxuc3VwZXJkYXRhKCk7XHJcbmtvLmFwcGx5QmluZGluZ3Moe30pO1x0Il19
