import { Links, Nodes, Types } from "./scoped";
import { Composer } from "./Composer";
import { Loader, NonNullableType } from "./core";
import { MedleyTypes } from "./MedleyTypes";
import { LinkRepository, NodeRepository, TypeRepository } from "./repositories";

export interface MedleyOptions<
  MT extends MedleyTypes = MedleyTypes,
  M extends NonNullableType<MT> = NonNullableType<MT>
> {
  loader?: Loader<M["type"]>;
  typeRepository?: TypeRepository<M["type"]>;
  nodeRepository?: NodeRepository<M["node"]>;
  linkRepository?: LinkRepository<M["link"]>;
  nodes?: Nodes<M["node"]>;
  types?: Types<M["type"]>;
  links?: Links<M["link"]>;
  composer?: Composer<M>;
  scope?: string;
}
