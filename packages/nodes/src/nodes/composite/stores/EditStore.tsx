import {
  makeAutoObservable,
  observable,
} from "mobx";
import {
  CNode,
  CNodePart,
  constants,
  Coordinates,
  CreateNode,
  TEditNodeComponentProps,
  TCreateNodeComponent,
  TCreateNodeComponentProps,
  CType,
  TEditNodeComponent,
  Host,
  CMedleyTypes,
} from "@medley-js/common";
import { CompositeNode } from "../CompositeNode";
import { ReactNode } from "react";
import React from "react";
import { DialogStore } from "./DialogStore";
import { NodeContext } from "@medley-js/core";

export class EditStore {
  public createComponent: ReactNode | null = null;

  constructor(
    private context: NodeContext<CompositeNode, CMedleyTypes>,
    private host: Host,
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
   * CreateNode function, then passing in the NodePart from there into the
   * CreateNodeComponent for customization, after which the nodepart is inserted
   * into the current scope
   */
  async createNode(type: CType, position?: Coordinates) {
    if (this.host.constructNode) {
      const newNodePart = await this.host.constructNode(
        this.context,
        type
      );
      if (newNodePart) {
        newNodePart.position = position;
        this.context.medley.nodes.insertNode<CNode>(observable(newNodePart));
      }
    } else {
      await this.createNodeFallback(type, position);
    }
  }

  private async createNodeFallback(type: CType, position?: Coordinates) {
    const medley = this.context.medley;
    const nodePart: CNodePart = { type: type.name, name: "", position};
    // first construct/initialize the nodepart with nodeCreate if
    // available
    try {
      await medley.types.runExportFunction<CreateNode<CNode>>(
        type.name,
        constants.createNode,
        { ...this.context, nodePart }
      );

      const ncf = await medley.types.getExport<
        CreateNode<CNode>
      >(type.name, constants.createNode);
      if (ncf) {
        const doCreate = await ncf({
          ...this.context,
          nodePart,
        });
        if (!doCreate) {
          return;
        }
      }
    } catch (e) {
      medley.logger.error(e);
      return;
    }
    // then further customize with CreateNodeComponent if available
    try {
      const ncc = await medley.types.getExport<TCreateNodeComponent>(
        type.name,
        constants.CreateNodeComponent
      );
      if (ncc) {
        this.doCreateNodeComponent(ncc, nodePart);
      } else {
        medley.nodes.insertNode<CNode>(observable(nodePart));
      }
    } catch (e) {
      medley.logger.error(e);
      return;
    }
  }

  private doCreateNodeComponent(
    CreateNodeComponent: TCreateNodeComponent,
    nodePart: CNodePart
  ) {
    const props: TCreateNodeComponentProps = {
      context: { ...this.context, nodePart },
      host: this.host,
      close: (create: boolean) => {
        if (create) {
          this.context.medley.nodes.insertNode<CNode>(observable(nodePart));
        } else {
          this.createComponent = null;
        }
        this.dialogStore.closeDialog();
      },
    };
    this.dialogStore.openDialog(() => <CreateNodeComponent {...props} />);
  }

  /**
   * open EditNodeComponent for the provided node
   */
  async editNode(node: CNode) {
    if (this.host.openNodeEdit) {
      await this.host.openNodeEdit(this.context, node);
    } else {
      await this.openNodeEditFallback(node);
    }
  }

  async openNodeEditFallback(node: CNode) {
    const medley = this.context.medley;
    try {
      const nec = await medley.types.getExport<TEditNodeComponent>(
        node.type,
        constants.EditNodeComponent
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
    EditNodeComponent: TEditNodeComponent,
    node: CNode
  ) {
    const props: TEditNodeComponentProps = {
      context: { ...this.context, node: node },
      host: this.host,
      close: () => {
        this.dialogStore.closeDialog();
      },
    };
    this.dialogStore.openDialog(() => <EditNodeComponent {...props} />);
  }  

  /**
   * removes the node from the current scope by either removing the link
   * if it is externally referenced via a scope link or removing the node
   * completely from the scope. Before it does so it passes the node to the
   * NodeDeleteComponent and then to the nodeDelete function
   */
  deleteNode(node: CNode) {}
}
