import { JSONUncrush } from 'jsoncrush';
import React, { Component } from 'react';
import { Col, Row } from "react-bootstrap";
import Footer from "./Footer";
import UserInput from "./UserInput";
import NpcData from "./NpcData";
import { generate, printDebugGen } from "./npcData/generate";
import { NpcGenerateOptions, Npc } from './npcData/index';

import "./DisplayNpc.less"

interface IState {
  npc: Npc
}

export default class DisplayNpc extends Component<{}, IState> {
  constructor(props: any) {
    super(props);

    // Check url query for npc data
    let loadedQueryData = false;
    const url = new URL(window.location.href);
    if (url.searchParams.has('d')) {
      try {
        const crushedJson = url.searchParams.get('d') || '';
        const npc = JSON.parse(JSONUncrush(decodeURIComponent(crushedJson)));
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
      <div>
        <Row>
          <Col
            xs={12}
            xsOffset={0}
            sm={4}
            smOffset={0}
            md={3}
            mdOffset={0}
            className="user-info-col top-padding options-panel"
          >
            <div>
              <div className="title-image"></div>
            </div>
            <UserInput npc={this.state.npc} generate={this.generateNpc} />
          </Col>
          <Col
            xs={12}
            xsOffset={0}
            sm={7}
            smOffset={0}
            md={9}
            mdOffset={0}
            className="top-padding"
          >
            <NpcData npc={this.state.npc} />
            <Footer />
          </Col>
        </Row>
      </div>
    );
  }
}
