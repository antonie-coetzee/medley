import * as types from "@/types";
import { CMedleyTypes, Coordinates, CType } from "@medley-js/common";
import { Medley, NodeContext } from "@medley-js/core";
import { CompositeType } from "..";
import "../extensions/medley";
import { CompositeNode } from "../node";
import { InputType } from "../scopedTypes/input";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputType } from "../scopedTypes/output";
import { OutputNode } from "../scopedTypes/output/node";

export const addTypes = (medley: Medley<CMedleyTypes>) => {
  const typesObj: { [key: string]: CType } = types;
  for (const typeKey in typesObj) {
    medley.types.upsertType(typesObj[typeKey]);
  }
};

export const createEmptyCompositeNode = (medley: Medley<CMedleyTypes>) => {
  const compositeNode = medley.nodes.insertNodePart<CompositeNode>({
    name: "empty_composite",
    type: CompositeType.name,
  });

  const cNodeContext = new NodeContext<CompositeNode, CMedleyTypes>(
    medley,
    compositeNode
  );
  const cs = cNodeContext.compositeScope;

  cs.nodes.insertNodePart<OutputNode>({
    name: "OUTPUT",
    position: [600, 200],
    type: OutputType.name,
  });
  return cNodeContext;
};

export const createBasicCompositeNode = (
  medley: Medley<CMedleyTypes>,
  position?: Coordinates
) => {
  const compositeNode = medley.nodes.insertNodePart<CompositeNode>({
    name: "Basic Composite",
    type: CompositeType.name,
    position: position,
  });

  const cNodeContext = new NodeContext<CompositeNode, CMedleyTypes>(
    medley,
    compositeNode
  );
  const cs = cNodeContext.compositeScope;

  const id_1 = cs.nodes.insertNodePart<InputNode>({
    name: "input 1",
    position: [0, 50],
    type: InputType.name,
    value: { color: "green" },
  });

  const id_2 = cs.nodes.insertNodePart<InputNode>({
    name: "input 2",
    position: [0, 100],
    type: InputType.name,
    value: { color: "red" },
  });

  const id_3 = cs.nodes.insertNodePart<OutputNode>({
    name: "OUTPUT",
    position: [500, 50],
    type: OutputType.name,
  });

  return cNodeContext;
};
