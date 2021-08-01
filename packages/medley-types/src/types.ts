import { Medley, Node } from "medley";

export type EditComponentProps = {
  medley:Medley;
  model:Node;
  host:{
    delegates:{
      getValue:(getValue:()=>{})=>void;
    }    
  }
}