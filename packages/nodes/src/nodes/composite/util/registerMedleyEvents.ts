import { EventType, MedleyEvent, NodeContext } from "@medley-js/core";
import {
  CLink,
  CNode,
  constants,
  CType,
  OnNodeCreate,
  OnNodeDelete,
  OnNodeUpdate,
} from "@medley-js/common";
import { CompositeNode } from "../node";

export function registerMedleyEvents(
  context: NodeContext<CompositeNode, CNode, CType, CLink>
) {
  // context.medley.nodes.addEventListener(
  //   EventType.OnItemCreate,
  //   async (e: MedleyEvent<CNode>) => {
  //     const node = e.data;
  //     if (node == null) {
  //       return;
  //     }
  //     try {
  //       context.medley.types.runExportFunction<OnNodeCreate<CNode>>(
  //         node.type,
  //         constants.onNodeCreate,
  //         { ...context, ...{ node } }
  //       );
  //     } catch (e) {
  //       context.logger.error(e);
  //     }
  //   }
  // );
  // context.medley.nodes.addEventListener(
  //   EventType.OnItemUpdate,
  //   async (e: MedleyEvent<CNode>) => {
  //     const node = e.data;
  //     if (node == null) {
  //       return;
  //     }
  //     try {
  //       context.medley.types.runExportFunction<OnNodeUpdate<CNode>>(
  //         node.type,
  //         constants.onNodeUpdate,
  //         { ...context, ...{ node } }
  //       );
  //     } catch (e) {
  //       context.logger.error(e);
  //     }
  //   }
  // );
  context.medley.nodes.addEventListener(
    EventType.OnItemDelete,
    async (e: MedleyEvent<CNode>) => {
      const node = e.data;
      if (node == null) {
        return;
      }
      try {
        context.medley.types.runExportFunction<OnNodeDelete<CNode>>(
          node.type,
          constants.onNodeDelete,
          { ...context, ...{ node } }
        );
      } catch (e) {
        context.logger.error(e);
      }
    }
  );
}
