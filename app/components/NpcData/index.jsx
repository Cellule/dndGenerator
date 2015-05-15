var React = require("react");
var Panel = require("react-bootstrap/Panel");
var Row = require("react-bootstrap/Row");
var Grid = require("react-bootstrap/Grid");
var Col = require("react-bootstrap/Col");
var Table = require("react-bootstrap/Table");
var _ = require("lodash");

require("./index.less");

var abilityNames = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intellect",
  wis: "Wisdom",
  cha: "Charisma"
};


var NpcData = React.createClass({
  propTypes: {
    npc: React.PropTypes.shape({
      description: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        age: React.PropTypes.number.isRequired,
        gender: React.PropTypes.string.isRequired,
        race: React.PropTypes.string.isRequired,
        occupation: React.PropTypes.string.isRequired
      }).isRequired,
      physical: React.PropTypes.shape({
        hair: React.PropTypes.string.isRequired,
        eyes: React.PropTypes.string.isRequired,
        skin: React.PropTypes.string.isRequired,
        height: React.PropTypes.number.isRequired,
        build: React.PropTypes.string.isRequired,
        face: React.PropTypes.string.isRequired,
        special: React.PropTypes.string.isRequired
      }).isRequired,
      alignment: React.PropTypes.shape({
        good: React.PropTypes.number.isRequired,
        moralneutral: React.PropTypes.number.isRequired,
        evil: React.PropTypes.number.isRequired,
        lawful: React.PropTypes.number.isRequired,
        ethicalneutral: React.PropTypes.number.isRequired,
        chaotic: React.PropTypes.number.isRequired
      }).isRequired,
      relationship: React.PropTypes.shape({
        orientation: React.PropTypes.string.isRequired,
        status: React.PropTypes.string.isRequired
      }).isRequired,
      religion: React.PropTypes.shape({
        description: React.PropTypes.string.isRequired
      }).isRequired,
      ptraits: React.PropTypes.shape({
        traits1: React.PropTypes.string.isRequired,
        traits2: React.PropTypes.string.isRequired
      }).isRequired,
      pquirks: React.PropTypes.shape({
        description: React.PropTypes.string.isRequired
      }).isRequired,
      hook: React.PropTypes.shape({
        description: React.PropTypes.string.isRequired
      }).isRequired,
      abilities: React.PropTypes.shape({
        str: React.PropTypes.number.isRequired,
        dex: React.PropTypes.number.isRequired,
        con: React.PropTypes.number.isRequired,
        int: React.PropTypes.number.isRequired,
        wis: React.PropTypes.number.isRequired,
        cha: React.PropTypes.number.isRequired
      }).isRequired
    })
  },

  render() {
    if(!this.props.npc) {
      return <div>Loading npc...</div>;
    }

    var majP = this.props.npc.description.pronounCapit;
    var minP = this.props.npc.description.pronounMinus;

    return (
      <Grid className="npc-data" fluid>
        <Row>
          <Col xs={12} md={6}>
            <Panel className="first-row-height" header={<div>Description</div>}>
              <p>
                {this.props.npc.description.name} is a {this.props.npc.description.age + " "}
                years old {this.props.npc.description.gender} {this.props.npc.description.race + " "}
                {this.props.npc.description.occupation}.
              </p>
              <p>
                {majP} has {this.props.npc.physical.skin}.
              </p>
              <p>
                {majP} stands {this.props.npc.physical.height}cm tall and has a {this.props.npc.physical.build}.
              </p>
              <p>
                {majP} has {this.props.npc.physical.face}.
              </p>
              <p>
                {this.props.npc.physical.special}
              </p>
            </Panel>
          </Col>
          <Col xs={12} md={6}>
            <Panel className="first-row-height" header={<div>Personality Traits</div>}>
              <p>
                {this.props.npc.religion.description}
              </p>
              <p>{this.props.npc.ptraits.traits1}</p>
              <p>{this.props.npc.ptraits.traits2}</p>
              <p>{this.props.npc.pquirks}</p>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} lg={3}>
            <Panel className="second-row-height" header={<div>Ability Scores</div>}>
              <Row><table className="no-border">
                {
                  _.map(this.props.npc.abilities, (ability, key) => {
                    return (
                      <Col
                        key={key}
                        lg={12}
                        md={2}
                        xs={12}
                        className="no-right-pad no-left-pad ability"
                      >
                          <tr><td><b>{abilityNames[key]}</b></td><td>{ability}</td></tr>
                      </Col>
                    );
                  })
                }
              </table></Row>
            </Panel>
          </Col>
          <Col sm={12} md={6}>
            <Panel className="second-row-height" header={<div>Relationships</div>}>
              <p><b>Sexual Orientation: </b>{this.props.npc.relationship.orientation}</p>
              <p><b>Relationship Status: </b>{this.props.npc.relationship.status}</p>
            </Panel>
          </Col>
          <Col sm={12} md={12} lg={3}>
            <Panel className="second-row-height" header={<div>Alignment Tendencies</div>}>
              <table className="no-border">
                <tr>
                  <td className="width-thin"><b>Good</b></td><td>{this.props.npc.alignment.good}</td>
                  <td className="width-thin"><b>Lawful</b></td><td>{this.props.npc.alignment.lawful}</td>
                </tr>
                <tr>
                  <td className="width-thin"><b>Neutral</b></td><td>{this.props.npc.alignment.moralneutral}</td>
                  <td className="width-thin"><b>Neutral</b></td><td>{this.props.npc.alignment.ethicalneutral}</td>
                </tr>
                <tr>
                  <td className="width-thin"><b>Evil</b></td><td>{this.props.npc.alignment.evil}</td>
                  <td className="width-thin"><b>Chaotic</b></td><td>{this.props.npc.alignment.chaotic}</td>
                </tr>
              </table>
            </Panel>
          </Col>
        </Row>
        <Row>
            <Panel header={<div>Plot Hook</div>}>
              {this.props.npc.hook}
            </Panel>
        </Row>
      </Grid>
    );
  }
});

module.exports = NpcData;
