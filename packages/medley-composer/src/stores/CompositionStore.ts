import {
  Composition, Medley,
} from "medley";
import { makeAutoObservable, runInAction } from "mobx";

export class CompositionStore {

  constructor(private medley:Medley) {}

  public async load(composition: Composition) {
    this.medley.load(composition, new URL(window.location.toString() + "assets/Compositions/"));
    // const res = await this.medley.runViewFunction<() => Promise<string>>(
    //   "e0754165-d127-48be-92c5-85fc25dbca19"
    // );
    // console.log(res);
  }

  public getComposition(): Composition | undefined {
    return this.medley.getComposition();
  }
}