import { Type } from "medley";

import * as typeExports from "./index";

export const compositeType: Type = {
  name: "composite",
  composite: true,
  version: "1.0.0",
  module: { import: () => Promise.resolve(typeExports) },
};
