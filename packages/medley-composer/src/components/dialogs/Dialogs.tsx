import { observer } from "mobx-react";
import React from "react";
import { useStores } from "../../stores/Stores"
import { StringInputDialog } from "./StringInputDialog";

const DialogsComponent:React.FC = ()=>{
  return (<StringInputDialog/>)
}

export const Dialogs = DialogsComponent;