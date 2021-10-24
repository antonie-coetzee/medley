export type WithPartial<T, K extends keyof T> = Omit<T, K> & Partial<T>;
export type WithRequired<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Required<Pick<T, K>>;