import { NF, Node, Input, Type, Medley, NodeFunction } from "@medley-js/core";
import { CompositeNode } from "../CompositeNode";

export const nodeFunction: NF<{}, CompositeNode> = async (cntx) => {
  const { node, medley, input } = cntx;
  const childScope = Medley.newChildInstance(medley.getRootInstance(), node.id);
  addInputType(childScope, input);
  addOutputType(childScope);

  const outputNodes = childScope.nodes.getNodesByType("$output");

  if (outputNodes && outputNodes.length > 0) {
    const outputNode = outputNodes[0];
    const result = childScope.runNode(cntx, outputNode.id);
    return result;
  }
};

function addInputType(childScope: Medley, input: Input): void {
  const nodeFunction: NF<
    {},
    Node<{
      input: string;
    }>
  > = ({ node }) => {
    return input({
      name: node.id,
    });
  };
  childScope.types.addType({
    name: "$input",
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
    name: "$output",
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
