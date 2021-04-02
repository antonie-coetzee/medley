import { ModelsByTypeId } from "./Models";
import { TypeTree } from "./Types";

export class Composition {
    types: string | TypeTree;
    models: ModelsByTypeId[];
}