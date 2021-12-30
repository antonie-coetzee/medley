import { NonNullableType } from "./core";
import { MedleyTypes } from "./MedleyTypes";

export interface Graph<
  MT extends MedleyTypes = MedleyTypes,
  M extends NonNullableType<MT> = NonNullableType<MT>
> {
  types: M["type"][];
  nodes: M["node"][];
  links: M["link"][];
}
