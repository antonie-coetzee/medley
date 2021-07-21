import { Module } from "./Module";

export interface Typed {
  typeName: string;
}

export interface TypeMeta {
  name: string;
  displayName?: string;
  category?: string[];
  icon?: URL;
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
}

export interface Type extends TypeMeta, TypeVersion {}

export type TypeCollection = [
  TypeMeta & {
    versions: URL | TypeVersion[];
  }
];
