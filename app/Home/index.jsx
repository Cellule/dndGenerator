var React = require("react");
//var Link = require("react-router").Link;
var NpcData = require("./../components/NpcData");
var npcData = require("./../mockData/npcData.json5");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");

var Home = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Homepage</h2>
        <Row>
          <Col xs={8} xsOffset={2}>
            <NpcData {...npcData} />
          </Col>
        </Row>
      </div>
    );
  }
});

module.exports = Home;
