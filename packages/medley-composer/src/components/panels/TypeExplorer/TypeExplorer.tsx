import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import { TreeView, TreeItem } from "@material-ui/lab";
import {
  CategorySharp,
  Folder,
  FolderOpen,
  InsertDriveFileOutlined,
} from "@material-ui/icons";
import { useStores } from "../../../stores/Stores";
import { Type } from "medley";
import { Observer } from "mobx-react";
import { LayoutStore } from "../../../stores/LayoutStore";

type TreeNode = {
  name: string;
  childNodes: TreeNode[];
  types: Type[];
};

const useStyles = makeStyles({
  root: {
    padding: "8px",
  },
});

export function TypeExplorer() {
  const { typeStore, layoutStore } = useStores();

  const buildTree = (parentNode: TreeNode, path: string[], type: Type) => {
    if (path == null || path.length === 0) {
      parentNode.types.push(type);
      return;
    }
    const category = path.shift();
    if (category == null) {
      return;
    }
    const existingCategory = parentNode.childNodes.find(
      (el) => el.name === category
    );
    if (existingCategory) {
      buildTree(existingCategory, path, type);
      return;
    }
    const categoryNode: TreeNode = {
      childNodes: [],
      types: [],
      name: category,
    };
    parentNode.childNodes.push(categoryNode);
    buildTree(categoryNode, path, type);
  };

  const buildTreeNodeFromTypes = (types: Type[]) => {
    const rootNode: TreeNode = {
      childNodes: [],
      types: [],
      name: "root",
    };
    types.forEach((el) => {
      buildTree(rootNode, [...(el.category || [])], el);
    });
    return rootNode;
  };

  const treeItemFromTreeNode = (treeNode: TreeNode) => {
    return (
      <Fragment>
        {treeNode.types.length > 0 &&
          treeNode.types.map((type) => {
            return (
              <TreeItem
                nodeId={type.id}
                key={type.id}
                label={type.name}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  layoutStore.addModelList(type);
                }}
              ></TreeItem>
            );
          })}
        {treeNode.childNodes.length > 0 &&
          treeNode.childNodes.map((tn) => {
            return (
              <TreeItem nodeId={tn.name} key={tn.name} label={tn.name}>
                {treeItemFromTreeNode(tn)}
              </TreeItem>
            );
          })}
      </Fragment>
    );
  };

  const classes = useStyles();
  return (
    <Observer>
      {() => (
        <TreeView
          defaultCollapseIcon={<FolderOpen />}
          defaultExpandIcon={<Folder />}
          defaultEndIcon={<span>-</span>}
          className={classes.root}
        >
          {treeItemFromTreeNode(buildTreeNodeFromTypes(typeStore.typesActive))}
        </TreeView>
      )}
    </Observer>
  );
}
