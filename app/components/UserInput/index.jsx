var React = require("react");
var Panel = require("react-bootstrap/Panel");
var Input = require("react-bootstrap/Input");
var Col = require("react-bootstrap/Col");
var Row = require("react-bootstrap/Row");
var _ = require("lodash");

var races = require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/race.json5");
var genders = require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/gender.json5");
var alignments = require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/forcealign.json5");

var classes = require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/class.json5");
var professions = require("!filter-loader?name,table!./../../../lib/randomgenerators/npcData/tables/profession.json5");

var professionCategories = {
  "learned": require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/learned.json5"),
  "lesserNobility": require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/lesserNobility.json5"),
  "professional": require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/professional.json5"),
  "workClass": require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/workClass.json5"),
  "martial": require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/martial.json5"),
  "underclass": require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/underclass.json5"),
  "entertainer": require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/entertainer.json5"),
};

var userOptions = [
  {
    label: "Race",
    optionName: "race",
    options: races
  },
  {
    label: "Gender",
    optionName: "gender",
    options: genders
  },
  {
    label: "Alignment",
    optionName: "alignment",
    options: alignments
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
    condition: (npcOptions) => (npcOptions.classorprof === 1 && _.isNumber(npcOptions.occupation1)),
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

  render(){
    var npcOptions = _.map(userOptions, userOption => {
      if(userOption.condition && !userOption.condition(this.state.npcOptions)) {
        return null;
      }
      var opts = userOption.options;
      if(_.isFunction(opts)) {
        opts = opts(this.state.npcOptions);
      }
      var options = _.map(opts, (opt, i) => {
        if(!opt.name) {
          return null;
        }
        return <option value={i} key={i}>{opt.name}</option>;
      });

      return (
        <Col xs={12} md={3}>
          <Input
            onChange={
              (e)=>{
                var npcOptions = this.state.npcOptions;
                npcOptions[userOption.optionName] = e.target.value === "random" ? null : _.parseInt(e.target.value);
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
          >
            <option value="random" key="random">Random</option>
            {options}
          </Input>
        </Col>
      );
    });

    return (
      <div>
        <Panel header="Choose your NPC">
          <form onSubmit={this.onSubmit.bind(this)}>
            <Row>
              {npcOptions}
            </Row>
            <Input type="submit" bsStyle="success" value="Generate NPC" />
          </form>

        </Panel>
      </div>
    );
  }
}

UserInput.propTypes = {generate: React.PropTypes.func.isRequired};
