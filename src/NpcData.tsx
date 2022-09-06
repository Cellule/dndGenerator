import { Component } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Npc, NpcAbilities } from "./npcData/index";

const abilities: { key: keyof NpcAbilities; name: string }[] = [
  { key: "str", name: "Strength" },
  { key: "dex", name: "Dexterity" },
  { key: "con", name: "Constitution" },
  { key: "int", name: "Intellect" },
  { key: "wis", name: "Wisdom" },
  { key: "cha", name: "Charisma" },
];

function toFeet(n: number) {
  const realFeet = (n * 0.3937) / 12;
  const feet = Math.floor(realFeet);
  const inches = Math.floor((realFeet - feet) * 12);
  return feet + "'" + inches + '"';
}

function renderAbility(abilityBase: number) {
  const ability = Math.max(3, abilityBase);
  // Info on modifiers
  // https://dnd5e.info/using-ability-scores/ability-scores-and-modifiers/
  const modifier = Math.floor((ability - 10) / 2);
  return `${ability} [${modifier <= 0 ? modifier : `+${modifier}`}]`;
}

interface IProps {
  npc: Npc | null;
}

export default class NpcData extends Component<IProps> {
  render() {
    const { npc } = this.props;
    if (!npc) {
      return <div>Loading npc...</div>;
    }

    const majP = npc.description.pronounCapit;
    //const minP = npc.description.pronounMinus;
    const quirksArray = npc.pquirks.description.split(".");
    quirksArray.length--;

    if (npc.description.race === "lizardman" || npc.description.race === "lizardwoman") {
      npc.ptraits.traits1 = npc.ptraits.traitslizards;
    }
    if (npc.description.race === "goliath") {
      npc.ptraits.traits1 = npc.ptraits.traitsgoliaths;
    }
    if (npc.description.race === "kenku") {
      npc.description.name = npc.description.kenkuname;
    }

    const specialPhysical1 =
      npc.physical.special1 !== "" ? (
        <div>
          <p hidden>#</p>
          <p>{npc.physical.special1}</p>
        </div>
      ) : null;
    const specialPhysical2 =
      npc.physical.special2 !== "" ? (
        <div>
          <p hidden>#</p>
          <p>{npc.physical.special2}</p>
        </div>
      ) : null;

    return (
      <div className="npc-data" id="downloadData">
        <Row>
          <Col sm={12} lg={6} className="col-print-6">
            <Card className="first-row-height">
              <Card.Header>Description</Card.Header>
              <Card.Body>
                <p hidden>#</p>
                <p>
                  {npc.description.name} is a {npc.description.age + " "}
                  year old {npc.description.gender} {npc.description.race + " "}
                  {npc.description.occupation}.
                </p>
                <p hidden>#</p>
                <p>
                  {majP}has {npc.physical.hair}
                  {npc.physical.eyes}.
                </p>
                <p hidden>#</p>
                <p>
                  {majP}has {npc.physical.skin}.
                </p>
                <p hidden>#</p>
                <p>
                  {majP}stands {npc.physical.height}cm ({toFeet(npc.physical.height)}) tall and has {npc.physical.build}.
                </p>
                <p hidden>#</p>
                <p>
                  {majP}has {npc.physical.face}.
                </p>
                <p hidden>#</p>
                {specialPhysical1}
                {specialPhysical2}
                <p hidden>#</p>
                <p hidden>#</p>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} lg={6} className="col-print-6">
            <Card className="first-row-height">
              <Card.Header>Personality Traits</Card.Header>
              <Card.Body>
                <p hidden>#</p>
                <p>{npc.religion.description}</p>
                <p hidden>#</p>
                <p>{npc.ptraits.traits1}</p>
                <p hidden>#</p>
                <p>{npc.ptraits.traits2}</p>
                {quirksArray.map((value) => (
                  <p key={value}>{value}.</p>
                ))}
                <p hidden>#</p>
                <p hidden>#</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={6} xl={4} className="col-print-4">
            <Card className="second-row-height">
              <Card.Header>Ability Scores</Card.Header>
              <Card.Body>
                <p hidden>#</p>
                <table className="ability-table">
                  <tbody>
                    {abilities.map(({ key, name }) => {
                      const ability = npc.abilities[key];
                      return (
                        <tr key={key}>
                          <td>
                            <b>{name}</b>
                            <p hidden> - </p>
                          </td>
                          <td className="ability-number">
                            {renderAbility(ability)}
                            <p hidden>#</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p hidden>#</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} lg={6} xl={4} className="col-print-4">
            <Card className="second-row-height">
              <Card.Header>Relationships</Card.Header>
              <Card.Body>
                <p hidden>#</p>
                <p>
                  <b>Sexual Orientation </b>
                </p>
                <p hidden>- </p>
                <p>{npc.relationship.orientation}</p>
                <p hidden>#</p>
                <p>
                  <b>Relationship Status </b>
                </p>
                <p hidden>- </p>
                <p>{npc.relationship.status}</p>
                <p hidden>#</p>
                <p hidden>#</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} lg={12} xl={4} className="col-print-4">
            <Card className="second-row-height">
              <Card.Header>Alignment Tendencies</Card.Header>
              <Card.Body>
                <p hidden>#</p>
                <table className="alignment-table">
                  <tbody>
                    <tr>
                      <td className="width-thin">
                        <b>Good</b>
                      </td>
                      <td hidden>: </td>
                      <td className="alignment-number">{Math.max(0, npc.alignment.good)}</td>
                      <td hidden> </td>
                      <td className="width-thin">
                        <b>Lawful</b>
                      </td>
                      <td hidden>: </td>
                      <td className="alignment-number">{Math.max(0, npc.alignment.lawful)}</td>
                    </tr>
                    <tr hidden>
                      <td>#</td>
                    </tr>
                    <tr>
                      <td className="width-thin">
                        <b>Neutral</b>
                      </td>
                      <td hidden>: </td>
                      <td className="alignment-number">{Math.max(0, npc.alignment.moralneutral)}</td>
                      <td hidden> </td>
                      <td className="width-thin">
                        <b>Neutral</b>
                      </td>
                      <td hidden>: </td>
                      <td className="alignment-number">{Math.max(0, npc.alignment.ethicalneutral)}</td>
                    </tr>
                    <tr hidden>
                      <td>#</td>
                    </tr>
                    <tr>
                      <td className="width-thin">
                        <b>Evil</b>
                      </td>
                      <td hidden>: </td>
                      <td className="alignment-number">{Math.max(0, npc.alignment.evil)}</td>
                      <td hidden> </td>
                      <td className="width-thin">
                        <b>Chaotic</b>
                      </td>
                      <td hidden>: </td>
                      <td className="alignment-number">{Math.max(0, npc.alignment.chaotic)}</td>
                    </tr>
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <p hidden>#</p>
        <p hidden>#</p>
        <Row>
          <Col sm={12}>
            <Card className="align-center">
              <Card.Header>Plot Hook</Card.Header>
              <Card.Body>
                <p hidden>#</p>
                {npc.hook.description}
                <p hidden>#</p>
                <p hidden>#</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
