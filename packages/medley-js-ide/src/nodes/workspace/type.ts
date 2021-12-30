import { Type } from "@medley-js/core";

import * as exports from "./index";

export const WorkspaceType: Type = {
  name: "workspace",
  version: "1.0.0",
  module: { import: () => Promise.resolve(exports) },
};
