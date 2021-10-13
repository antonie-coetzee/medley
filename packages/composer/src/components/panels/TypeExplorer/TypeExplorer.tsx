import React, { Fragment } from "react";
import { makeStyles, styled } from "@material-ui/core";
import { TreeView, TreeItem } from "@material-ui/lab";
import {
  CategorySharp,
  Folder,
  FolderOpen,
  InsertDriveFileOutlined,
} from "@material-ui/icons";
import { useStores } from "../../../stores/Stores";
import { Type } from "medley";
import { observer, Observer } from "mobx-react";
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
  treeviewRoot: {
    "& :focus > .MuiTreeItem-content .MuiTreeItem-label": {
      backgroundColor: "#e9e9e9",
    },
  },
});

export const TypeExplorerComponent = observer(() => {
  const { typeStore, layoutStore } = useStores();
  const classes = useStyles();

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
                nodeId={type.name}
                key={type.name}
                label={type.label || type.name}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  layoutStore.addNodeList(type);
                }}
              ></TreeItem>
            );
          })}
        {treeNode.childNodes.length > 0 &&
          treeNode.childNodes.map((tn) => {
            return (
              <TreeItem
                nodeId={tn.name}
                key={tn.name}
                label={tn.name}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                }}
              >
                {treeItemFromTreeNode(tn)}
              </TreeItem>
            );
          })}
      </Fragment>
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<FolderOpen />}
      defaultExpandIcon={<Folder />}
      defaultEndIcon={<span>-</span>}
      className={classes.root}
      disableSelection={true}
      classes={{ root: classes.treeviewRoot }}
    >
      {treeItemFromTreeNode(buildTreeNodeFromTypes(typeStore.types))}
    </TreeView>
  );
});

export const TypeExplorer = () => {
  return <TypeExplorerComponent />;
};