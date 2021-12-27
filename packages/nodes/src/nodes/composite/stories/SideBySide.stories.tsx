import {
  CLoader,
  CMedleyTypes,
  constants,
  TEditNodeComponent,
} from "@medley-js/common";
import { Medley, NodeContext } from "@medley-js/core";
import { Box, Grid, Paper } from "@mui/material";
import { Meta } from "@storybook/react";
import React from "react";
import { componentStory } from "../../../util/util.sb";
import { compositeScope } from "../CompositeNode";
import { CompositeType } from "../type";
import {
  addTypes,
  createBasicCompositeNode,
  createEmptyCompositeNode,
} from "./utils";

export default {
  title: "Nodes/Composite",
} as Meta;

export const SideBySide = componentStory(async () => {
  const medley = new Medley<CMedleyTypes>({ loader: new CLoader() });
  addTypes(medley);
  const cn = createEmptyCompositeNode(medley);
  const bcn = createBasicCompositeNode(cn[compositeScope]!, [200, 200]);

  const EditNodeComponent = await medley.types.getExport<TEditNodeComponent>(
    CompositeType.name,
    constants.EditNodeComponent
  );
  if (EditNodeComponent == null) {
    throw new Error("EditNodeComponent is undefined");
  }
  return () => (
    <Grid container spacing={0.5}>
      <Grid item xs={6}>
        <Paper>
          <Box style={{ position: "absolute", padding: "5px" }}>Node View</Box>
          <EditNodeComponent
            context={new NodeContext(medley, cn)}
            host={{}}
            close={() => {}}
          />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Box style={{ position: "absolute", padding: "5px" }}>Edit View</Box>
          <EditNodeComponent
            context={new NodeContext(medley, bcn)}
            host={{}}
            close={() => {}}
          />
        </Paper>
      </Grid>
    </Grid>
  );
});
