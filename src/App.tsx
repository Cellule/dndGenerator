import React, { Component } from "react";
import { Container } from "react-bootstrap";
import DisplayNpc from "./DisplayNpc";
import "./styles/custom-bootstrap.scss";
import "./styles/custom-other.less";
import "./styles/index.module.css";

export default class App extends Component {
  render() {
    return (
      <Container>
        <DisplayNpc />
      </Container>
    );
  }
}
