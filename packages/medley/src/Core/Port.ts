export interface Port {
  name: string;
  singleArity?: boolean;
}

export interface TypedPort<TPort> extends Port {
  type?: TPort;
}
