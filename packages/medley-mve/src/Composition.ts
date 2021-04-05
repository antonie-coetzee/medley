import { ModelsOfType } from "./Models";
import { TypeTree } from "./Types";

export class Composition {
  types: URL | TypeTree;
  modelsByType: ModelsOfType[];
}
