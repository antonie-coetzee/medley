import { Scoped } from "./Scoped";

export interface Link extends Scoped {
  source: string;
  target: string;
}

export type PortLink<TLink extends Link = Link> = TLink & {
  port:string;
}

export type AnyLink<TLink extends Link = Link> = TLink | PortLink<TLink>;

export const isPortLink = (link: Link): link is PortLink => {
  return (link as PortLink).port !== undefined;
};
