import {
  Graph, Medley,
} from "medley";
import { makeAutoObservable, runInAction } from "mobx";
import { LayoutStore } from "./LayoutStore";

const GraphNameSpace = "composition";
const activeGraphKey = `${GraphNameSpace}-active`;

export class GraphStore { 

  constructor(private medley:Medley, private layoutStore:LayoutStore) {
    this.loadActiveGraph();
  }

  public async import(graph: Graph, persist?:boolean) {
    if(persist){
      this.saveActiveGraph(graph);
    }
    this.medley.import(graph, new URL(window.location.toString() + "assets/Compositions/"));
    this.layoutStore.newLayout();
  }

  public getGraph(): Graph | undefined {
    return this.medley.export();
  }

  public loadActiveGraph(): void {
    const prevActiveGraph = localStorage.getItem(activeGraphKey);
    if(prevActiveGraph){
      this.import(JSON.parse(prevActiveGraph), false);
    }
  }

  public saveActiveGraph(graph?: Graph): void {
    const activeGraph = graph ?? this.getGraph();
    if(activeGraph){
      localStorage.setItem(activeGraphKey, JSON.stringify(activeGraph));
    }
  }
}