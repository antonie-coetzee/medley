import { MedleyTypes } from "./MedleyTypes";

export interface Graph<MT extends MedleyTypes = MedleyTypes> {
  types: NonNullable<MT["type"]>[];
  nodes: NonNullable<MT["node"]>[];
  links: NonNullable<MT["link"]>[];
}
