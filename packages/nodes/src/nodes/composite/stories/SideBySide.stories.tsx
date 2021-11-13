import React from "react";
import { Meta } from "@storybook/react";
import { Cache, Medley } from "@medley-js/core";
import {
  CLink,
  CNode,
  constants,
  CType,
  TEditNodeComponent,
} from "@medley-js/common";

import { CompositeType } from "../type";
import { InputType } from "../scopedTypes/input/type";
import { OutputType } from "../scopedTypes/output/type";
import { IdentityType } from "../../index";
import { componentStory } from "../../../util/util.sb";
import { observable } from "mobx";
import {
  addTypes,
  createBasicCompositeNode,
  createEmptyCompositeNode,
} from "./utils";
import { Box, Grid, Paper } from "@mui/material";

export default {
  title: "Nodes/Composite",
} as Meta;

export const SideBySide = componentStory(async () => {
  const medley = new Medley<CNode, CType, CLink>();
  addTypes(medley);
  const [ecn, cn] = createEmptyCompositeNode(medley);
  const [bcnScope, bcn] = createBasicCompositeNode(ecn, [200, 200]);

  const EditNodeComponent = await medley.types.getExportFunction<TEditNodeComponent>(
    CompositeType.name,
    constants.EditNodeComponent
  );
  return () => (
    <Grid container spacing={0.5}>
      <Grid item xs={6}>
        <Paper>
          <Box style={{position:"absolute", padding:"5px"}}>Node View</Box>
          <EditNodeComponent
            context={{
              logger: null,
              medley: ecn,
              node: cn,
            }}
            host={{}}
            close={null}
          />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Box style={{position:"absolute", padding:"5px"}}>Edit View</Box>
          <EditNodeComponent
            context={{
              logger: null,
              medley: bcnScope,
              node: bcn,
            }}
            host={{}}
            close={null}
          />
        </Paper>
      </Grid>
    </Grid>
  );
});
