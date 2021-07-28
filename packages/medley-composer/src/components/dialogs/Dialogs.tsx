import React from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { StringInputDialog } from "./StringInputDialog";

const DialogsComponent:React.FC = ()=>{
  return (<React.Fragment>
    <StringInputDialog/>
    <ConfirmDialog/>
  </React.Fragment>)
}

export const Dialogs = DialogsComponent;