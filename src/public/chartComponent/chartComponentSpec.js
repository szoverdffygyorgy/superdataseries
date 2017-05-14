"use strict";

const ko = require("knockout");
const core = require("./core");

describe("Chart component", () => {

  describe(" Invalid config", () => {
    it(" missing seriesUrl", () => {
      let createChartComponent = core({
        ko: ko
      });

      expect(() => {
        createChartComponent({
          divId: "id",
          baseRoute: "aRoute",
          selectedSymbol: ko.observable(null)
        })
      }).toThrowError("config.seriesUrl is mandatory and should be a string!");
    });

    it(" wrong type of seriesUrl", () => {
      let createChartComponent = core({
        ko: ko
      });

      expect(() => {
        createChartComponent({
          seriesUrl: 3,
          divId: "id",
          baseRoute: "aRoute",
          selectedSymbol: ko.observable(null)
        })
      }).toThrowError("config.seriesUrl is mandatory and should be a string!");
    });

    it(" missing divId", () => {
      let createChartComponent = core({
        ko: ko
      });

      expect(() => {
        createChartComponent({
          seriesUrl: "aRoute",
          baseRoute: "aRoute",
          selectedSymbol: ko.observable(null)
        })
      }).toThrowError("config.divId is mandatory and should be a string!");
    });

    it(" wrong type of divId", () => {
      let createChartComponent = core({
        ko: ko
      });

      expect(() => {
        createChartComponent({
          seriesUrl: "aRoute",
          divId: 4,
          baseRoute: "aRoute",
          selectedSymbol: ko.observable(null)
        })
      }).toThrowError("config.divId is mandatory and should be a string!");
    });

    it(" missing baseRoute", () => {
      let createChartComponent = core({
        ko: ko
      });

      expect(() => {
        createChartComponent({
          seriesUrl: "aRoute",
          divId: "id",
          selectedSymbol: ko.observable(null)
        })
      }).toThrowError("config.baseRoute is mandatory and should be a string!");
    });

    it(" wrong type of baseRoute", () => {
      let createChartComponent = core({
        ko: ko
      });

      expect(() => {
        createChartComponent({
          seriesUrl: "aRoute",
          divId: "id",
          baseRoute: 1,
          selectedSymbol: ko.observable(null)
        })
      }).toThrowError("config.baseRoute is mandatory and should be a string!");
    });

    it(" missing selectedSymbol", () => {
      let createChartComponent = core({
        ko: ko
      });

      expect(() => {
        createChartComponent({
          seriesUrl: "aRoute",
          divId: "id",
          baseRoute: "aRoute"
        })
      }).toThrowError("config.selectedSymbol is mandatory and should be a knockout observable!");
    });

    it(" wrong type of baseRoute", () => {
      let createChartComponent = core({
        ko: ko
      });

      expect(() => {
        createChartComponent({
          seriesUrl: "aRoute",
          divId: "id",
          baseRoute: "aRoute",
          selectedSymbol: "not an observable"
        })
      }).toThrowError("config.selectedSymbol is mandatory and should be a knockout observable!");
    });
  });

  describe(" Valid config", () => {
    let createChartComponent;
    let config;
    let mockC3;

    beforeEach(() => {
      config = {
        seriesUrl: "aRoute",
        divId: "id",
        baseRoute: "aRoute",
        selectedSymbol: ko.observable({
          label: ko.observable("symbol"),
          value: "SYMBOL"
        })
      };

      mockC3 = {
        generate: (param) => {
          return {}
        }
      }

      spyOn(mockC3, "generate");

      createChartComponent = core({
        ko: ko,
        c3: mockC3
      });
    });

    it(" interface check", () => {
      let chartComponent = createChartComponent(config);

      /*expect(ko.isObservable(chartComponent.selectedSymbol)).toBe(true);
      expect(typeof chartComponent.selectedSymbol().label).toBe("string");
      expect(chartComponent.selectedSymbol().label).tobe("symbol");
      expect(typeof chartComponent.selectedSymbol().value).toBe("string");
      expect(chartComponent.selectedSymbol().value).toBe("SYMBOL");*/
      expect(typeof chartComponent.divId).toBe("string");
      expect(chartComponent.divId).toBe("id");
      expect(mockC3.generate).toHaveBeenCalled();
      /*expect(typeof chartComponent.seriesUrl).toBe("string");
      expect(chartComponent.seriesUrl).toBe("aRoute");
      expect(typeof chartComponent.baseRoute).toBe("string");
      expect(chartComponent.baseRoute).tobe("aRoute");*/
    });
  });
});
