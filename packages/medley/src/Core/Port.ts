export interface Port {
  name: string;
  singleArity?: boolean;
  context?: {}
}

export type PortSingle<TPort> = Port & {
  singleArity?:true;
}

export type PortMultiple<TPort> = Port & {
  singleArity:false;
}
