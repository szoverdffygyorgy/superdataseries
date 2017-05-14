"use strict";

module.exports = function(dependencies) {
	dependencies = dependencies || {};

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function(config) {
		config = config || {};

		/*if(!config.name && typeof config.name !== "string") {
			throw new Error("config.name is mandatory and should be a string!");
		}

		if(!config.profilePictureUrl && typeof config.profilePictureUrl !== "string") {
			throw new Error("config.profilePictureUrl is mandatory and should be a string!");
		}

		if(!config.balance && typeof config.balance !== "number") {
			throw new Error("config.balance is mandatory and should be a number!");
		}*/

		if(!config.user && typeof config.user !== "function") {
			throw new Error("config.user is mandatory and should be a knockout observable!");
		}

		if(!config.tradingHistory && typeof config.tradingHistory !== "function") {
			throw new Error("config.tradingHistory is mandatory and should be a knockout observableArray!");
		}

		if(!config.tradingHistoryQueryUrl && typeof config.tradingHistoryQueryUrl !== "string") {
			throw new Error("config.tradingHistory is mandatory and should be a string!");
		}

		if(!config.errorMessage && typeof config.errorMessage !== "function") {
			throw new Error("config.errorMessage is mandatory and should be a knockout observable!");
		}

		/*var name = config.name;
		var profilePictureUrl = config.profilePictureUrl;
		var balance = config.balance;*/
		var user = config.user;
		var tradingHistory = config.tradingHistory;
		var tradingHistoryQueryUrl = config.tradingHistoryQueryUrl;
		var errorMessage = config.errorMessage;

		var historyVisible = ko.observable(false);
		var historyButtons = {
			show: {
				label: "Show History",
				click: () => {
					historyVisible(true);
				}
			},
			hide: {
				label: "Hide History",
				click: () => {
					historyVisible(false);
				}
			}
		}

		let getHistory = new XMLHttpRequest();
		getHistory.open("GET", tradingHistoryQueryUrl + user().userName, true);
		getHistory.onreadystatechange = () => {
			if(getHistory.readyState === 4) {
				let responseObject = JSON.parse(getHistory.responseText);

				if(!responseObject.ok) {
					errorMessage(responseObject.error);
				} else {
					errorMessage(null);
					tradingHistory(responseObject.result);
				}
			}
		}

		getHistory.send(null);

		var portfolio = ko.computed(() => {
			if(!user()) {
				return [];
			}

			var returnable = [];
			for(var prop in user().portfolio) {
				console.log(prop ,user().portfolio);
				returnable.push({
					instrument: prop,
					amount: user().portfolio[prop]
				});
			}

			return returnable;
		});

		return {
			/*name: name,
			profilePictureUrl: profilePictureUrl,
			balance: balance,*/
			user: user,
			tradingHistory: tradingHistory,
			historyButtons: historyButtons,
			historyVisible: historyVisible,
			portfolio: portfolio
		};
	};
};
