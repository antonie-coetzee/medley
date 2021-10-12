import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import React from "react";

type ConfirmDialogState = {
  isOpen:boolean, 
  title?:string,
  content?:string,
  okButton?:string,
  onOk?:()=>void}

type stringInputDialogState = {
  isOpen:boolean, 
  title?:string,
  inputLabel?:string,
  okButton?:string,
  successMessage?:string,
  onOk?:(name:string)=>void}

export class DialogStore {
  public stringInputDialogState:stringInputDialogState
  public confirmDialogState:ConfirmDialogState

  constructor() {
    this.stringInputDialogState = {isOpen: false};
    this.confirmDialogState = {isOpen: false}
    makeAutoObservable(this);
  }

  openStringDialog(options:Partial<Omit<stringInputDialogState, "isOpen">>){
      this.stringInputDialogState = {...options, isOpen:true};
  }

  closeStringDialog(){
    this.stringInputDialogState.isOpen = false;
  }

  openConfirmDialog(options:Partial<Omit<ConfirmDialogState, "isOpen">>){
      this.confirmDialogState = {...options, isOpen:true};
  }

  closeConfirmDialog(){
    this.confirmDialogState.isOpen = false;
  }
}
