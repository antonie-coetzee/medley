import { NF, Node, Input, Type } from "medley";
import { CompositeNode } from "./types";

export const nodeFunction: NF<{}, Node<{outputId:string}>> = (cntx) => {
  const { node, medley, input } = cntx;
  const childScope = medley.newChild({ parent: node.id });

  const inputType = getInputType(input);
  childScope.types.addType(inputType, true);
  const outputType = getOutputType();
  childScope.types.addType(outputType, true);
  
  if(node.value?.outputId){
    const outputId = node.value.outputId;
    const result = childScope.nodes.runNode(cntx, outputId);
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
    module: {
      import: () => Promise.resolve({
        nodeFunction,
      }),
    },
  };
}