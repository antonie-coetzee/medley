import React from "react";
import FlexLayout from "flexlayout-react";
import { panelFactory } from "./PanelFactory";
import { observer} from "mobx-react";
import { PanelStore } from "../../stores/PanelStore";
import { useStores } from "../../stores/Stores";

type PanelContainerProps = {
  panelStore: PanelStore;
};

export const PanelContainerComponent: React.FC<PanelContainerProps> = ({
  panelStore,
}) => {
  return (
    <FlexLayout.Layout
      model={FlexLayout.Model.fromJson(panelStore.config)}
      factory={panelFactory}
    />
  );
};

export const PanelContainer = observer(() => {
  const { panelStore } = useStores();
  return <PanelContainerComponent  panelStore={panelStore} />;
});
