import {
  EDIT_COMPONENT,
  MIGRATION_DOWN,
  MIGRATION_UP,
  VIEW_FUNCTION,
  TYPES
} from "./Constants";
import { Module } from "./Module";

export interface ExportMap {
  [VIEW_FUNCTION]?: string;
  [EDIT_COMPONENT]?: string;
  [TYPES]?: string;
  [MIGRATION_UP]?: string;
  [MIGRATION_DOWN]?: string;
}

export interface TypeVersion {
  version: string;
  id: string;
  module: Module;
  exportMap?: ExportMap;
}

export interface Type {
  name: string;
  icon?: URL;
  versions: TypeVersion[];
}

export interface TypeTree {
  name: string;
  icon?: URL;
  types: (URL | Type)[];
  groups?: (URL | TypeTree)[];
}
