import {
  Composition, Medley,
} from "medley";
import { makeAutoObservable, runInAction } from "mobx";
import { LayoutStore } from "./LayoutStore";

export class CompositionStore {

  constructor(private medley:Medley, private layoutStore:LayoutStore) {}

  public async import(composition: Composition) {
    this.medley.import(composition, new URL(window.location.toString() + "assets/Compositions/"));
    this.layoutStore.newLayout();
  }

  public getComposition(): Composition | undefined {
    return this.medley.getComposition();
  }
}