import { NF, Input, Type, Node, Medley } from "@medley-js/core";

export const nodeFunction: NF<{}, Node<{ outputId: string }>> = (cntx) => {
  const { node, medley, input } = cntx;

  const childScope = Medley.getChildInstance(medley.getRootInstance(), node.id);

  const inputType = getInputType(input);
  childScope.types.addType(inputType);
  const outputType = getOutputType();
  childScope.types.addType(outputType);

  if (node.value?.outputId) {
    const outputId = node.value.outputId;
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
    if (node.value?.input) {
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
      import: () =>
        Promise.resolve({
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
      import: () =>
        Promise.resolve({
          nodeFunction,
        }),
    },
  };
}
