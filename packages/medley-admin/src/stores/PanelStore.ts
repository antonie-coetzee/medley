export const MODEL_LIST = "modelList";
export const TYPE_TREE = "typeTree"

const tempConfig = {
	global: {},
	borders: [		 {
		"type":"border",
		 "location": "left",
		"children": [
			{
				"type": "tab",
				"enableClose":false,
				"name": "Types",
				"component": TYPE_TREE,
			}
		]
	}
],
	layout:{
		"type": "row",
		"weight": 100,
		"children": [
			{
				"type": "tabset",
				"weight": 50,
				"selected": 0,
				"children": [
					{
						"type": "tab",
						"name": "FX",
						"component":MODEL_LIST,
					}
				]
			},
			{
				"type": "tabset",
				"weight": 50,
				"selected": 0,
				"children": [
					{
						"type": "tab",
						"name": "FI",
						"component":"grid",
					}
				]
			}
		]
	}
};

export class PanelStore {
    public config: any = {};

    constructor() {
        this.config = tempConfig;
    }
}