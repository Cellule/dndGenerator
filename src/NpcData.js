import React, {Component} from "react";
import {Panel, Row, Col } from "react-bootstrap";
import PropTypes from 'prop-types';

require("./NpcData.less");

var abilityNames = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intellect",
  wis: "Wisdom",
  cha: "Charisma"
};

function toFeet(n) {
  var realFeet = ((n*0.393700) / 12);
  var feet = Math.floor(realFeet);
  var inches = Math.floor((realFeet - feet) * 12);
  return feet + "'" + inches + '"';
}

export default class NpcData extends Component {
  static propTypes = {
    npc: PropTypes.shape({
      description: PropTypes.shape({
        name: PropTypes.string.isRequired,
        kenkuname: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        gender: PropTypes.string.isRequired,
        race: PropTypes.string.isRequired,
        occupation: PropTypes.string.isRequired
      }).isRequired,
      physical: PropTypes.shape({
        hair: PropTypes.string.isRequired,
        eyes: PropTypes.string.isRequired,
        skin: PropTypes.string.isRequired,
        height: PropTypes.number.isRequired,
        build: PropTypes.string.isRequired,
        face: PropTypes.string.isRequired,
        special1: PropTypes.string.isRequired,
        special2: PropTypes.string.isRequired,
      }).isRequired,
      alignment: PropTypes.shape({
        good: PropTypes.number.isRequired,
        moralneutral: PropTypes.number.isRequired,
        evil: PropTypes.number.isRequired,
        lawful: PropTypes.number.isRequired,
        ethicalneutral: PropTypes.number.isRequired,
        chaotic: PropTypes.number.isRequired
      }).isRequired,
      relationship: PropTypes.shape({
        orientation: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired
      }).isRequired,
      religion: PropTypes.shape({
        description: PropTypes.string.isRequired
      }).isRequired,
      ptraits: PropTypes.shape({
        traitslizards: PropTypes.string.isRequired,
        traitsgoliaths: PropTypes.string.isRequired,
        traits1: PropTypes.string.isRequired,
        traits2: PropTypes.string.isRequired
      }).isRequired,
      pquirks: PropTypes.shape({
        description: PropTypes.string.isRequired
      }).isRequired,
      hook: PropTypes.shape({
        description: PropTypes.string.isRequired
      }).isRequired,
      abilities: PropTypes.shape({
        str: PropTypes.number.isRequired,
        dex: PropTypes.number.isRequired,
        con: PropTypes.number.isRequired,
        int: PropTypes.number.isRequired,
        wis: PropTypes.number.isRequired,
        cha: PropTypes.number.isRequired
      }).isRequired
    })
  }

