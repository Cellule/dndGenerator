// Code taken from https://github.com/react-bootstrap/react-bootstrap/tree/master/docs
import React, { Component } from "react";
import packageJSON from "../package.json";

import "./Footer.less";

export default class PageFooter extends Component {
  render() {
    return (
      <footer className="bs-docs-footer" role="contentinfo">
        <ul className="bs-docs-social-buttons">
          <li>
            <div>
              <p className="footer-outline"><b>Check out my video game!</b></p>
              <a href="http://store.steampowered.com/app/769410/Electromaze_Tower_Defense/" target="_blank" rel="noopener noreferrer"><div className="center-block EMD-button" /></a>
            </div>
          </li>
          <li>
            <div>
              <p className="footer-outline"><b>Download my new Android RPG!</b></p>
              <a href="https://play.google.com/store/apps/details?id=com.BaronnerieGames.Guildmasters" target="_blank" rel="noopener noreferrer"><div className="center-block GM-button" /></a>
            </div>
          </li>
        </ul>
        <div>
          <p className="footer-outline"><b> Comments, suggestions, crazy hook or trait idea? </b></p>
          <p> Email me at: <a href="mailto:etienspb@gmail.com">EtiensPB@gmail.com</a>!</p>
        </div>
        <div className="bs-docs-social">
          <ul className="bs-docs-social-buttons">
            <li>
              <iframe className="github-btn"
                src="https://ghbtns.com/github-btn.html?user=cellule&repo=dndGenerator&type=watch&count=true"
                width={95}
                height={20}
                title="Star on GitHub" />
            </li>
            <li>
              <iframe className="github-btn"
                src="https://ghbtns.com/github-btn.html?user=cellule&repo=dndGenerator&type=fork&count=true"
                width={92}
                height={20}
                title="Fork on GitHub" />
            </li>
          </ul>
        </div>
        <p>Code licensed under <a href="https://github.com/cellule/dndGenerator/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">MIT</a>.</p>
        <ul className="bs-docs-footer-links muted">
          <li>Currently v{packageJSON.version}</li>
          <li>·</li>
          <li><a href="https://github.com/cellule/dndGenerator/">GitHub</a></li>
          <li>·</li>
          <li><a href="https://github.com/cellule/dndGenerator/issues?state=open">Issues</a></li>
          <li>·</li>
          <li><a href="https://github.com/cellule/dndGenerator/releases">Releases</a></li>
        </ul>
      </footer>
    );
  }
};

