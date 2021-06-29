import { Type } from "medley";
import { Layout } from "flexlayout-react";
import { TypeStore } from "./TypeStore";

export const MODEL_LIST = "modelList";
export const TYPE_TREE = "typeTree";

const tempConfig = {
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

export class LayoutStore {
	private layout: Layout | undefined;
  public config: any = {};

  constructor(private typeStore:TypeStore) {
    this.config = tempConfig;
  }

	public setLayout(layout:Layout | null){
    if(layout === null){
      return;
    }
		this.layout = layout;
	}

	public addModelList(type: Type){
		if(this.layout == null) return;
		this.layout.addTabToActiveTabSet({
			component: MODEL_LIST,
			name: `${type.name} - ${type.version}`,
      config: {typeVersionId: type.id}
		})
	}
}
