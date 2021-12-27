import { CType } from "@medley-js/common";
import * as exports from "./index";

export const IdentityType: CType = {
  name: "identity",
  version: "1.0.0",
  import: () => Promise.resolve(exports),
};
