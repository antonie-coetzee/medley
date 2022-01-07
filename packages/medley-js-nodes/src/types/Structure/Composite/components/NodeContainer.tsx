import React, { useEffect } from "react";
import { NodeContext } from "@medley-js/core";
import { CMedleyTypes, CNode, TNodeComponent } from "@medley-js/common";
import { useUpdateNodeInternals } from "react-flow-renderer";
import { Box } from "@mui/system";
import { Card, CardContent, CardHeader } from "@mui/material";
import {
  DragIndicator,
  Close,
  HelpOutline,
  Refresh,
} from "@mui/icons-material";
import { Handle } from "@/lib/components";
import { CompositeNode } from "../node";
import { getStores, NodeStore } from "../stores";


export 