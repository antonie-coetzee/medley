import { Type } from "medley";

import * as exports from "./index";

export const IdentityType: Type = {
  name: "indentity",
  version: "1.0.0",
  module: { import: () => Promise.resolve(exports) },
};