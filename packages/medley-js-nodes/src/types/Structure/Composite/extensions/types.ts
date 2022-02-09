import { CType } from "@medley-js/common";

export const onTypeUpsert = Symbol("onTypeUpsert");

declare module "@medley-js/core" {
  interface Types {
    [onTypeUpsert]?: (type:CType) => CType;
  }
}
