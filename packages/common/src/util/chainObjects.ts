export function chainObjects<
  TParent extends {},
  TChild extends {} = Partial<TParent>
>(parent: TParent, child: TChild) {
  const chainObj = Object.assign({} as TParent, child);
  Object.setPrototypeOf(chainObj, parent);
  return chainObj;
}
