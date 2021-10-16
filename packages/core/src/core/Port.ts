export interface Port {
  name: string;
  required?:boolean;
  multiArity?: boolean;
  context?: {}
}

export type UniPort<TPort> = Port & {
  multiArity?:false;
}

export type MultiPort<TPort> = Port & {
  multiArity:true;
}
