export type Primitives = string | number;
export interface WeightedValue {
  w: number;
  v: string;
}

export interface Option {
  w: number;
  v: Group[];
  original: string;
}

export type Operator = ((
  context: { vars: { [key: string]: Primitives } },
  options: NpcGenerateOptions
) => Primitives | Group[] | void) & {
  original?: string;
};
export type Group = Operator | string;


export interface NpcGenerateOptions {
  race?: number | null,
  subrace?: number | null,
  classorprof?: number | null,
  occupation1?: number | null,
  occupation2?: number | null,
  alignment?: number | null,
  plothook?: number | null,
  gender?: number | null,
}

export type SchemaElement = string | WeightedValue[];
export type SchemaDescriptor = { [name: string]: SchemaElement | SchemaDescriptor };
export type SchemaResult = {
  [element: string]: SchemaResult | string;
};
export type DebugNode = { o?: string, childs: (DebugNode | string)[] }

export interface NpcAbilities {
  str: number,
  dex: number,
  con: number,
  int: number,
  wis: number,
  cha: number
}

export interface Npc {
  description: {
    name: string,
    kenkuname: string,
    age: number,
    gender: string,
    race: string,
    occupation: string,
    pronounMinus: string,
    pronounCapit: string,
  },
  physical: {
    hair: string,
    eyes: string,
    skin: string,
    height: number,
    build: string,
    face: string,
    special1: string,
    special2: string,
  },
  alignment: {
    good: number,
    moralneutral: number,
    evil: number,
    lawful: number,
    ethicalneutral: number,
    chaotic: number
  },
  relationship: {
    orientation: string,
    status: string
  },
  religion: {
    description: string
  },
  ptraits: {
    traitslizards: string,
    traitsgoliaths: string,
    traits1: string,
    traits2: string
  },
  pquirks: {
    description: string
  },
  hook: {
    description: string
  },
  abilities: NpcAbilities
}