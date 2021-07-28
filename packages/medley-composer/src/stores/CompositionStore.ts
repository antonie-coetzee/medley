import {
  Composition, Medley,
} from "medley";
import { makeAutoObservable, runInAction } from "mobx";
import { LayoutStore } from "./LayoutStore";

const compositionNameSpace = "composition";
const activeCompositionKey = `${compositionNameSpace}-active`;

export class CompositionStore { 

  constructor(private medley:Medley, private layoutStore:LayoutStore) {
    this.loadActiveComposition();
  }

  public async import(composition: Composition, persist?:boolean) {
    if(persist){
      this.saveActiveComposition(composition);
    }
    this.medley.import(composition, new URL(window.location.toString() + "assets/Compositions/"));
    this.layoutStore.newLayout();
  }

  public getComposition(): Composition | undefined {
    return this.medley.export();
  }

  public loadActiveComposition(): void {
    const prevActiveComposition = localStorage.getItem(activeCompositionKey);
    if(prevActiveComposition){
      this.import(JSON.parse(prevActiveComposition), false);
    }
  }

  public saveActiveComposition(composition?: Composition): void {
    const activeComposition = composition ?? this.getComposition();
    if(activeComposition){
      localStorage.setItem(activeCompositionKey, JSON.stringify(activeComposition));
    }
  }
}