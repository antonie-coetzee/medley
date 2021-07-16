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
  exportMap?: {
    [name: string]: string | undefined;
  };
}

export interface Type extends TypeMeta, TypeVersion {}

export type TypeCollection = [
  TypeMeta & {
    versions: URL | TypeVersion[];
  }
];
