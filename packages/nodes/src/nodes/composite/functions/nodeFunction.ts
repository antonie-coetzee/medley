import { CMedley, CMedleyTypes } from "@medley-js/common";
import { NF, Input, Medley } from "@medley-js/core";
import { CompositeNode } from "../CompositeNode";
import { newCompositeScope } from "../extensions";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";

export const nodeFunction: NF<CompositeNode, CMedleyTypes> = async (cntx) => {
  const { node, medley, input } = cntx;
  
  const scopedInstance = medley[newCompositeScope](node.id);

  addInputType(scopedInstance, input);
  addOutputType(scopedInstance);

  const outputNode = scopedInstance.nodes.getNodes().filter(n=>n.type === OutputType.name)[0];
  if (outputNode) {
    const result = scopedInstance.conductor.runNode(outputNode.id);
    return result;
  }
};

function addInputType(scopedInstance: CMedley, input: Input): void {
  const nodeFunction: NF = ({ node }) => {
    return input({
      name: node.id,
    });
  };
  scopedInstance.types.addType({
    name: InputType.name,
    version: "",
    volatile: true,
    module: {
      import: () =>
        Promise.resolve({
          nodeFunction,
        }),
    },
  });
}

function addOutputType(scopedInstance: CMedley): void {
  const nodeFunction: NF = ({ node, input }) => {
    return input({
      name: node.id,
    });
  };
  scopedInstance.types.addType({
    name: OutputType.name,
    version: "",
    volatile: true,
    module: {
      import: () =>
        Promise.resolve({
          nodeFunction,
        })
    }
  });
}
