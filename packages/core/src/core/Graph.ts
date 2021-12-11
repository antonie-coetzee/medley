import { BaseTypes } from ".";

export interface Graph<BT extends BaseTypes = BaseTypes> {
  types: NonNullable<BT["type"]>[];
  nodes: NonNullable<BT["node"]>[];
  links: NonNullable<BT["link"]>[];
}
