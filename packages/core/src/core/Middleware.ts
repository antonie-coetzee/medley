export type Chainable<T> = { parent?: T }

export type Middleware<T> = Partial<T> & Chainable<T>;

export function chainMiddleware<T extends Chainable<T>>(
  parent: T,
  child: Middleware<T>
) {
  let childHandler: ProxyHandler<T> = {};
  child.parent = parent;
  childHandler.get = (parentObject, prop) => {
    const intercept = child[prop as keyof T];
    if (intercept) {
      return intercept;
    } else {
      return parentObject[prop as keyof T];
    }
  };
  return new Proxy(parent, childHandler);
}