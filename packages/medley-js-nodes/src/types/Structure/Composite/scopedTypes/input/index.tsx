import { CType } from "@medley-js/common";
import * as exports from "./exports";
import { inputTypeName } from "./typeName";

export const InputType: CType = {
  name: inputTypeName,
  version: "1.0.0",
  volatile: true,
  primitive: true,
  import: () => Promise.resolve(exports),
};
