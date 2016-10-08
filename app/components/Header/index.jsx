import React from "react";
import BSPageHeader from "react-bootstrap/PageHeader";

require("./index.less");

export default class PageHeader extends React.Component {
  render() {
    return (
      <div>
        <BSPageHeader>NPC Generator <small>&emsp;D&D 5e</small></BSPageHeader>
      </div>
    );
  }
}
