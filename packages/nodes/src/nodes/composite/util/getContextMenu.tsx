import { NodeContext } from "@medley-js/core";
import {
  CLink,
  CNode,
  CNodePart,
  constants,
  CType,
  NodeCreate
} from "@medley-js/common";
import React from "react";
import { CompositeNode } from "../CompositeNode";
import { Connection, Edge, Node as RFNode } from "react-flow-renderer";
import { Button, Chip, Divider, ListItemIcon, MenuItem } from "@mui/material";
import { InputType } from "../terminals/input/type";
import { ExitToApp, Info } from "@mui/icons-material";
import { OutputType } from "../terminals/output/type";
import { IdentityType } from "../../identity/type";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

function getAddInputNode(
  context: NodeContext<CompositeNode, CNode, CType, CLink>
): React.VFC<{ close: () => void; mouseX?: number; mouseY?: number }> {
  return ({ close, mouseX, mouseY }) => {
    const addInput = () => {
      const node = context.medley.nodes.insertNode({
        name: "INPUT",
        type: InputType.name,
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
  context: NodeContext<CompositeNode, CNode, CType, CLink>
): React.VFC<{ close: () => void; mouseX?: number; mouseY?: number }> {
  return ({ close, mouseX, mouseY }) => {
    const addOutput = () => {
      const node = context.medley.nodes.insertNode({
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

function getAddIdentityNode(
  context: NodeContext<CompositeNode, CNode, CType, CLink>
): React.VFC<{ close: () => void; mouseX?: number; mouseY?: number }> {
  return ({ close, mouseX, mouseY }) => {
    const addIdentity = async () => {
      const identityNode: Omit<CNode, "id"> = {
        name: "Identity",
        type: IdentityType.name,
      }
      try {
        identityNode.value = await context.medley.types.runExportFunction<NodeCreate<CNodePart>>(
          IdentityType.name,
          constants.nodeCreate,
          { ...context}
        );
      } catch (e) {
        context.logger.error(e);
        return
      }
      const node = context.medley.nodes.insertNode(identityNode);
      if (mouseX && mouseY) {
        node.position = [mouseX, mouseY];
      }
      close();
    };
    return (
      <MenuItem onClick={addIdentity}>
        {" "}
        <Chip
          icon={<Info />}
          label="Identity"
          color="primary"
          variant="outlined"
          style={{ borderWidth: "2px" }}
        />
      </MenuItem>
    );
  };
}

function getRunOption(
  context: NodeContext<CompositeNode, CNode, CType, CLink>
): React.VFC<{ close: () => void; mouseX?: number; mouseY?: number }> {
  return ({ close, mouseX, mouseY }) => {
    const run = async () => {
      const rootInstance = context.medley.getRootInstance();
      const nodes = rootInstance.nodes.getNodes();

      try {
        if (nodes == null || nodes.length === 0) {
          return;
        }
        const compositeNode = nodes[0];
        const res = await rootInstance.runNodeWithInputs(
          null,
          compositeNode.id,
          { input: async () => "Test" }
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
  context: NodeContext<CompositeNode, CNode, CType, CLink>
) {
  return [
    getAddInputNode(context),
    getAddOutputNode(context),
    () => <Divider />,
    getAddIdentityNode(context),
    () => <Divider />,
    getRunOption(context),
  ];
}
