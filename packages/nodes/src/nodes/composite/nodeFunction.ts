import { NF, Node, Input, Type, Medley, NodeFunction } from "@medley-js/core";
import { CompositeNode } from "./node";

export const nodeFunction: NF<{}, CompositeNode> = (cntx) => {
  const { node, medley, input } = cntx;
  const childScope = Medley.newChildInstance(medley.getRootInstance(), node.id);
  const inputType = getInputType(input);
  childScope.types.addType(inputType);
  const outputType = getOutputType();
  childScope.types.addType(outputType);

  if(node.value?.outputNode){
    const outputId = node.value.outputNode.id;
    const result = childScope.runNode(cntx, outputId);
    return result;
  }
};

function getInputType(input: Input): Type {
  const nodeFunction: NF<
    {},
    Node<{
      input: string;
    }>
  > = ({ node }) => {
    if(node.value?.input){
      return input({
        name: node.value.input,
      });
    }
  };

  return {
    name: "$input",
    version: "",
    volatile: true,
    module: {
      import: () => Promise.resolve({
        nodeFunction,
      }),
    },
  };
}

function getOutputType(): Type {
  const nodeFunction: NF = ({ input }) => {
    return input({
      name: "output",
    });
  };

  return {
    name: "$output",
    version: "",
    volatile: true,
    module: {
      import: () => Promise.resolve({
        nodeFunction,
      }),
    },
  };
}