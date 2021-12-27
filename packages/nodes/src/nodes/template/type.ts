import { CType } from "@medley-js/common";
import * as exports from "./index";

export const TemplateType: CType = {
  name: "template",
  version: "1.0.0",
  import: () => Promise.resolve(exports),
};
