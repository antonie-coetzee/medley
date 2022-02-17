import { Scoped } from "./Scoped";

export interface Type extends Scoped {
  primitive?: boolean;
  name: string;
}
