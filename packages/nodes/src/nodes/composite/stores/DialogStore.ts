import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";

export class DialogStore {
    public open:boolean = false;
    public dialog: React.VFC<{ close: () => void }> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  openDialog(dialog: React.VFC<{ close: () => void }>){
      this.dialog = dialog;
      this.open = true;
  }

  closeDialog(){
    this.open = false;
  }
}
