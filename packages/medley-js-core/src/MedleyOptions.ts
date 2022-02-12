import { Composer } from "./Composer";
import { IdGenerator, Loader } from "./core";
import { MedleyTypes } from "./MedleyTypes";
import { LinkRepository, NodeRepository, TypeRepository } from "./repositories";
import { Links, Nodes, Types } from "./scoped";

export interface MedleyOptions<MT extends MedleyTypes = MedleyTypes> {
  loader?: Loader<NonNullable<MT["type"]>>;
  idGenerator?: IdGenerator;
  typeRepository?: TypeRepository<NonNullable<MT["type"]>>;
  nodeRepository?: NodeRepository<NonNullable<MT["node"]>>;
  linkRepository?: LinkRepository<NonNullable<MT["link"]>>;
  nodes?: Nodes<NonNullable<MT["node"]>>;
  types?: Types<NonNullable<MT["type"]>>;
  links?: Links<NonNullable<MT["link"]>>;
  composer?: Composer<MT>;
  scope?: string;
}
