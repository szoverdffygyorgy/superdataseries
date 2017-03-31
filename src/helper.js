"use strict";

module.exports = (dependencies) => {
  dependencies = dependencies || {};

  if(!dependencies.promise) {
    throw new Error("dependencies.promise is mandatory!");
  }

  if(!dependencies.app) {
    throw new Error("dependencies.app is mandatory!");
  }

  const app = dependencies.app;
  const promise = dependencies.promise;
  const readFile = promise.denodeify(require("fs").readFile);

  let readContent = (filePath, callback) => {
    readFile(filePath, "utf-8").then((content) => {
      callback(null, content);
    }).catch((reason) => {
      return callback(reason);
    });
  };

  let setRoute = (route, path) => {
    app.get(route, (req, res) => {
      readContent(path, (err, content) => {
        if(err) {
          throw new Error(err);
        }

        res.send(content);
      });
    });
  };

  return {
    readContent: readContent,
    setRoute: setRoute
  }

};
