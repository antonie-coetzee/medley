import { TypeVersion } from "@medley/medley-mve";
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
    type: "row",
    weight: 100,
    children: [],
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

	public addModelList(typeVersion: TypeVersion){
		if(this.layout == null) return;
    
    const type = this.typeStore.typeVersionToType(typeVersion.id);
    if(type == undefined) return;

		this.layout.addTabToActiveTabSet({
			component: MODEL_LIST,
			name: `${type.name} - ${typeVersion.number}`,
      config: {typeVersionId: typeVersion.id}
		})
	}
}
