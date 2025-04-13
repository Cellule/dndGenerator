import { Component } from "react";
import styles from "./App.module.css";
import DisplayNpc from "./DisplayNpc";

export default class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <main className={styles.main}>
          <div className={styles.container}>
            <DisplayNpc />
          </div>
        </main>
      </div>
    );
  }
}
