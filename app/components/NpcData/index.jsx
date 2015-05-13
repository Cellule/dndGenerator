var React = require("react");
var Panel = require("react-bootstrap/Panel");
var Row = require("react-bootstrap/Row");
var Grid = require("react-bootstrap/Grid");
var Col = require("react-bootstrap/Col");
var _ = require("lodash");

require("./index.less");

var abilityNames = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intellect",
  wis: "Wisdom",
  cha: "Charism"
};

var NpcData = React.createClass({
  propTypes: {
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
  },

  render() {

    return (
      <Grid className="npc-data" fluid>
        <Row>
          <Col xs={12}>
            <Panel header={this.props.description.name}>
              <ul>
                <li>Age: {this.props.description.age}</li>
                <li>Gender: {this.props.description.gender}</li>
                <li>Race: {this.props.description.race}</li>
                <li>Occupation: {this.props.description.occupation}</li>
              </ul>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={2} md={12}>
            <Panel header="Abilities">
              <Row>
                {
                  _.map(this.props.abilities, (ability, key) => {
                    return (
                      <Col
                        key={key}
                        lg={12}
                        md={2}
                        xs={12}
                        className="no-right-pad no-left-pad ability"
                      >
                        <Panel>
                          <p><b>{abilityNames[key]}</b></p>
                          <p>{ability}</p>
                        </Panel>
                      </Col>
                    );
                  })
                }
              </Row>
            </Panel>
          </Col>
          <Col lg={6} md={12}>
            <Panel header="Physical">
              {this.props.physical}
            </Panel>
          </Col>
          <Col lg={4} md={12}>
            <Panel header="Others">
              {_(this.props)
                .omit(["description", "physical", "abilities"])
                .map((elem, key) => {
                  return [<h3>{key}</h3>, <p>{elem}</p>];
                })
                .value()
              }
            </Panel>
          </Col>
        </Row>
        <Row>
            <Panel header="">
            </Panel>
        </Row>
      </Grid>
    );
  }
});

module.exports = NpcData;
