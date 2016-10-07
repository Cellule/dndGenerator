import React from "react";
import BSPageHeader from "react-bootstrap/PageHeader";

require("./index.less");

export default class PageHeader extends React.Component {
  render() {
    return (
      <div>
        <BSPageHeader>NPC Generator <small>dungeon master's assistant</small></BSPageHeader>
      </div>
    );
  }
}
