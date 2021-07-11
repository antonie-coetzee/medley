import {
  Composition, Medley,
} from "medley";
import { makeAutoObservable, runInAction } from "mobx";
import { LayoutStore } from "./LayoutStore";

export class CompositionStore {

  constructor(private medley:Medley, private layoutStore:LayoutStore) {}

  public async load(composition: Composition) {
    this.medley.load(composition, new URL(window.location.toString() + "assets/Compositions/"));
    // const res = await this.medley.runViewFunction<() => Promise<string>>(
    //   "e0754165-d127-48be-92c5-85fc25dbca19"
    // );
    // console.log(res);
    this.layoutStore.newLayout();
  }

  public getComposition(): Composition | undefined {
    return this.medley.getComposition();
  }
}