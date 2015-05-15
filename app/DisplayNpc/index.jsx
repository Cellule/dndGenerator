var React = require("react");
//var Link = require("react-router").Link;
var NpcData = require("./../components/NpcData");
var UserInput = require("./../components/UserInput");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");

var actions = require("./../actions");

require("./index.less");

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
          <Col
            xs={10}
            xsOffset={1}
            sm={3}
            smOffset={0}
            md={2}
            className="user-info-col"
          >
            <UserInput generate={this.generateNpc}/>
          </Col>
          <Col
            xs={10}
            xsOffset={1}
            sm={8}
            smOffset={3}
            md={8}
            mdOffset={0}
          >
            <NpcData npc={this.state.npc} />
          </Col>
        </Row>
      </div>
    );
  }
}
