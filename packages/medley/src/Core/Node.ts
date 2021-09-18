export interface Node<TValue extends unknown = unknown> {
  type: string;
  id: string;
  parent?: string;
  cache?: boolean;
  value?: TValue;
}
