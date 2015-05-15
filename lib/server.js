require("../requireHooks");

module.exports = function(options) {
  // Allow only here to modify these global variables
  /* global __DEV__:true */
  /* global __PROD__:true */
  __DEV__ = options.dev;
  __PROD__ = !options.dev;

  var express = require("express");
  var bodyParser = require("body-parser");
  var path = require("path");

  var app = express();
  // serve the static assets
  app.use(
    "/_assets",
    express.static(
      path.join(__dirname, "..", "build", "public"),
      {
        maxAge: "200d" // We can cache them as they include hashes
      }
    )
  );
  app.use("/", express.static(path.join(__dirname, "..", "public"), {
  }));
  app.use(bodyParser.json());
  // REST APIs
  // Note that there is no security in this example
  // Make sure your production server handles requests better!

  // application
  require("./controllers")(app, options);

  var port = process.env.PORT || options.defaultPort || 8080;
  app.listen(port, function() {
    console.log("Server listening on port " + port);
  });
};
