import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import React from "react";


type stringInputDialogState = {
  isOpen:boolean, 
  title?:string,
  inputLabel?:string,
  okButton?:string,
  successMessage?:string,
  onOk?:(name:string)=>void}

export class DialogStore {
  public stringInputDialogState:stringInputDialogState

  constructor() {
    this.stringInputDialogState = {isOpen: false};
    makeAutoObservable(this);
  }

  openStringDialog(options:Partial<Omit<stringInputDialogState, "isOpen">>){
      this.stringInputDialogState = {...this.stringInputDialogState, ...options, isOpen:true};
  }

  closeStringDialog(){
    this.stringInputDialogState.isOpen = false;
  }
}
