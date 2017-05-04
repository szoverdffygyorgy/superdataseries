var ko = require("knockout");
var knob = require("knob-js");

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
