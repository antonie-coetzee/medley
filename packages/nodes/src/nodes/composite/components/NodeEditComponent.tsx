import React from "react";
import { TNodeEditComponent } from "@medley-js/common";
import { CompositeNode } from "../CompositeNode";
import { Provider } from "mobx-react";
import { Stores } from "../stores";
import { EditComponent } from "./EditComponent";

export const NodeEditComponent: TNodeEditComponent<CompositeNode> = (props) => {
  const stores = new Stores(props);
  return (
    <Provider {...stores}>
      <EditComponent />
    </Provider>
  );
};
