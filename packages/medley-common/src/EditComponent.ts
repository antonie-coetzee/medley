import React from "react";
import { Medley, Node } from "medley";

export type EditComponentProps = {
  medley:Medley,
  node:Node,
  onSave:(saveCallback:()=>void)=>void
}

export type EditComponent = React.FC<EditComponentProps>