import { Medley, TypedModel } from "medley";

export type EditComponentProps = {
  medley:Medley;
  model:TypedModel;
  host:{
    delegates:{
      getValue:(getValue:()=>{})=>void;
    }    
  }
}