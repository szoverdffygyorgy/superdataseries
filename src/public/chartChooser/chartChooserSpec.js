"use strict";

const ko = require("knockout");
const core = require("./core");

describe("Chart chooser", () => {

  describe(" invalid config", () => {
    it(" missing config.baseRoute", () => {
      let createChartChooser = core({
        ko: ko
      });

      expect(() => {
        createChartChooser({
          symbols: ["stuff", "more stuff"],
          selectedSymbol: ko.observable(null)
        })
      }).toThrowError("config.baseRoute is mandatory and should be a string!");
    });

    it(" wrong type of baseRoute", () => {
      let createChartChooser = core({
        ko: ko
      });

      expect(() => {
        createChartChooser({
          baseRoute: 10,
          symbols: ["stuff", "more stuff"],
          selectedSymbol: ko.observable(null)
        })
      }).toThrowError("config.baseRoute is mandatory and should be a string!");
    });

    it(" missing symbols", () => {
      let createChartChooser = core({
        ko: ko
      });

      expect(() => {
        createChartChooser({
          baseRoute: "aRoute",
          selectedSymbol: ko.observable(null)
        })
      }).toThrowError("config.symbols is mandatory and should be an array!");
    });

    it(" wrong type of symbols", () => {
      let createChartChooser = core({
        ko: ko
      });

      expect(() => {
        createChartChooser({
          baseRoute: "aRoute",
          symbols: "notAnArray",
          selectedSymbol: ko.observable(null)
        })
      }).toThrowError("config.symbols is mandatory and should be an array!");
    });

    it(" missing selectedSymbol", () => {
      let createChartChooser = core({
        ko: ko
      });

      expect(() => {
        createChartChooser({
          baseRoute: "aRoute",
          symbols: ["stuff", "more stuff"]
        })
      }).toThrowError("config.selectedSymbol is mandatory and should be a knockout observable!");
    });

    it(" wrong type of selectedSymbol", () => {
      let createChartChooser = core({
        ko: ko
      });

      expect(() => {
        createChartChooser({
          baseRoute: "aRoute",
          symbols: ["stuff", "more stuff"],
          selectedSymbol: 4
        })
      }).toThrowError("config.selectedSymbol is mandatory and should be a knockout observable!");
    });
  });

  describe("Valid config", () => {
    let config = {
      baseRoute: "aRoute",
      symbols: [
        {
          label: "first",
          value: "FIRST"
        },
        {
          label: "second",
          value: "SECOND"
        }
      ],
      selectedSymbol: ko.observable(null)
    };

    it(" Interface check", () => {
      let createChartChooser = core({
        ko: ko
      });

      let chartChooser = createChartChooser(config);

      expect(typeof chartChooser.dropdownLabel).toBe("string");
      expect(chartChooser.dropdownLabel).toBe("Stocks: ");
      expect(chartChooser.symbols instanceof Array).toBe(true);
      expect(chartChooser.symbols.length).toBe(2);
      expect(ko.isObservable(chartChooser.selectedSymbol)).toBe(true);
      expect(chartChooser.selectedSymbol()).toBe(null);
      expect(ko.isObservable(chartChooser.selectedIdx)).toBe(true);
      expect(chartChooser.selectedIdx()).toBe(null);
      expect(typeof chartChooser.loadChart).toBe("object");
      expect(typeof chartChooser.loadChart.label).toBe("string");
      expect(chartChooser.loadChart.label).toBe("Select");
      expect(typeof chartChooser.loadChart.click).toBe("function");
    });
  });
});
