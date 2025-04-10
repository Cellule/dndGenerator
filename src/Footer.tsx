// Code taken from https://github.com/react-bootstrap/react-bootstrap/tree/master/docs
import { Component } from "react";
import packageJSON from "../package.json";

export default class PageFooter extends Component {
	render() {
		return (
			<footer className="bs-docs-footer" role="contentinfo">
				<div className="bs-docs-footer-links muted">
					DnD NPC Generator - <a href="https://github.com/dev-chenxing/dndGenerator/">dev-chenxing</a> Fork v{packageJSON.version}
				</div>
			</footer>
		);
	}
}
