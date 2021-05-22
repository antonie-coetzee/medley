import { ModelsOfType, TypeTree } from "./core";

export interface Composition {
  types: URL | TypeTree;
  modelsByType: ModelsOfType[];
}
