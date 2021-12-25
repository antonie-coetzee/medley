import { CMedley, CMedleyTypes } from "@medley-js/common";
import {
  NF,
  Input,
  Medley,
  nodeFunction as nodeFunctionName,
} from "@medley-js/core";
import { CompositeNode, input } from "../CompositeNode";
import { inputTypeName } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";

export const nodeFunction: NF<CompositeNode, CMedleyTypes> = async (cntx) => {
  const compositeScope = cntx.compositeScope;

  upsertInputType(compositeScope, cntx.input);
  addOutputType(compositeScope);

  const outputNode = compositeScope.nodes
    .getNodes()
    .filter((n) => n.type === OutputType.name)[0];
  if (outputNode) {
    const result = compositeScope.conductor.runNode(outputNode.id);
    return result;
  }
};

function upsertInputType(compositeScope: CMedley, input: Input): void {
  const nodeFunction: NF = ({ node }) => {
    return input({
      name: node.id,
    });
  };
  const inputType = compositeScope.types.getType(inputTypeName);
  if (inputType) {
    inputType.module.exportMap = {
      ...inputType.module.exportMap,
      nodeFunctionName: async () => nodeFunction,
    };
  } else {
    compositeScope.types.addType({
      name: inputTypeName,
      version: "1.0.0",
      module: {
        exportMap: {
          nodeFunctionName: async () => nodeFunction,
        }
      },
    });
  }
}

function addOutputType(compositeScope: CMedley): void {
  const nodeFunction: NF = ({ node, input }) => {
    return input({
      name: node.id,
    });
  };
  compositeScope.types.addType({
    ...OutputType,
    module: {
      import: () =>
        Promise.resolve({
          nodeFunction,
        }),
    },
  });
}
