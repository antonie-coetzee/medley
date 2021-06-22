import {
  EDIT_COMPONENT,
  MIGRATE_DOWN,
  MIGRATE_UP,
  VIEW_FUNCTION,
  TYPES
} from "./Constants";
import { Module } from "./Module";

export interface ExportMap {
  [VIEW_FUNCTION]?: string;
  [EDIT_COMPONENT]?: string;
  [TYPES]?: string;
  [MIGRATE_UP]?: string;
  [MIGRATE_DOWN]?: string;
}

export interface Type {
  name: string;
  id: string;
  version: string;
  previousVersionId?: string;
  module: Module;
  exportMap?: ExportMap;
  versions?: URL | Type[];
  icon?: URL;
}