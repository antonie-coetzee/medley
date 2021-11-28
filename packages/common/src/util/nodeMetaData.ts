import { CNode } from "types";

const metaDataKey = Symbol("nodeMetaData");

export function setNodeMetaData<TMetaData>(
  node: CNode & { [index:symbol]: TMetaData },
  metaData: TMetaData
) {
  node[metaDataKey] = metaData;
}

export function getNodeMetaData<TMetaData>(node: CNode & { [index:symbol]: TMetaData }) {
  return node[metaDataKey];
}

export function hasNodeMetaData<TMetaData>(node: CNode & { [index:symbol]: TMetaData }) {
  return node[metaDataKey] ? true : false; 
}
