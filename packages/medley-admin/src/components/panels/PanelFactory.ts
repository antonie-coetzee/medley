import { TabNode } from "flexlayout-react";
import { MODEL_LIST, TYPE_TREE } from "../../stores/LayoutStore";

import { ModelList } from "./ModelList/ModelList";
import { TypeExplorer } from "./TypeExplorer/TypeExplorer";

export const panelFactory = (node: TabNode) => {
  var component = node.getComponent();
  switch (component) {
    case MODEL_LIST:
      return ModelList(node);
    case TYPE_TREE:
      return TypeExplorer();
    default:
      break;
  }
};
