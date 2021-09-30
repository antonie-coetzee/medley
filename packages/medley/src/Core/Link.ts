import { Scoped } from "./Scoped";

export interface Link extends Scoped {
  source: string;
  target: string;
  port: string;
}
