
export class AnalysisNode {
  name: string;
  type: string;
  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }
}

export class Definition extends AnalysisNode {}
export class Use extends AnalysisNode {}

export class StringDef extends Definition {
  constructor(name: string) {
    super(name, "string");
  }
}

export class NumberDef extends Definition {
  constructor(name: string) {
    super(name, "number");
  }
}

export class StringUse extends Use {
  constructor(name: string) {
    super(name, "string");
  }
}

export class NumberUse extends Use {
  constructor(name: string) {
    super(name, "number");
  }
}

export interface StaticAnalysis {
  def?: Definition[],
  use?: Use[],
  table?: string,
}