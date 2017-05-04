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

		if(!config.errorMessage && typeof config.errorMessage !== "function") {
			throw new Error("config.errorMessage is mandatory and it should be a knockout observable!");
		}

		var user = config.user;
		var loginLabel = config.loginLabel;
		var menu = config.menu;
		let errorMessage = config.errorMessage;

		var userInput = {
			placeholder: "User",
			value: ko.observable(null)
		};

		var passwordInput = {
			placeholder: "Password",
			value: ko.observable(null)
		};

		var loginButton = {
			label: "Login",
			click: function() {
				var post = new XMLHttpRequest();

				post.open("POST", "./loginrequest", true);

				post.onreadystatechange = function() {
    				if(post.readyState == 4/* && post.status == 200*/) {
        				console.log(post.responseText);
								let responseObject = JSON.parse(post.responseText);

								if(!responseObject.ok) {
									user(null);
									errorMessage(responseObject.error);
								} else {
									user(responseObject.result);
									errorMessage(null);
									menu[0].visible(false);
									menu[1].visible(true);
									location.hash = "/users/" + user().userName;
								}
    				}
				}

				post.setRequestHeader("Content-type", "application/json");
				post.send(JSON.stringify({
					user: userInput.value(),
					pass: passwordInput.value()
				}));
			}
		};

		return {
			userInput: userInput,
			passwordInput: passwordInput,
			loginButton: loginButton
		};
	};
};
