import React from "react";
import FlexLayout, { Layout } from "flexlayout-react";
import { panelFactory } from "./PanelFactory";
import { observer } from "mobx-react";
import { LayoutStore } from "../../stores/LayoutStore";
import { useStores } from "../../stores/Stores";

export const PanelContainerComponent = () => {
  const { layoutStore } = useStores();
  
  return (
      <FlexLayout.Layout
        model={FlexLayout.Model.fromJson(layoutStore.config)}
        factory={panelFactory}
        ref={(ref) => layoutStore.setLayout(ref)}
      />      
  );
};

export const PanelContainer = observer(() => {
  return <PanelContainerComponent />;
});
