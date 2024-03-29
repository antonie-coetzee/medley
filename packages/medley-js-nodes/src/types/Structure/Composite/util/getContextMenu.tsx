import { CMedleyTypes } from "@medley-js/common";
import { NodeContext } from "@medley-js/core";
import { ExitToApp } from "@mui/icons-material";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { Button, Chip, Divider, MenuItem } from "@mui/material";
import React from "react";
import { CompositeNode } from "../node";
import { InputType } from "../scopedTypes/input";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputType } from "../scopedTypes/output";
import { OutputNode } from "../scopedTypes/output/node";


function getAddInputNode(
  context: NodeContext<CompositeNode, CMedleyTypes>
): React.VFC<{ close: () => void; mouseX?: number; mouseY?: number }> {
  return ({ close, mouseX, mouseY }) => {
    const addInput = () => {
      const node = context.medley.nodes.insertNodePart<InputNode>({
        name: "INPUT",
        type: InputType.name,
        value: {},
      });
      if (mouseX && mouseY) {
        node.position = [mouseX, mouseY];
      }

      close();
    };
    return (
      <MenuItem onClick={addInput}>
        <Chip
          icon={<ExitToApp />}
          label="INPUT"
          color={"primary"}
          variant="outlined"
          style={{ borderWidth: "2px" }}
        />
      </MenuItem>
    );
  };
}

function getAddOutputNode(
  context: NodeContext<CompositeNode, CMedleyTypes>
): React.VFC<{ close: () => void; mouseX?: number; mouseY?: number }> {
  return ({ close, mouseX, mouseY }) => {
    const addOutput = () => {
      const node = context.medley.nodes.insertNodePart<OutputNode>({
        name: "OUTPUT",
        type: OutputType.name,
      });
      if (mouseX && mouseY) {
        node.position = [mouseX, mouseY];
      }

      close();
    };
    return (
      <MenuItem onClick={addOutput}>
        {" "}
        <Chip
          icon={<ExitToApp />}
          label="OUTPUT"
          color="secondary"
          variant="outlined"
          style={{ borderWidth: "2px" }}
        />
      </MenuItem>
    );
  };
}

function getRunOption(
  context: NodeContext<CompositeNode, CMedleyTypes>
): React.VFC<{ close: () => void; mouseX?: number; mouseY?: number }> {
  return ({ close, mouseX, mouseY }) => {
    const run = async () => {
      const rootInstance = context.medley;
      const nodes = rootInstance.nodes.getNodes();

      try {
        if (nodes == null || nodes.length === 0) {
          return;
        }
        const compositeNode = nodes[0];
        const res = await rootInstance.composer.runNodeExtended(
          compositeNode.id,
          {
            input: async () => "Test",
          }
        );
        console.log(res);
      } catch (e) {
        console.log(e);
      } finally {
        close();
      }
    };
    return (
      <MenuItem onClick={run}>
        <Button variant="contained" endIcon={<DirectionsRunIcon />}>
          Run
        </Button>
      </MenuItem>
    );
  };
}

export function getContextMenu(
  context: NodeContext<CompositeNode, CMedleyTypes>
) {
  return [
    getAddInputNode(context),
    getAddOutputNode(context),
    () => <Divider />,
    () => <Divider />,
    getRunOption(context),
  ];
}
