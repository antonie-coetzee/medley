import { TypeVersion } from "@medley/medley-mve";
import { Layout } from "flexlayout-react";
import React from "react";
import { CompositionStore } from "./CompositionStore";

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
	private layout: Layout | null = null;
  public config: any = {};

  constructor(private compositionStore: CompositionStore) {
    this.config = tempConfig;
  }

	public setLayout(layout:Layout | null){
		this.layout = layout;
	}

	public addModelList(typeVersion: TypeVersion){
		if(this.layout == null) return;
    
    const type = this.compositionStore.repository?.typeVersionToType(typeVersion.id);
    if(type == undefined) return;

		this.layout.addTabToActiveTabSet({
			component: MODEL_LIST,
			name: `${type.name} - ${typeVersion.number}`,
      config: {typeVersionId: typeVersion.id}
		})
	}
}
