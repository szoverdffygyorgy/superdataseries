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

		var userName = ko.observable(null);
		var password = ko.observable(null);

		var loginButton = {
			label: "Login",
			click: function() {
				console.log(userName + " attempting to log in with  password" + password);
			}
		};

		return {
			userName: userName,
			password: password,
			loginButton: loginButton
		};
	};
};