import { CMedley, CNF } from "@medley-js/common";
import { CompositeNode } from "../node";
import { inputTypeName } from "../scopedTypes/input/typeName";
import { outputTypeName } from "../scopedTypes/output/typeName";

export const nodeFunction: CNF<CompositeNode> = async (cntx) => {
  const compositeScope = cntx.compositeScope;

  // bridge child input nodes to composite node's input ports using node ids as port names
  prepareType(compositeScope, inputTypeName, ({ node }) => {
    return cntx.input({
      name: node.id,
    });
  });
  // output nodes returns port input, ensure type is present on scope
  prepareType(compositeScope, outputTypeName, ({ node, input }) => {
    return input({
      name: node.id,
    });
  });

  // should only have a single output node - lookup can/should be optimized
  const outputNode = compositeScope.nodes
    .getNodes()
    .filter((n) => n.type === outputTypeName)[0];

  if (outputNode) {
    return compositeScope.composer.runNode(outputNode.id);
  }
};

// adds/updates scoped types - avoids 'linking' to edit dependencies
function prepareType(
  compositeScope: CMedley,
  typeName: string,
  nodeFunction: CNF
) {
  const type = compositeScope.types.getType(typeName);
  if (type?.scope === compositeScope.scope) {
    // type exists on the current scope - update nodefunction
    type.exportMap = {
      ...type.exportMap,
      nodeFunctionName: async () => nodeFunction,
    };
  } else {
    // type doesn't exist on the current scope - create
    compositeScope.types.upsertType({
      scope: compositeScope.scope,
      name: typeName,
      version: "1.0.0",
      exportMap: {
        nodeFunctionName: async () => nodeFunction,
      },
    });
  }
}
