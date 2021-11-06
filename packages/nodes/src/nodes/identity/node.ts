import { CNode, CPort } from "@medley-js/common";

export type IdentityNode = CNode & {
  value: {
    age?: string;
    slider?: number;
  };
};
