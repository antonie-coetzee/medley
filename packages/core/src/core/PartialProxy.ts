import { HasParent } from "./utility";

export type PartialProxy<T> = Partial<T> & HasParent<T>;

export function wrapWithPartialProxy<T extends HasParent<T>>(
  target: T,
  partialProxy: PartialProxy<T>
) {
  let proxyHandler: ProxyHandler<T> = {};
  partialProxy.parent = target;
  proxyHandler.get = (targetObject, prop) => {
    const intercept = partialProxy[prop as keyof T];
    if (intercept) {
      return intercept;
    } else {
      return targetObject[prop as keyof T];
    }
  };
  return new Proxy(target, proxyHandler);
}

export {}