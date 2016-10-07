var React = require("react");
var Router = require("react-router");
/*eslint no-unused-vars:0*/
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

// polyfill
if(!Object.assign) {
  Object.assign = React.__spread;
}

// export routes
/*eslint react/react-in-jsx-scope:0, no-undef:0*/
module.exports = (
  <Route name="app" path="/" handler={require("./Application")}>
    <DefaultRoute
      name="npc"
      handler={require("./DisplayNpc")}
    />
  </Route>
);
