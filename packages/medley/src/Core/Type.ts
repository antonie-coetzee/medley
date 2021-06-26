import { Module } from "./Module";

export interface ExportMap {
  [name:string]:string | undefined;
}

export interface Type {
  name: string;
  id: string;
  version: string;
  parentId?: string;
  module: Module;
  category?: string[];
  exportMap?: ExportMap;
  registry?: URL;
  icon?: URL;
}