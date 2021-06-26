import { Module } from "./Module";

export interface Typed {
  typeId: string;
}

export interface Type {
  name: string;
  id: string;
  version: string;
  parentId?: string;
  module: Module;
  category?: string[];
  exportMap?: {
    [name: string]: string | undefined;
  };
  registry?: URL;
  icon?: URL;
}
