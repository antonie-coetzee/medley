import { Type } from "@medley-js/core";

import * as exports from "./index";

export const TemplateType: Type = {
  name: "template",
  version: "1.0.0",
  module: { import: () => Promise.resolve(exports) },
};
