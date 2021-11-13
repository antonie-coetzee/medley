import { CNode } from "module/types";

export function setNodeMetaData<TMetaData>(
  node: CNode & { __getMetaData?: () => TMetaData },
  metaData: TMetaData,
  force?: boolean
) {
  if (node.__getMetaData && !force) {
    return;
  }
  node.__getMetaData = () => metaData;
}

export function getNodeMetaData<TMetaData>(node: CNode & { __getMetaData?: () => TMetaData }) {
  if (node.__getMetaData) {
    return node.__getMetaData();
  }
}

export function hasNodeMetaData<TMetaData>(node: CNode & { __getMetaData?: () => TMetaData }) {
  return node.__getMetaData ? true : false; 
}
