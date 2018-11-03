import {
  Panel,
  Col,
  Row,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap";
import React, {Component} from "react";
import PropTypes from 'prop-types';

var races = require("./npcData/tables/race.json");
var genders = require("./npcData/tables/gender.json");
var alignments = require("./npcData/tables/forcealign.json");
var plothooks = require("./npcData/tables/hooks.json");

var classes = require("./npcData/tables/class.json");
var professions = require("./npcData/tables/profession.json");

var professionCategories = {
  "learned": require("./npcData/tables/learned.json"),
  "lesserNobility": require("./npcData/tables/lesserNobility.json"),
  "professional": require("./npcData/tables/professional.json"),
  "workClass": require("./npcData/tables/workClass.json"),
  "martial": require("./npcData/tables/martial.json"),
  "underclass": require("./npcData/tables/underclass.json"),
  "entertainer": require("./npcData/tables/entertainer.json"),
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

export default class UserInput extends Component {
  static propTypes = {generate: PropTypes.func.isRequired}

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
        <Col xs={12} key={userOption.label}>
          <FormGroup>
            <ControlLabel>{userOption.label}</ControlLabel>
            <FormControl componentClass="select"
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
              disabled={!enable}
            >
              <option value="random" key="random">Random</option>
              {options}
            </FormControl>
          </FormGroup>
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
            <Button type="submit" className="center-block generate-button" bsStyle="success" >Submit</Button>
          </form>

          <form onSubmit={this._downloadTxtFile.bind(this)}>
            <Button type="submit" className="center-block download-button download-button" bsStyle="success" >Submit</Button>
          </form>

        </Panel>
      </div>
    );
  }
}
