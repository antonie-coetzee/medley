import { Type, TypedModel } from "medley";
import { Layout } from "flexlayout-react";
import { TypeStore } from "./TypeStore";
import { makeObservable, observable } from "mobx";

export const MODEL_LIST = "modelList";
export const TYPE_TREE = "typeTree";
export const MODEL_EDIT = "modelEdit";

const newConfig = {
  global: {},
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
  global: {},
  borders: [],
  layout: {},
};

export class LayoutStore {
	private layout: Layout | undefined;
  public config: any = null;

  constructor(private typeStore:TypeStore) {
    makeObservable(this, {config: observable});
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

	public addModelList(type: Type){
		if(this.layout == null) return;
		this.layout.addTabToActiveTabSet({
			component: MODEL_LIST,
			name: `${type.name} - ${type.version}`,
      config: {typeName: type.name}
		})
	}

  public addModelEdit(model: TypedModel){
		if(this.layout == null) return;
		this.layout.addTabToActiveTabSet({
			component: MODEL_EDIT,
			name: `${model.name} - ${model.id}`,
      config: {modelId: model.id}
		})
	}
}
