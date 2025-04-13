import { Component } from "react";
import packageJSON from "../package.json";
import styles from "./Footer.module.css";

export default class PageFooter extends Component {
  render() {
    return (
      <footer className={styles.footer} role="contentinfo">
        <ul className={styles.socialButtons}>
          <li className={styles.socialItem}>
            <div>
              <p className={styles.footerOutline}>
                <b>Check out my latest video game!</b>
              </p>
              <a href="https://www.baronneriegames.com/breach-wanderers" target="_blank" rel="noopener noreferrer">
                <div className={styles.gameButton} />
              </a>
            </div>
          </li>
        </ul>
        <div>
          <p className={styles.footerOutline}>
            <b> Comments, suggestions, crazy hook or trait idea? </b>
          </p>
          <p>
            Email me at: <a href="mailto:etienspb@gmail.com">EtiensPB@gmail.com</a>!
          </p>
        </div>
        <div className={styles.social}>
          <ul className={styles.socialButtons}>
            <li>
              <iframe
                className={styles.githubButton}
                src="https://ghbtns.com/github-btn.html?user=cellule&repo=dndGenerator&type=watch&count=true"
                width={95}
                height={20}
                title="Star on GitHub"
              />
            </li>
            <li>
              <iframe
                className={styles.githubButton}
                src="https://ghbtns.com/github-btn.html?user=cellule&repo=dndGenerator&type=fork&count=true"
                width={92}
                height={20}
                title="Fork on GitHub"
              />
            </li>
          </ul>
        </div>
        <p>
          Code licensed under{" "}
          <a href="https://github.com/cellule/dndGenerator/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">
            MIT
          </a>
          .
        </p>
        <ul className={styles.footerLinks}>
          <li>Currently v{packageJSON.version}</li>
          <li>
            <a href="https://github.com/cellule/dndGenerator/">GitHub</a>
          </li>
          <li>
            <a href="https://github.com/cellule/dndGenerator/issues?state=open">Issues</a>
          </li>
          <li>
            <a href="https://github.com/cellule/dndGenerator/releases">Releases</a>
          </li>
        </ul>
        <Icons8Disclaimer />
      </footer>
    );
  }
}

function Icons8Disclaimer() {
  return (
    <div className={styles.iconsDisclaimer}>
      <a target="_blank" href={`https://icons8.com/icon/aFoL19SWLxKa/npc`} rel="noreferrer">
        Npc
      </a>{" "}
      icon by{" "}
      <a target="_blank" href="https://icons8.com" rel="noreferrer">
        Icons8
      </a>
    </div>
  );
}
