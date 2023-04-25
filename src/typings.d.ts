import { Npc } from "npc-generator";

export interface GeneratedNpc {
  npc: Npc;
  uid: string;
  generatedAt?: string;
}
