"use strict";

const ko = require("knockout");
const core = require("./core");

describe("Profile component", () => {
  let createProfileComponent;

  beforeEach(() => {
    createProfileComponent = core({
      ko: ko
    });
  });
  describe(" Invalid config", () => {
    it(" missing user", () => {
      expect(() => {
        createProfileComponent({
          tradingHistory: ko.observableArray([]),
          tradingHistoryQueryUrl: "anUrl",
          errorMessage: ko.observable(null)
        })
      }).toThrowError("config.user is mandatory and should be a knockout observable!");
    });

    it(" wrong type of user", () => {
      expect(() => {
        createProfileComponent({
          user: "not an observable",
          tradingHistory: ko.observableArray([]),
          tradingHistoryQueryUrl: "anUrl",
          errorMessage: ko.observable(null)
        })
      }).toThrowError("XMLHttpRequest is not defined");
    });

    it(" missing tradingHistory", () => {
      expect(() => {
        createProfileComponent({
          user: ko.observable({
            name: "user"
          }),
          tradingHistoryQueryUrl: "anUrl",
          errorMessage: ko.observable(null)
        })
      }).toThrowError("config.tradingHistory is mandatory and should be a knockout observableArray!");
    });

    it(" wrong type of tradingHistory", () => {
      expect(() => {
        createProfileComponent({
          user: ko.observable({
            name: "user"
          }),
          tradingHistory: "not an observablearray",
          tradingHistoryQueryUrl: "anUrl",
          errorMessage: ko.observable(null)
        })
      }).toThrowError("XMLHttpRequest is not defined");
    });

    it(" missing tradingHistoryQueryUrl", () => {
      expect(() => {
        createProfileComponent({
          tradingHistory: ko.observableArray([]),
          user: ko.observable({
            name: "user"
          }),
          errorMessage: ko.observable(null)
        })
      }).toThrowError("config.tradingHistory is mandatory and should be a string!");
    });

    it(" wrong type of user", () => {
      expect(() => {
        createProfileComponent({
          user: ko.observable({
            name: "user"
          }),
          tradingHistory: ko.observableArray([]),
          tradingHistoryQueryUrl: 4,
          errorMessage: ko.observable(null)
        })
      }).toThrowError("XMLHttpRequest is not defined");
    });

    it(" missing errorMessage", () => {
      expect(() => {
        createProfileComponent({
          tradingHistory: ko.observableArray([]),
          tradingHistoryQueryUrl: "anUrl",
          user: ko.observable({
            name: "user"
          })
        })
      }).toThrowError("config.errorMessage is mandatory and should be a knockout observable!");
    });

    it(" wrong type of errorMessage", () => {
      expect(() => {
        createProfileComponent({
          tradingHistory: ko.observableArray([]),
          tradingHistoryQueryUrl: "anUrl",
          user: ko.observable({
            name: "user"
          }),
          errorMessage: "not an observable"
        })
      }).toThrowError("XMLHttpRequest is not defined");
    });
  });

  describe(" Valid config", () => {
    it(" Interface check", () => {

    });
  });
});
