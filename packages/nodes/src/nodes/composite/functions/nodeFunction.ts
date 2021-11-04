import { NF, Input, Medley } from "@medley-js/core";
import { CompositeNode } from "../CompositeNode";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";

export const nodeFunction: NF<{}, CompositeNode> = async (cntx) => {
  const { node, medley, input } = cntx;
  
  const childScope = Medley.newChildInstance(medley.getRootInstance(), node.id);

  addInputType(childScope, input);
  addOutputType(childScope);

  const outputNode = childScope.nodes.getNodesByType(OutputType.name)[0];
  if (outputNode) {
    const result = childScope.runNode(cntx, outputNode.id);
    return result;
  }
};

function addInputType(childScope: Medley, input: Input): void {
  const nodeFunction: NF<{}> = ({ node }) => {
    return input({
      name: node.id,
    });
  };
  childScope.types.addType({
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

function addOutputType(childScope: Medley): void {
  const nodeFunction: NF = ({ node, input }) => {
    return input({
      name: node.id,
    });
  };
  childScope.types.addType({
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
