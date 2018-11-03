import {Panel, Col, Row} from "react-bootstrap";
import Input from "./Input";
import React from "react";
import PropTypes from 'prop-types';

/* eslint-disable import/no-webpack-loader-syntax */

var races = require("json5-loader!./npcData/tables/race.json5");
var genders = require("json5-loader!./npcData/tables/gender.json5");
var alignments = require("json5-loader!./npcData/tables/forcealign.json5");
var plothooks = require("json5-loader!./npcData/tables/hooks.json5");

var classes = require("json5-loader!./npcData/tables/class.json5");
var professions = require("json5-loader!./npcData/tables/profession.json5");

var professionCategories = {
  "learned": require("json5-loader!./npcData/tables/learned.json5"),
  "lesserNobility": require("json5-loader!./npcData/tables/lesserNobility.json5"),
  "professional": require("json5-loader!./npcData/tables/professional.json5"),
  "workClass": require("json5-loader!./npcData/tables/workClass.json5"),
  "martial": require("json5-loader!./npcData/tables/martial.json5"),
  "underclass": require("json5-loader!./npcData/tables/underclass.json5"),
  "entertainer": require("json5-loader!./npcData/tables/entertainer.json5"),
};

var userOptions = [
  {
    label: "Race",
    optionName: "race",
    options: races
  },
  {
    label: "Sex",
    optionName: "gender",
    options: genders
  },
  {
    label: "Alignment",
    optionName: "alignment",
    options: alignments
  },
  {
    label: "Plot Hooks",
    optionName: "plothook",
    options: plothooks
  },
  {
    label: "Occupation",
    optionName: "classorprof",
    options: [{name: "Class"}, {name: "Profession"}],
    onChange: (component) => {
      var npcOptions = component.state.npcOptions;
      npcOptions.occupation1 = null;
      npcOptions.occupation2 = null;
      component.setState({npcOptions});
    }
  },
  {
    label: "Class",
    optionName: "occupation1",
    condition: (npcOptions) => npcOptions.classorprof === 0,
    options: classes
  },
  {
    label: "Social Class",
    optionName: "occupation1",
    condition: (npcOptions) => npcOptions.classorprof === 1,
    options: professions,
    onChange: (component) => {
      var npcOptions = component.state.npcOptions;
      npcOptions.occupation2 = null;
      component.setState({npcOptions});
    }
  },
  {
    label: "Profession",
    optionName: "occupation2",
    condition: (npcOptions) => (npcOptions.classorprof === 1 && typeof npcOptions.occupation1 === "number"),
    options: (npcOptions) => professionCategories[professions[npcOptions.occupation1].table]
  },
];

export default class UserInput extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      npcOptions: {}
    };
  }

  onSubmit(e){
    e.preventDefault();
    this.props.generate(this.state.npcOptions);
  }

  _downloadTxtFile () {
    var element = document.createElement("a");
    var name = this.props.npc.description.name.split(" ")[0];
    var gender = this.props.npc.description.gender;
    var race = this.props.npc.description.race.split(" ").join("_");
    var occupation = this.props.npc.description.occupation.split(" ").join("_");
    var file = new Blob([document.getElementById("downloadData").textContent.split("##").join("\r\n")], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = name + "_" + gender + "_" + race + "_" + occupation + ".txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    return false;
  }

  render(){
    var npcOptions = userOptions.map(userOption => {
      var enable = !(
        userOption.condition &&
        !userOption.condition(this.state.npcOptions)
      );

      if(userOption.condition && !userOption.condition(this.state.npcOptions)) {
        // Comment this if you want the disabled option
        return null;
      }

      let options = [];
      if(enable) {
        let opts = userOption.options;
        if(typeof opts === "function") {
          opts = opts(this.state.npcOptions);
        }
        options = opts.map((opt, i) => {
          if(!opt.name) {
            return null;
          }
          return <option value={i} key={i}>{opt.name}</option>;
        });
      }

      return (
        <Col xs={12}>
          <Input
            onChange={
              (e)=>{
                var npcOptions = this.state.npcOptions;
                npcOptions[userOption.optionName] = e.target.value === "random" ? null : parseInt(e.target.value);
                this.setState({npcOptions}, () => {
                  if(userOption.onChange) {
                    userOption.onChange(this);
                  }
                });
              }
            }
            type="select"
            label={userOption.label}
            key={userOption.label}
            disabled={!enable}
          >
            <option value="random" key="random">Random</option>
            {options}
          </Input>
        </Col>
      );
    });

    return (
      <div>
        <Panel className="hidden-panel">
          <form onSubmit={this.onSubmit.bind(this)}>
            <Row>
              {npcOptions}
            </Row>
            <Input className="center-block generate-button" type="submit" bsStyle="success" value=""/>
          </form>

          <form onSubmit={this._downloadTxtFile.bind(this)}>
            <Input className="center-block download-button download-button" type="submit" bsStyle="success" value=""/>
          </form>

        </Panel>
      </div>
    );
  }
}

UserInput.propTypes = {generate: PropTypes.func.isRequired};
