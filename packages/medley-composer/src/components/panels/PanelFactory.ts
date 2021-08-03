import { TabNode } from "flexlayout-react";
import { NODE_EDIT, NODE_LIST, TYPE_TREE } from "../../stores/LayoutStore";
import {NodeEdit} from "./NodeEdit/NodeEdit";
import { NodeList } from "./NodeList/NodeList";
import { TypeExplorer } from "./TypeExplorer/TypeExplorer";

export const panelFactory = (node: TabNode) => {
  var component = node.getComponent();
  switch (component) {
    case NODE_LIST:
      return NodeList(node);
    case TYPE_TREE:
      return TypeExplorer();
    case NODE_EDIT:
        return NodeEdit(node);      
    default:
      break;
  }
};
