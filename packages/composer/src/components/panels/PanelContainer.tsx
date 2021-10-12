import React from "react";
import FlexLayout, { Layout } from "flexlayout-react";
import { panelFactory } from "./PanelFactory";
import { Observer, observer } from "mobx-react";
import { LayoutStore } from "../../stores/LayoutStore";
import { useStores } from "../../stores/Stores";

export const PanelContainer = () => {
  const { layoutStore } = useStores();
  
  return (
    <Observer>
      {() => {
        if(layoutStore.config == null){
          return null;
        }
        return <FlexLayout.Layout
        
        model={FlexLayout.Model.fromJson(layoutStore.config)}
        factory={panelFactory}
        ref={(ref) => layoutStore.setLayout(ref)}
        />       
}}
    </Observer>          
  );
};

