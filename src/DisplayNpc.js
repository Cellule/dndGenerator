import React, { Component } from 'react';
import {Col, Row} from "react-bootstrap";
import Footer from "./Footer";
import UserInput from "./UserInput";
import NpcData from "./NpcData";
import {generate} from "./npcData/generate";

import "./DisplayNpc.less"

export default class DisplayNpc extends Component {
  constructor(props) {
    super(props);
    this.state = {npc: null}

    this.generateNpc(this.props.query);
    this.generateNpc = this.generateNpc.bind(this);
  }

  generateNpc(options) {
    const npc = generate(options);
    setTimeout(() => this.setState({npc}));
    //actions.Npc.generate(options, (err, res) => {
    //  if(err) {
    //    console.error(err);
    //  }
    //});
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
            <UserInput npc={this.state.npc} generate={this.generateNpc}/>
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
