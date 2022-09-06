import jsoncrush from "jsoncrush";
import { Component } from "react";
import { Col, Row } from "react-bootstrap";
import Footer from "./Footer";
import NpcData from "./NpcData";
import { generate, printDebugGen } from "./npcData/generate";
import { Npc, NpcGenerateOptions } from "./npcData/index";
import UserInput from "./UserInput";

interface IState {
  npc: Npc;
}

export default class DisplayNpc extends Component<{}, IState> {
  constructor(props: any) {
    super(props);

    // Check url query for npc data
    let loadedQueryData = false;
    const url = new URL(window.location.href);
    if (url.searchParams.has("d")) {
      try {
        const crushedJson = url.searchParams.get("d") || "";
        const npc = JSON.parse(jsoncrush.uncrush(decodeURIComponent(crushedJson)));
        this.state = { npc };
        loadedQueryData = true;
      } catch (e) {
        console.error(e);
        loadedQueryData = false;
      }
    }

    // Generate initial npc, if we didn't load data from url query
    if (!loadedQueryData) {
      const { npc, debugNode } = generate({});
      printDebugGen(debugNode);
      this.state = { npc };
    }

    this.generateNpc = this.generateNpc.bind(this);
  }

  generateNpc(options: NpcGenerateOptions) {
    const { npc, debugNode } = generate(options);
    printDebugGen(debugNode);
    this.setState({ npc });
  }

  render() {
    return (
      <>
        <div className="display-npc-root">
          <Row>
            <Col sm={12} md={4} lg={3} className="user-info-col">
              <div className="user-info">
                <div className="title-image-wrapper">
                  <div className="title-image" />
                </div>
                <UserInput npc={this.state.npc} generate={this.generateNpc} />
              </div>
            </Col>
            <Col sm={12} md={7} lg={9}>
              <NpcData npc={this.state.npc} />
              <Footer />
            </Col>
          </Row>
        </div>
        <div className="printing">
          <h1 className="print-title">{this.state.npc.description.name}</h1>
          <NpcData npc={this.state.npc} />
        </div>
      </>
    );
  }
}
