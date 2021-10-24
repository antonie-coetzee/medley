import { WithRequired } from ".";
import { Scoped } from "./Scoped";

export interface Link extends Scoped {
  source: string;
  target: string;
  port?: string;
}

export type PortLink<L extends Link = Link> = WithRequired<L, "port">;
