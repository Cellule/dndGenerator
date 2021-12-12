import React, { Component } from "react";
import { Container } from "react-bootstrap";
import DisplayNpc from "./DisplayNpc";
import "./styles/main.scss";

export default class App extends Component {
  render() {
    return (
      <Container>
        <DisplayNpc />
      </Container>
    );
  }
}
