module.exports = function addControllers(app, options) {
  require("./list")(app, options);
  require("./todo")(app, options);
  require("./generator")(app, options);

  // Serves the html file, must be last
  require("./bundle")(app, options);
};
