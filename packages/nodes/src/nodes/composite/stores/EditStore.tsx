import {
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import {
  CNode,
  CNodePart,
  constants,
  Coordinates,
  NodeConstruct,
  TNodeEditComponentProps,
  TNodeConstructComponent,
  TNodeConstructComponentProps,
  CType,
  TNodeEditComponent,
} from "@medley-js/common";
import { CompositeNode } from "../CompositeNode";
import { Fragment, ReactNode } from "react";
import React from "react";
import { DialogStore } from "./DialogStore";
import { observer } from "mobx-react";

export class EditStore {
  public createComponent: ReactNode | null = null;

  constructor(
    private props: TNodeEditComponentProps<CompositeNode>,
    private dialogStore: DialogStore
  ) {
    makeAutoObservable(this, { createComponent: observable.ref });
  }

  /**
   * adds an external node to the current scope, by adding a scope link that
   * references the node
   */
  addNode(node: CNode, position?: Coordinates) {}

  /**
   * create a new node, by first executing its
   * nodeConstruct function, then passing in the NodePart from there into the
   * NodeConstructComponent for customization, after which the nodepart is inserted
   * into the current scope
   */
  async createNode(type: CType, position?: Coordinates) {
    if (this.props.host.constructNode) {
      const newNodePart = await this.props.host.constructNode(
        this.props.context,
        type
      );
      if (newNodePart) {
        newNodePart.position = position;
        this.props.context.medley.nodes.insertNode(observable(newNodePart));
      }
    } else {
      await this.createNodeFallback(type, position);
    }
  }

  private async createNodeFallback(type: CType, position?: Coordinates) {
    const medley = this.props.context.medley;
    const newNodePart: CNodePart = { type: type.name, name: "", position };
    // first construct/initialize the nodepart with nodeCreate if
    // available
    try {
      await medley.types.runExportFunction<NodeConstruct<CNodePart>>(
        type.name,
        constants.nodeConstruct,
        { ...this.props.context, node: newNodePart }
      );

      const ncf = await medley.types.getExportFunction<
        NodeConstruct<CNodePart>
      >(type.name, constants.nodeConstruct);
      if (ncf) {
        const doCreate = await ncf({
          ...this.props.context,
          node: newNodePart,
        });
        if (!doCreate) {
          return;
        }
      }
    } catch (e) {
      medley.logger.error(e);
      return;
    }
    // then further customize with NodeCreateComponent if available
    try {
      const ncc = await medley.types.getExportFunction<TNodeConstructComponent>(
        type.name,
        constants.NodeConstructComponent
      );
      if (ncc) {
        this.doCreateNodeComponent(ncc, newNodePart);
      } else {
        medley.nodes.insertNode(observable(newNodePart));
      }
    } catch (e) {
      medley.logger.error(e);
      return;
    }
  }

  private doCreateNodeComponent(
    NodeCreateComponent: TNodeConstructComponent,
    newNodePart: CNodePart
  ) {
    const props: TNodeConstructComponentProps = {
      context: { ...this.props.context, node: newNodePart },
      host: this.props.host,
      close: (create: boolean) => {
        if (create) {
          this.props.context.medley.nodes.insertNode(observable(newNodePart));
        } else {
          this.createComponent = null;
        }
        this.dialogStore.closeDialog();
      },
    };
    this.dialogStore.openDialog(() => <NodeCreateComponent {...props} />);
  }

  /**
   * open NodeEditComponent for the provided node
   */
  async editNode(node: CNode) {
    if (this.props.host.openNodeEdit) {
      await this.props.host.openNodeEdit(this.props.context, node);
    } else {
      await this.openNodeEditFallback(node);
    }
  }

  async openNodeEditFallback(node: CNode) {
    const medley = this.props.context.medley;
    try {
      const nec = await medley.types.getExportFunction<TNodeEditComponent>(
        node.type,
        constants.NodeEditComponent
      );
      if (nec) {
        this.doEditNodeComponent(nec, node);
      }
    } catch (e) {
      medley.logger.error(e);
      return;
    }
  }

  private doEditNodeComponent(
    NodeEditComponent: TNodeEditComponent,
    node: CNode
  ) {
    const props: TNodeEditComponentProps = {
      context: { ...this.props.context, node: node },
      host: this.props.host,
      close: () => {
        this.dialogStore.closeDialog();
      },
    };
    this.dialogStore.openDialog(() => <NodeEditComponent {...props} />);
  }  

  /**
   * removes the node from the current scope by either removing the link
   * if it is externally referenced via a scope link or removing the node
   * completely from the scope. Before it does so it passes the node to the
   * NodeDeleteComponent and then to the nodeDelete function
   */
  deleteNode(node: CNode) {}
}
