import { Module } from "./Module";

export interface TypeName {
  name: string;
}

export interface TypeVersion {
  version: string;
  module: Module;
  cache?: boolean;
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

export interface Type extends TypeName, TypeVersion {}
