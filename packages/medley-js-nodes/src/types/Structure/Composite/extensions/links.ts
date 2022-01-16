import { AnyLink } from "@medley-js/core";

export const onLinksChange = Symbol("onLinksChange");

declare module "@medley-js/core" {
  interface Link {
    [key: symbol]: unknown;
  }
  interface Links {
    [onLinksChange]?: () => void;
  }
}
