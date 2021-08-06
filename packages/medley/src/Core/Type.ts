import { Module } from "./Module";
import { Port } from "./Port";

export interface Typed {
  type: string;
}

export interface TypeName {
  name: string;
}

export interface TypeVersion {
  version: string;
  tag?: string;
  module: Module;
  ports?: Port[];
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
  label?: string;
  category?: string[];
  icon?: URL;
  url?: URL;
}

export interface Type extends TypeName, TypeVersion {}

export type TypeCollection = [
  TypeName & {
    current: TypeVersion;
    history?: URL | TypeVersion[];
  }
];
