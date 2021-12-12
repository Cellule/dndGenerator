import jsoncrush from "jsoncrush";
import { Col, Row, FormGroup, FormControl, FormLabel, Button, Form } from "react-bootstrap";
import React, { Component } from "react";
import { NamedOption, getNamedTableOptions, getTableReferenceOptions } from "./npcData/tables";
import { NpcGenerateOptions, Npc } from "./npcData/index";
import styles from "./UserInput.module.css";

const races = getTableReferenceOptions("race");

const subraces: { [race: string]: NamedOption[] } = {
  elf: getNamedTableOptions("raceelf"),
  dwarf: getNamedTableOptions("racedwarf"),
  gnome: getNamedTableOptions("racegnome"),
  halfling: getNamedTableOptions("racehalfling"),
};

const genders = getNamedTableOptions("gender");
const alignments = getNamedTableOptions("forcealign");
const plothooks = getNamedTableOptions("hooks");
const classes = getNamedTableOptions("class");
const professions = getTableReferenceOptions("profession");

const professionCategories: { [prof: string]: NamedOption[] } = {
  learned: getNamedTableOptions("learned"),
  lesserNobility: getNamedTableOptions("lesserNobility"),
  professional: getNamedTableOptions("professional"),
  workClass: getNamedTableOptions("workClass"),
  martial: getNamedTableOptions("martial"),
  underclass: getNamedTableOptions("underclass"),
  entertainer: getNamedTableOptions("entertainer"),
};

if (process.env.NODE_ENV === "development") {
  for (const prof of professions) {
    if (!professionCategories[prof.table]) {
      throw new Error(`Missing profession category "${prof.table}"`);
    }
  }
}

interface IProps {
  npc: Npc;
  generate: (options: NpcGenerateOptions) => void;
}

interface IState {
  npcOptions: NpcGenerateOptions;
}

const userOptions: {
  label: string;
  optionName: keyof NpcGenerateOptions;
  options: { name?: string }[] | ((npcOptions: NpcGenerateOptions) => { name?: string }[]);
  condition?: (npcOptions: NpcGenerateOptions) => boolean;
  onChange?: (component: Component<IProps, IState>) => void;
}[] = [
  {
    label: "Race",
    optionName: "race",
    options: races,
    onChange: (component) => {
      const npcOptions = component.state.npcOptions;
      npcOptions.subrace = null;
      component.setState({ npcOptions });
    },
  },
  {
    label: "Subrace",
    optionName: "subrace",
    condition: (npcOptions) =>
      typeof npcOptions.race === "number" && subraces[races[npcOptions.race].table] !== undefined,
    options: (npcOptions) => subraces[races[npcOptions.race || 0].table],
  },
  {
    label: "Sex",
    optionName: "gender",
    options: genders,
  },
  {
    label: "Alignment",
    optionName: "alignment",
    options: alignments,
  },
  {
    label: "Plot Hooks",
    optionName: "plothook",
    options: plothooks,
  },
  {
    label: "Occupation",
    optionName: "classorprof",
    options: [{ name: "Class" }, { name: "Profession" }],
    onChange: (component) => {
      const npcOptions = component.state.npcOptions;
      npcOptions.occupation1 = null;
      npcOptions.occupation2 = null;
      component.setState({ npcOptions });
    },
  },
  {
    label: "Class",
    optionName: "occupation1",
    condition: (npcOptions) => npcOptions.classorprof === 0,
    options: classes,
  },
  {
    label: "Social Class",
    optionName: "occupation1",
    condition: (npcOptions) => npcOptions.classorprof === 1,
    options: professions,
    onChange: (component) => {
      const npcOptions = component.state.npcOptions;
      npcOptions.occupation2 = null;
      component.setState({ npcOptions });
    },
  },
  {
    label: "Profession",
    optionName: "occupation2",
    condition: (npcOptions) =>
      npcOptions.classorprof === 1 && typeof npcOptions.occupation1 === "number",
    options: (npcOptions) => professionCategories[professions[npcOptions.occupation1 || 0].table],
  },
];

export default class UserInput extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      npcOptions: {},
    };
  }

  onSubmit = (e: any) => {
    this.props.generate(this.state.npcOptions);
  };

  _downloadTxtFile = (e: any) => {
    const element = document.createElement("a");
    const name = this.props.npc.description.name.split(" ")[0];
    const gender = this.props.npc.description.gender;
    const race = this.props.npc.description.race.split(" ").join("_");
    const occupation = this.props.npc.description.occupation.split(" ").join("_");
    const elementData = document.getElementById("downloadData");
    if (!elementData) {
      throw new Error("Missing element downloadData");
    }
    const file = new Blob(
      [(elementData.textContent || "").split("#").join("\r\n").split("#").join("\r\n")],
      { type: "text/plain" },
    );
    element.href = URL.createObjectURL(file);
    element.download = name + "_" + gender + "_" + race + "_" + occupation + ".txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    return false;
  };

  render() {
    const npcOptions = userOptions.map((userOption) => {
      const enable = !(userOption.condition && !userOption.condition(this.state.npcOptions));

      if (userOption.condition && !userOption.condition(this.state.npcOptions)) {
        // Comment this if you want the disabled option
        return null;
      }

      let options: any = [];
      const selectedOption = this.state.npcOptions[userOption.optionName];
      if (enable) {
        let opts = userOption.options;
        if (typeof opts === "function") {
          opts = opts(this.state.npcOptions);
        }
        options = opts.map((opt, i) => {
          if (!opt.name) {
            return null;
          }
          return (
            <option value={i} key={i}>
              {opt.name}
            </option>
          );
        });
      }

      return (
        <Row key={userOption.label}>
          <Col>
            <FormGroup>
              <FormLabel>{userOption.label}</FormLabel>
              <Form.Select
                value={selectedOption ?? undefined}
                onChange={(e: any) => {
                  const npcOptions = this.state.npcOptions;
                  npcOptions[userOption.optionName] =
                    e.target.value === "random" ? null : parseInt(e.target.value);
                  this.setState({ npcOptions }, () => {
                    if (userOption.onChange) {
                      userOption.onChange(this);
                    }
                  });
                }}
                disabled={!enable}
              >
                <option value="random" key="random">
                  Random
                </option>
                {options}
              </Form.Select>
            </FormGroup>
          </Col>
        </Row>
      );
    });

    const npcDataUrl = new URL(window.location.href);
    npcDataUrl.searchParams.set("d", jsoncrush.crush(JSON.stringify(this.props.npc)));

    return (
      <div>
        <div className={styles.npcOptions}>{npcOptions}</div>
        <div className={styles.bottomOptions}>
          <Button
            type="submit"
            className="generate-button"
            variant="success"
            onClick={this.onSubmit}
          />
          <Button
            type="submit"
            className="download-button"
            variant="success"
            onClick={this._downloadTxtFile}
          />
          <a className={styles.npcLink} href={npcDataUrl.toString()}>
            🔗 Bookmark
          </a>
        </div>
      </div>
    );
  }
}
