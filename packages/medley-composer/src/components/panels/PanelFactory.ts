import { TabNode } from "flexlayout-react";
import { MODEL_EDIT, MODEL_LIST, TYPE_TREE } from "../../stores/LayoutStore";
import { ModelEdit } from "./ModelEdit/ModelEdit";
import { ModelList } from "./ModelList/ModelList";
import { TypeExplorer } from "./TypeExplorer/TypeExplorer";

export const panelFactory = (node: TabNode) => {
  var component = node.getComponent();
  switch (component) {
    case MODEL_LIST:
      return ModelList(node);
    case TYPE_TREE:
      return TypeExplorer();
    case MODEL_EDIT:
        return ModelEdit(node);      
    default:
      break;
  }
};
