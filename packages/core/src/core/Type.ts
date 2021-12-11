import { Cache } from "./Cache";
import { Module } from "./Module";
import { Scoped } from "./Scoped";

export interface TypeVersion<MModule extends Module> {
  version: string;
  module: MModule;
  cache?: Cache;
}

export interface Type<MModule extends Module = Module>
  extends TypeVersion<MModule>,
    Scoped {
  name: string;
}
