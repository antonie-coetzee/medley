import { ModelsOfType } from "./Models";
import { TypeTree } from "./Types";
export interface Composition {
    types: URL | TypeTree;
    modelsByType: ModelsOfType[];
}
