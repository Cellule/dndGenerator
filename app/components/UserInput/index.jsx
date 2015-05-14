var React = require("react");
var Panel = require("react-bootstrap/Panel");
var race = require("!filter-loader?name!./../../../lib/randomgenerators/npcData/tables/race.json5");


export default class UserInput extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <Panel header='Choose your NPC'>
        {/*
          <SplitButton title='Dropdown right' pullRight>
            <MenuItem eventKey='1'>Action</MenuItem>
            <MenuItem eventKey='2'>Another action</MenuItem>
            <MenuItem eventKey='3'>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='4'>Separated link</MenuItem>
          </SplitButton>
        */}
        </Panel>
        Dat Input
      </div>
    );
  }
}

UserInput.propTypes = {generate: React.PropTypes.func.isRequired};
