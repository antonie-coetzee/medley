import { Scoped } from "./Scoped";

export interface Link extends Scoped {
  source: string;
  target: string;
  port?: string;
}

export type PortLink<TLink extends Link = Link> = TLink & { port: string };

export const isPortLink = (link: Link): link is PortLink => {
  return link.port !== undefined;
};
