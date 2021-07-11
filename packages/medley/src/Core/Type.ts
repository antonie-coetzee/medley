import { Module } from "./Module";

export interface Typed {
  typeName: string;
}

export interface Type {
  name: string;
  version: string;
  module: Module;
  displayName?: string;
  category?: string[];
  exportMap?: {
    [name: string]: string | undefined;
  };
  registry?: URL;
  icon?: URL;
}
