import { Link } from "@medley-js/core";

declare module "@medley-js/core" {
  interface Links {
    [key: symbol]: unknown;
  }
}
