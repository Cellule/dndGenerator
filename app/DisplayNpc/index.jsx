var React = require("react");
//var Link = require("react-router").Link;
var NpcData = require("./../components/NpcData");
var UserInput = require("./../components/UserInput");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");

var actions = require("./../actions");

export default class DisplayNpc extends React.Component {

  constructor(props) {
    super(props);
    this.state = {npc: null}

    this.generateNpc(this.props.query);
    this.generateNpc = this.generateNpc.bind(this);


  }

  generateNpc(options) {
    actions.Npc.generate(options, (err, res) => {
      if(err) {
        console.error(err);
      }
      this.setState({
        npc: res.body
      });
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={8} xsOffset={2}>
            <UserInput generate={this.generateNpc}/>
            <NpcData npc={this.state.npc} />
          </Col>
        </Row>
      </div>
    );
  }
}
