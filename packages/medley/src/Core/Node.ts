export interface Node<TValue extends unknown = undefined> {
  type: string;
  id: string;
  cache?: boolean;
  value?: TValue;
}
