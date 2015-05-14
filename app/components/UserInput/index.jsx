var React = require("react");
var Panel = require("react-bootstrap/Panel");
var Input = require("react-bootstrap/Input");

var races = require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/race.json5");
var genders = require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/gender.json5");
var alignments = require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/forcealign.json5");
var _ = require("lodash");

var options = [
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
    var npcOptions = _.map(options, val => {
      var options = _.map(val.options, (opt, i) => {
        if(!opt.name) {
          return null;
        }
        return <option value={i}>{opt.name}</option>;
      });

      return (
        <Input
          onChange={
            (e)=>{
              var npcOptions = this.state.npcOptions;
              npcOptions[val.optionName] = e.target.value === "random" ? null : _.parseInt(e.target.value);
              this.setState({npcOptions});
            }
          }
          type="select"
          label={val.label}
        >
          <option value="random">Random</option>
          {options}
        </Input>
      );
    });

    return (
      <div>
        <Panel header="Choose your NPC">
          <form onSubmit={this.onSubmit.bind(this)}>
            {npcOptions}
            <Input type='submit' value='Generate NPC' />
          </form>

        </Panel>
      </div>
    );
  }
}

UserInput.propTypes = {generate: React.PropTypes.func.isRequired};
