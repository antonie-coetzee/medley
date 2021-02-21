import { Type } from "./Type";

export interface TypeMap {
  name: string;
  iconUrl?: string;
  types: (string | Type)[];
  groups?: TypeMap[];
}
