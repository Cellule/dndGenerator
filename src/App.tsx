import React, { Component } from 'react';
import { Container } from "react-bootstrap";
import DisplayNpc from "./DisplayNpc";

import "./styles/index.module.css";
import "./styles/custom-other.less";
import "./styles/custom-bootstrap.scss";

export default class App extends Component {
  render() {
    return (
      <Container>
        <DisplayNpc />
      </Container>
    );
  }
}

