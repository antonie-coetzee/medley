import { Module } from "./Module";
import { Scoped } from "./Scoped";

export interface TypeVersion<MModule extends Module> {
  version: string;
  module: MModule;
}

export interface Type<MModule extends Module = Module>
  extends TypeVersion<MModule>,
    Scoped {
  name: string;
}