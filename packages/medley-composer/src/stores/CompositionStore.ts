import {
  Composition, Medley,
} from "medley";
import { makeAutoObservable, runInAction } from "mobx";

export class CompositionStore {

  constructor(private medley:Medley) {}

  public async load(composition: Composition) {
    await this.medley.load(composition, new URL(window.location.toString()));
  }

  public getComposition(): Composition | undefined {
    return this.medley.getComposition();
  }
}
