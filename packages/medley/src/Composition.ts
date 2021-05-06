import { ModelsOfType } from "./Models/index.ts";
import { TypeTree } from "./Types/index.ts";

export interface Composition {
  types: URL | TypeTree;
  modelsByType: ModelsOfType[];
}
