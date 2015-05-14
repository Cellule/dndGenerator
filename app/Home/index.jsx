var React = require("react");
var Link = require("react-router").Link;
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Homepage</h2>
        <Row>
          <Col xs={8} xsOffset={2}>
            <Link to="npc">
              Generate random npc
            </Link>
          </Col>
        </Row>
      </div>
    );
  }
}

module.exports = Home;
