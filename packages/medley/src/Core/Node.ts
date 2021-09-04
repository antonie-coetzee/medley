export interface Node<TValue extends unknown = unknown> {
  type: string;
  id: string;
  cache?: boolean;
  value?: TValue;
}
