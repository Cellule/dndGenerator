var React = require("react");
var StateFromStoreMixin = require("items-store/StateFromStoresMixin");
var RouteHandler = require("react-router").RouteHandler;
var Footer = require("./../components/Footer");
var Header = require("./../components/Header");
import Grid from "react-bootstrap/Grid";

// Styles
require("../styles/index.less");

if(__DEV__) {
  require("react-a11y")(React);
}

var Application = React.createClass({
  mixins: [StateFromStoreMixin],
  statics: {
    getState: function(stores) {
      var transition = stores.Router.getItem("transition");
      return {
        loading: !!transition
      };
    }
  },
  render: function() {
    return (
      <Grid
        className={ this.state.loading ? "application loading" : "application"}
      >
        {
          this.state.loading ?
            <div style={{float: "right"}}>loading...</div>
            : null
        }
        <Header />
        <RouteHandler />
        <Footer />
      </Grid>
    );
  },
  update: function() {
    var { stores } = this.context;
    Object.keys(stores).forEach(function(key) {
      stores[key].update();
    });
  }
});
module.exports = Application;
