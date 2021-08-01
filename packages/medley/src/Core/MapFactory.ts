export const enum MapType {
  LinkSource,
  LinkTarget,
  Type,
  Node,
}

export type MapFactory = <K, V>(mapType: MapType) => Map<K, V>;
