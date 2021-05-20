import { Module } from "../Core/Module";

export interface TypeVersion {
  version: string;
  id: string;
  module: Module;
  
  // viewFunction: ModuleExport;
  // edit?: {
  //   component: ModuleExport;
  //   save: ModuleExport;
  // }
  // schema?: {
  //   input?: ModuleExport;
  //   output?: ModuleExport;
  // };
  // migration?: {
  //   up?: ModuleExport;
  //   down?: ModuleExport;
  // };
}

export interface Type {
  name: string;
  iconUrl?: URL;
  versions: TypeVersion[];
}

export interface TypeTree {
  name: string;
  iconUrl?: URL;
  types: (URL | Type)[];
  groups?: (URL | TypeTree)[];
}