  render() {
    if(!this.props.npc) {
      return <div>Loading npc...</div>;
    }

    var majP = this.props.npc.description.pronounCapit;
    //var minP = this.props.npc.description.pronounMinus;
    var quirksArray = this.props.npc.pquirks.description.split(".");
    quirksArray.length--;

    if (this.props.npc.description.race === "lizardman" || this.props.npc.description.race === "lizardwoman")
    {
      this.props.npc.ptraits.traits1 = this.props.npc.ptraits.traitslizards;
    }
    if (this.props.npc.description.race === "goliath")
    {
      this.props.npc.ptraits.traits1 = this.props.npc.ptraits.traitsgoliaths;
    }
    if (this.props.npc.description.race === "kenku")
    {
      this.props.npc.description.name = this.props.npc.description.kenkuname;
    }

    var specialPhysical1 = "";
    if (this.props.npc.physical.special1 !== "")
    {
      specialPhysical1 = <div><p hidden>#</p><p>{this.props.npc.physical.special1}</p></div>;
    }
    var specialPhysical2 = "";
    if (this.props.npc.physical.special2 !== "")
    {
      specialPhysical2 = <div><p hidden>#</p><p>{this.props.npc.physical.special2}</p></div>;
    }

    return (
      <div className="npc-data" id="downloadData">
        <Row>
          <Col xs={12} md={6}>
            <Panel className="first-row-height">
              <Panel.Heading>Description</Panel.Heading>
              <Panel.Body>
              <p hidden>#</p>
              <p>
                {this.props.npc.description.name} is a {this.props.npc.description.age + " "}
                years old {this.props.npc.description.gender} {this.props.npc.description.race + " "}
                {this.props.npc.description.occupation}.
              </p>
              <p hidden>#</p>
              <p>
                {majP}has {this.props.npc.physical.hair}{this.props.npc.physical.eyes}.
              </p>
              <p hidden>#</p>
              <p>
                {majP}has {this.props.npc.physical.skin}.
              </p>
              <p hidden>#</p>
              <p>
                {majP}stands {this.props.npc.physical.height}cm ({toFeet(this.props.npc.physical.height)}) tall and has {this.props.npc.physical.build}.
              </p>
              <p hidden>#</p>
              <p>
                {majP}has {this.props.npc.physical.face}.
              </p>
              <p hidden>#</p>
              {specialPhysical1}
              {specialPhysical2}
              <p hidden>#</p>
              <p hidden>#</p>
            </Panel.Body>
            </Panel>
          </Col>
          <Col xs={12} md={6}>
            <Panel className="first-row-height">
              <Panel.Heading>Personality Traits</Panel.Heading>
              <Panel.Body>
              <p hidden>#</p>
              <p>
                {this.props.npc.religion.description}
              </p>
              <p hidden>#</p>
              <p>{this.props.npc.ptraits.traits1}</p>
              <p hidden>#</p>
              <p>{this.props.npc.ptraits.traits2}</p>
                 {
                   quirksArray.map(value => <p key={value}>{value}.</p>)
                 }
                 <p hidden>#</p>
                 <p hidden>#</p>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} lg={4}>
            <Panel className="second-row-height">
              <Panel.Heading>Ability Scores</Panel.Heading>
              <Panel.Body>
              <p hidden>#</p>
              <Row>
                <Col
                  lg={12}
                  md={2}
                  xs={12}
                  className="no-right-pad no-left-pad ability"
                >
                  <table className="ability-table">
                    <tbody>
                    {
                      Object.keys(this.props.npc.abilities).map(key => {
                        const ability = this.props.npc.abilities[key];
                        return (
                            <tr key={key}><td><b>{abilityNames[key]}</b><p hidden> - </p></td><td className="ability-number">{Math.max(3, ability)}<p hidden>#</p></td></tr>
                            );
                          })
                        }
                    </tbody>
                  </table>
                </Col>
              </Row>
              <p hidden>#</p>
              </Panel.Body>
            </Panel>
          </Col>
          <Col sm={12} md={6} lg={4}>
            <Panel className="second-row-height">
              <Panel.Heading>Relationships</Panel.Heading>
              <Panel.Body>
              <p hidden>#</p>
              <p><b>Sexual Orientation </b></p><p hidden>- </p><p>{this.props.npc.relationship.orientation}</p>
              <p hidden>#</p>
              <p><b>Relationship Status </b></p><p hidden>- </p><p>{this.props.npc.relationship.status}</p>
              <p hidden>#</p>
              <p hidden>#</p>
              </Panel.Body>
            </Panel>
          </Col>
          <Col sm={12} md={12} lg={4}>
            <Panel className="second-row-height">
              <Panel.Heading>Alignment Tendencies</Panel.Heading>
              <Panel.Body>
              <p hidden>#</p>
              <table className="alignment-table">
              <tbody>
                <tr>
                  <td className="width-thin"><b>Good</b></td><td hidden>:    </td><td className="alignment-number">{Math.max(0, this.props.npc.alignment.good)}</td>
                  <td hidden>  </td>
                  <td className="width-thin"><b>Lawful</b></td><td hidden>:  </td><td className="alignment-number">{Math.max(0, this.props.npc.alignment.lawful)}</td>
                </tr>
                <tr hidden><td>#</td></tr>
                <tr>
                  <td className="width-thin"><b>Neutral</b></td><td hidden>: </td><td className="alignment-number">{Math.max(0, this.props.npc.alignment.moralneutral)}</td>
                  <td hidden>  </td>
                  <td className="width-thin"><b>Neutral</b></td><td hidden>: </td><td className="alignment-number">{Math.max(0, this.props.npc.alignment.ethicalneutral)}</td>
                </tr>
                <tr hidden><td>#</td></tr>
                <tr>
                  <td className="width-thin"><b>Evil</b></td><td hidden>:    </td><td className="alignment-number">{Math.max(0, this.props.npc.alignment.evil)}</td>
                  <td hidden>  </td>
                  <td className="width-thin"><b>Chaotic</b></td><td hidden>: </td><td className="alignment-number">{Math.max(0, this.props.npc.alignment.chaotic)}</td>
                </tr>
              </tbody>
              </table>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <p hidden>#</p>
        <p hidden>#</p>
        <Row>
          <Col xs={12}>
            <Panel className="align-center">
            <Panel.Heading>Plot Hook</Panel.Heading>
            <Panel.Body>
              <p hidden>#</p>
              {this.props.npc.hook.description}
              <p hidden>#</p>
              <p hidden>#</p>
            </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}
