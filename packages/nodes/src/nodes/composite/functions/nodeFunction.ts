import { NF, Input, Medley } from "@medley-js/core";
import { CompositeNode } from "../CompositeNode";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";

export const nodeFunction: NF<{}, CompositeNode> = async (cntx) => {
  const { node, medley, input } = cntx;
  
  const scopedInstance = Medley.getScopedInstance(medley.getRootInstance(), node.id);

  addInputType(scopedInstance, input);
  addOutputType(scopedInstance);

  const outputNode = scopedInstance.nodes.getNodesByType(OutputType.name)[0];
  if (outputNode) {
    const result = scopedInstance.runNode(cntx, outputNode.id);
    return result;
  }
};

function addInputType(scopedInstance: Medley, input: Input): void {
  const nodeFunction: NF<{}> = ({ node }) => {
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

function addOutputType(scopedInstance: Medley): void {
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
        }),
    },
  });
}
