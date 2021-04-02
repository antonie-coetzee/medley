import { TabNode } from "flexlayout-react";
import { MODEL_LIST, TYPE_TREE } from "../../stores/PanelStore";

import BasicTable from "./ModelList/ModelList";
import {FileSystemNavigator} from "./TypeTree/TypeTree";

export const panelFactory = (node:TabNode) => {
    var component = node.getComponent();
    switch (component) {
        case MODEL_LIST:
            return BasicTable();
        case TYPE_TREE:
            const navigator = FileSystemNavigator;
            return navigator();            
        default:
            break;
    }
}

