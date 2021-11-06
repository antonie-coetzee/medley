import React from "react";
import { Meta } from "@storybook/react";
import { Cache, Medley } from "@medley-js/core";
import { CLink, CNode, constants, CType, TEditNodeComponent } from "@medley-js/common";

import { CompositeType } from "../type";
import { InputType } from "../scopedTypes/input/type";
import { OutputType } from "../scopedTypes/output/type";
import { IdentityType } from "../../index";
import { componentStory } from "../../../util/util.sb";
import { observable } from "mobx";
import {addTypes, createBasicCompositeNode, createEmptyCompositeNode} from "./utils"

export default {
  title: "Nodes/Composite",
} as Meta;

export const Node = componentStory(async () => {
  const medley = new Medley<CNode, CType, CLink>();
  addTypes(medley);
  const [ecn, cn] = createEmptyCompositeNode(medley)
  createBasicCompositeNode(ecn, [200,200])

  const EditNodeComponent = await medley.types.getExportFunction<TEditNodeComponent>(
    CompositeType.name,
    constants.EditNodeComponent
  );
  return () => (
    <EditNodeComponent
      context={{
        logger: null,
        medley: ecn,
        node: cn,
      }}
      host={{}}
      close={null}
    />
  );
});