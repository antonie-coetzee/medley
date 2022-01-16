import { Types, Unwrap } from "@medley-js/core";

declare module "@medley-js/core" {
  interface Types {
    runExportFunction: <TFunc extends (...args: any[]) => any>(
      typeName: string,
      exportName: string,
      ...args: Parameters<TFunc>
    ) => Promise<Unwrap<ReturnType<TFunc>>>;
  }
}

Types.prototype.runExportFunction = async function <
  TFunc extends (...args: any[]) => any
>(
  this: Types,
  typeName: string,
  exportName: string,
  ...args: Parameters<TFunc>
) {
  const exportFunc = await this.getExport<TFunc>(typeName, exportName);
  if (exportFunc == null) {
    return;
  }
  return exportFunc(...args);
};
