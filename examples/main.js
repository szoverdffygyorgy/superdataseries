var ko = require("knockout");
var knob = require("knob-js");

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