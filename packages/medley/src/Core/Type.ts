import { Module } from "./Module";
import { Scoped } from "./Scoped";

export interface TypeVersion {
  version: string;
  module: Module;
  cache?: boolean;
  composite?: boolean;
  /*
   ** string: (standard export name) -> (different export name)
   ** Module: (standard export name) -> (different module).(standard export name)
   ** { name: string } & Module: (standard export name) -> (different module).(different export name)
   ** undefined: (standard export name)
   */
  exportMap?: {
    [name: string]: string | Module | ({ name: string } & Module) | undefined;
  };
}

export interface Type extends TypeVersion, Scoped{
  name: string;
}
