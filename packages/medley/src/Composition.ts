import { ModelsOfType, TypeTree } from "./Core";

export interface Composition {
  types: URL | TypeTree;
  modelsByType: ModelsOfType[];
}
