"use strict";

const ko = require("knockout");
const core = require("./core");

describe("Login surface", () => {

  describe(" Invalid config", () => {
    it(" missing user",  () => {
      let createLoginSurface = core({
        ko: ko
      });

      expect(() => {
        createLoginSurface({
          errorMessage: ko.observable(null),
          menu: ["stuff"]
        })
      }).toThrowError("config.user is mandatory and it should be a knockout observable!");
    });

    it(" wrong type of user", () => {
      let createLoginSurface = core({
        ko: ko
      });

      expect(() => {
        createLoginSurface({
          menu: ["stuff"],
          user: "not an observable",
          errorMessage: ko.observable(null)
        })
      }).toThrowError("config.user is mandatory and it should be a knockout observable!");
    });

    it(" missing errorMessage", () => {
      let createLoginSurface = core({
        ko: ko
      });

      expect(() => {
        createLoginSurface({
          menu: ["stuff"],
          user: ko.observable({
            name: "user"
          })
        })
      }).toThrowError("config.errorMessage is mandatory and it should be a knockout observable!");
    });

    it(" wrong type of errorMessage", () => {
      let createLoginSurface = core({
        ko: ko
      });

      expect(() => {
        createLoginSurface({
          menu: ["stuff"],
          user: ko.observable({
            name: "user"
          }),
          errorMessage: "not an observable"
        })
      }).toThrowError("config.errorMessage is mandatory and it should be a knockout observable!");
    });

    it(" missing menu", () => {
      let createLoginSurface = core({
        ko: ko
      });

      expect(() => {
        createLoginSurface({
          user: ko.observable({
            name: "user"
          }),
          errorMessage: ko.observable(null)
        })
      }).toThrowError("config.menu is mandatory and it should be an array!");
    });

    it(" wrong type of menu", () => {
      let createLoginSurface = core({
        ko: ko
      });

      expect(() => {
        createLoginSurface({
          user: ko.observable({
            name: "user"
          }),
          errorMessage: ko.observable(null),
          menu: "not an array"
        })
      }).toThrowError("config.menu is mandatory and it should be an array!");
    });
  });

  describe(" Valid config", () => {
    let config = {
      user: ko.observable(null),
      errorMessage: ko.observable(null),
      menu: ["stuff"]
    };

    it(" interface check", () => {
      let createLoginSurface = core({
        ko: ko
      });

      let loginSurface = createLoginSurface(config);

      expect(typeof loginSurface.userInput).toBe("object");
      expect(typeof loginSurface.userInput.placeholder).toBe("string");
      expect(loginSurface.userInput.placeholder).toBe("User");
      expect(ko.isObservable(loginSurface.userInput.value)).toBe(true);
      expect(typeof loginSurface.passwordInput).toBe("object");
      expect(typeof loginSurface.passwordInput.placeholder).toBe("string");
      expect(loginSurface.passwordInput.placeholder).toBe("Password");
      expect(ko.isObservable(loginSurface.passwordInput.value)).toBe(true);
      expect(typeof loginSurface.loginButton).toBe("object");
      expect(typeof loginSurface.loginButton.label).toBe("string");
      expect(loginSurface.loginButton.label).toBe("Login");
      expect(typeof loginSurface.loginButton.click).toBe("function");
    });
  });
});
