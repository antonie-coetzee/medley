import { CType } from "@medley-js/common";
import * as exports from "./exports";

export const TemplateType: CType = {
  name: "boolean",
  version: "1.0.0",
  import: () => Promise.resolve(exports),
};
