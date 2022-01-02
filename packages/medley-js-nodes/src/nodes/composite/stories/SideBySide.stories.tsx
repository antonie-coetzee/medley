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
import { NodeType as CompositeType } from "..";
import { componentStory } from "../../../util/util.sb";
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
  const ecnContext = createEmptyCompositeNode(medley);
  const bcnContext = createBasicCompositeNode(ecnContext.compositeScope, [200, 200]);

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
            context={ecnContext}
            host={{executeCommand:(cmd)=>cmd.execute()}}
            close={() => {}}
          />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Box style={{ position: "absolute", padding: "5px" }}>Edit View</Box>
          <EditNodeComponent
            context={bcnContext}
            host={{executeCommand:(cmd)=>cmd.execute()}}
            close={() => {}}
          />
        </Paper>
      </Grid>
    </Grid>
  );
});
