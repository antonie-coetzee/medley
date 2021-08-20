export interface Node<Tvalue extends unknown = undefined> {
  type:string;
  id: string;
  cache?: boolean;
  name?: string;
  value?: Tvalue;
}