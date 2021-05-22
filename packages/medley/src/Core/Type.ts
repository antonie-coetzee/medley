import {
  EDIT_COMPONENT,
  MIGRATION_DOWN,
  MIGRATION_UP,
  SCHEMA_INPUT,
  SCHEMA_OUTPUT,
  VIEW_FUNCTION,
} from "./Constants";
import { Module } from "./Module";

export interface ExportMap {
  [VIEW_FUNCTION]?: string;
  [EDIT_COMPONENT]?: string;
  [SCHEMA_INPUT]?: string;
  [SCHEMA_OUTPUT]?: string;
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
  iconUrl?: URL;
  versions: TypeVersion[];
}

export interface TypeTree {
  name: string;
  iconUrl?: URL;
  types: (URL | Type)[];
  groups?: (URL | TypeTree)[];
}
