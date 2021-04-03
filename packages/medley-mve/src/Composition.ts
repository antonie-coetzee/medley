import { ModelsOfType } from "./Models";
import { TypeTree } from "./Types";

export class Composition {
  types: string | TypeTree;
  modelsByType: ModelsOfType[];
}
