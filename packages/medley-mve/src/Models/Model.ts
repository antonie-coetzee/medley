import { Typed } from "../Core";

export interface Model {
    id:string;
    name:string;
    refs?:string[];
    value?:any;
}

export interface TypedModel extends Model, Typed {}