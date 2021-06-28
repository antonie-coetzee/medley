import { Medley, MedleyOptions } from "medley";
import { makeAutoObservable, runInAction } from "mobx";

export class TypeStore {
  constructor(private medley: Medley) {}
}
