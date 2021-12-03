import { Cache } from "./Cache";
import { Module } from "./Module";
import { Scoped } from "./Scoped";

export interface TypeVersion {
  version: string;
  module: Module;
  cache?: Cache;
  /*
   ** string: (std module).(std export name) -> (std module).(diff export name)
   ** Module: (std module).(std export name) -> (diff module).(std export name)
   ** { name: string } & Module: (std module).(std export name) -> (diff module).(diff export name)
   ** undefined: (std export name)
   */
  exportMap?: {
    [name: string]: string | Module | ({ name: string } & Module) | undefined;
  };
}

export interface Type extends TypeVersion, Scoped {
  name: string;
}
