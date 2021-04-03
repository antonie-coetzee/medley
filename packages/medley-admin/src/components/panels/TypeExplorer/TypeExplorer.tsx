import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { Stores, useStores } from "../../../stores/Stores";
import { Type, TypeTree, TypeVersion } from "@medley/medley-mve";
import { Observer, observer } from "mobx-react";
import { LayoutStore } from "../../../stores/LayoutStore";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

let nodeId = 0;

const clickHandlerFactory = (layoutStore: LayoutStore, typeVersion: TypeVersion):React.MouseEventHandler<HTMLLIElement> => {
  return (e) => {
    e.preventDefault();
    layoutStore.addModelList(typeVersion);
  };
};

const generateTypeVersions = (stores: Stores, parent: string, type: Type) => {
  return (
    <Fragment>
      {type.versions.map((typeVersion) => {
        const typeId = parent + "." + typeVersion.id;
        return (
          <TreeItem
            nodeId={typeId}
            key={typeId}
            label={typeVersion.number}
            onMouseDown={(e)=>{e.preventDefault()}}
            onDoubleClick={clickHandlerFactory(stores.layoutStore, typeVersion)}
          />
        );
      })}
    </Fragment>
  );
};

const generateTypes = (
  stores: Stores,
  parent: string,
  types: (string | Type)[]
) => {
  if (types == null || types.length == 0) return;

  return (
    <Fragment>
      {types
        .filter((type) => typeof type === "object")
        .map((typeEl) => {
          const type = typeEl as Type;
          const typeId = parent + "." + type.name;
          return (
            <TreeItem nodeId={typeId} key={typeId} label={type.name} onMouseDown={(e)=>{e.preventDefault()}}>
              {type.versions && generateTypeVersions(stores, typeId, type)}
            </TreeItem>
          );
        })}
    </Fragment>
  );
};

const generateGroup = (
  stores: Stores,
  parent: string | null,
  typeTree: TypeTree
) => {
  if (parent == null || parent === undefined) {
    const groupKey = typeTree.name;
    return (
      <Fragment>
        {generateTypes(stores, groupKey, typeTree.types)}
        {typeTree.groups &&
          typeTree.groups.map((group) =>
            generateGroup(stores, groupKey, group)
          )}
      </Fragment>
    );
  } else {
    const groupKey = parent + "." + typeTree.name;
    return (
      <TreeItem nodeId={groupKey} key={groupKey} label={typeTree.name}>
        {generateTypes(stores, groupKey, typeTree.types)}
        {typeTree.groups &&
          typeTree.groups.map((group) =>
            generateGroup(stores, groupKey, group)
          )}
      </TreeItem>
    );
  }
};

const generateTree = (
  stores: Stores,
  typeTree: TypeTree | undefined | null
) => {
  if (typeTree == undefined || typeTree == null) {
    return;
  }
  return (
    <Fragment>{generateGroup(stores, null, typeTree)}</Fragment>
  );
};

export function TypeExplorer() {
  const stores = useStores();
  nodeId = 0;
  return (
    <Observer>
      {() => (
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {generateTree(
            stores,
            stores.compositionStore.repository?.getTypeTree()
          )}
        </TreeView>
      )}
    </Observer>
  );
}
