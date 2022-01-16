import {
  CLink,
  CNode,
  CNodePart,
  constants,
  Coordinates,
  CType,
  EditNode,
  Host,
  NodeConstructor,
  TCreateNodeComponent,
  TCreateNodeComponentProps,
} from "@medley-js/common";
import { AnyLink, NodeContext, NodePartContext } from "@medley-js/core";
import { makeAutoObservable, observable } from "mobx";
import React, { ReactNode } from "react";
import { NodeStore } from ".";
import { DialogStore } from "./DialogStore";

export class EditStore {
  public createComponent: ReactNode | null = null;

  constructor(
    private host: Host,
    private dialogStore: DialogStore,
    private nodeStore: NodeStore
  ) {
    makeAutoObservable(this, { createComponent: observable.ref });
  }

  /**
   * adds an external node to the current scope, by adding a scope link that
   * references the node
   */
  addNode(node: CNode, position?: Coordinates) {}

  async addLink(newLink: AnyLink<CLink>) {
    return this.host.executeCommand({
      execute: async () => {
        this.nodeStore.compositeScope.links.upsertLink(newLink);
      },
      undo: async () => {
        this.nodeStore.compositeScope.links.deleteLink(newLink);
      },
    });
  }

  async removeLink(link: AnyLink<CLink>) {
    return this.host.executeCommand({
      execute: async () => {
        this.nodeStore.compositeScope.links.deleteLink(link);
      },
      undo: async () => {
        this.nodeStore.compositeScope.links.upsertLink(link);
      },
    });
  }

  async removeNode(node: CNode) {
    const links = this.nodeStore.compositeScope.links
      .getLinks()
      .filter((l) => l.source === node.id || l.target === node.id);
    return this.host.executeCommand({
      execute: async () => {
        for (const l of links) {
          this.nodeStore.compositeScope.links.deleteLink(l);
        }
        this.nodeStore.compositeScope.nodes.deleteNode(node.id);
      },
      undo: async () => {
        this.nodeStore.compositeScope.nodes.upsertNode(node);
        for (const l of links) {
          this.nodeStore.compositeScope.links.upsertLink(l);
        }
      },
    });
  }

  async moveNode(
    node: CNode,
    coords: Coordinates,
    updateView: () => Promise<void>
  ) {
    const previousPosition = node.position;
    return this.host.executeCommand({
      execute: async () => {
        node.position = coords;
        updateView();
      },
      undo: async () => {
        node.position = previousPosition;
        updateView();
      },
    });
  }

  /**
   * create a new node, by first executing its
   * CreateNode function, then passing in the NodePart from there into the
   * CreateNodeComponent for customization, after which the nodepart is inserted
   * into the current scope
   */
  async createNode(type: CType, position?: Coordinates) {
    await this.createNodeFallback(type, position);
  }

  private async hostInsertNodePart(nodePart: CNodePart<CNode>) {
    let node: CNode;
    this.host.executeCommand({
      execute: async () => {
        if (node) {
          //redo
          this.nodeStore.compositeScope.nodes.upsertNode(node);
        } else {
          node = this.nodeStore.compositeScope.nodes.insertNodePart<CNode>(
            nodePart
          );
        }
      },
      undo: async () => {
        if (node) {
          this.nodeStore.compositeScope.nodes.deleteNode(node.id);
        }
      },
    });
  }

  private async createNodeFallback(type: CType, position?: Coordinates) {
    const medley = this.nodeStore.compositeScope;
    const nodePart: CNodePart = { type: type.name, name: "", position };
    // first construct/initialize the nodepart with nodeCreate if
    // available
    try {
      const ncf = await medley.types.getExport<NodeConstructor<CNode>>(
        type.name,
        constants.nodeConstructor
      );
      if (ncf) {
        const doCreate = await ncf(
          new NodePartContext(this.nodeStore.compositeScope, nodePart)
        );
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
        this.hostInsertNodePart(nodePart);
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
    const cs = this.nodeStore.compositeScope;
    const props: TCreateNodeComponentProps = {
      context: new NodePartContext(this.nodeStore.compositeScope, nodePart),
      host: this.host,
      close: (create: boolean) => {
        if (create) {
          cs.nodes.insertNodePart<CNode>(nodePart);
        } else {
          this.createComponent = null;
        }
        this.dialogStore.closeDialog();
      },
    };
    this.dialogStore.openDialog(() => <CreateNodeComponent {...props} />);
  }

  async editNode(node: CNode, displayPopover?: (component: React.VFC) => void) {
    const medley = this.nodeStore.compositeScope;
    await medley.types.runExportFunction<EditNode>(
      node.type,
      constants.editNode,
      new NodeContext(medley, node),
      { ...this.host, displayPopover }
    );
  }
}
