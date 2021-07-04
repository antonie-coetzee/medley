import { Medley, TypedModel } from "medley";

export type EditComponentProps = {
  medley:Medley;
  model:TypedModel;
  registerGetValue:(getValue:()=>{})=>void;
}