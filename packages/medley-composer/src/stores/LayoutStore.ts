import { Type, Node } from "medley";
import { Layout } from "flexlayout-react";
import { TypeStore } from "./TypeStore";
import { action, makeObservable, observable } from "mobx";

export const NODE_LIST = "modelList";
export const TYPE_TREE = "typeTree";
export const NODE_EDIT = "modelEdit";

const newConfig = {
  global: {splitterSize: 3},
  borders: [
    {
      type: "border",
      location: "left",
      selected: 0,
      children: [
        {
          type: "tab",
          enableClose: false,
          name: "Types",
          component: TYPE_TREE,
        },
      ],
    },
  ],
  layout: {
  },
};

const emptyConfig = {
  global: {splitterSize: 3},
  borders: [],
  layout: {},
};

export class LayoutStore {
	private layout: Layout | undefined;
  public config: any = null;

  constructor(private typeStore:TypeStore) {
    makeObservable(this, {config: observable, newLayout: action});
  }

	public setLayout(layout:Layout | null){
    if(layout === null){
      return;
    }
		this.layout = layout;
	}

  public newLayout(){
    this.config = newConfig;
  }

	public addNodeList(type: Type){
		if(this.layout == null) return;
		this.layout.addTabToActiveTabSet({
			component: NODE_LIST,
			name: `${type.name} - ${type.version}`,
      config: {typeName: type.name}
		})
	}

  public addNodeEdit(model: Node){
		if(this.layout == null) return;
		this.layout.addTabToActiveTabSet({
			component: NODE_EDIT,
			name: `${model.name}`,
      config: {modelId: model.id}
		})
	}
}
