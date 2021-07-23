import { Module } from "./Module";

export interface Typed {
  typeName: string;
}

export interface TypeName {
  name: string;
}

export interface TypeVersion {
  version: string;
  module: Module;
  // undefined: (standard export name)
  // string: (standard export name) -> (different export name)
  // Module: (standard export name) -> (different module).(standard export name)
  // { name: string } & Module: (standard export name) -> (different module).(different export name)
  exportMap?: {
    [name: string]:
      | string
      | Module
      | { name: string } & Module
      | undefined;
  };
  displayName?: string;
  category?: string[];
  icon?: URL;
  helpUrl?:URL;
}

export interface Type extends TypeName, TypeVersion {}

export type TypeCollection = [
  TypeName & {
    versions: URL | TypeVersion[];
  }
];
