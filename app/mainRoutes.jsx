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
    <Route
      name="some-page"
      path="/some-page"
      handler={require("react-proxy!./SomePage")}
    />
    <Route
      name="todolist"
      path="/list/:list"
      handler={require("./TodoList")}
    />
    <Route
      name="todoitem"
      path="/todo/:item"
      handler={require("./TodoItem")}
    />
    <Route
      name="npc"
      path="/npc"
      handler={require("./DisplayNpc")}
    />
    <DefaultRoute name="home" handler={require("./Home")} />
  </Route>
);
