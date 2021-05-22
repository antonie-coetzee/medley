import { Context } from "./Context";

export type ViewFunction = (cntx: Context, ...args: any[]) => Promise<any | undefined>;
