import { Type } from "./Type";

export interface Loader<MType extends Type = Type> {
  import(type: MType, exportName: string): Promise<unknown>;
}
