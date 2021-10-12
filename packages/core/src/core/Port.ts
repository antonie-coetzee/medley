export interface Port {
  name: string;
  multiArity?: boolean;
  context?: {}
}

export type UniPort<TPort> = Port & {
  multiArity?:false;
}

export type MultiPort<TPort> = Port & {
  multiArity:true;
}
