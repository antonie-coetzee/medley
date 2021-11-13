import { Type } from "@medley-js/core";

import * as exports from "./index";

export const TemplateType: Type = {
  name: "template",
  composite: true,
  version: "1.0.0",
  module: { import: () => Promise.resolve(exports) },
};
