import { Link } from "@medley-js/core";

export type CLink = Link & {
  position?: {
    x: number;
    y: number;
  };
};
