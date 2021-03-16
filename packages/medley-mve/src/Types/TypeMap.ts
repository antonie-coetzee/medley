import { Type } from "./Type";

export interface TypeMap {
  name: string;
  iconUrl?: URL;
  types: (string | Type)[];
  groups?: TypeMap[];
}
