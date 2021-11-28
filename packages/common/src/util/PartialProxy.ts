export function PartialProxy<T extends {}>(
  target: T,
  partialProxy: Partial<T>
) {
  let proxyHandler: ProxyHandler<T> = {};
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