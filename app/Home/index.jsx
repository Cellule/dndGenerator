var React = require("react");
//var Link = require("react-router").Link;
var NpcData = require("./../components/NpcData");
var npcData = require("./../mockData/npcData.json5");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");
var actions = require("./../actions");

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {npc: null}

    this.generateNpc((err, res) => {
      if(err) {
        console.error(err);
      }
      this.setState({
        npc: res.body
      });
    });
  }

  generateNpc(callback) {
    actions.Npc.generate({}, callback);
  }

  render() {
    return (
      <div>
        <h2>Homepage</h2>
        <Row>
          <Col xs={8} xsOffset={2}>
            <NpcData npc={this.state.npc} />
          </Col>
        </Row>
      </div>
    );
  }
}

module.exports = Home;
