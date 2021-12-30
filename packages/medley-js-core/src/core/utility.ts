export type NonNullableType<T> = {
  [Property in keyof T]: NonNullable<T[Property]>;
};

export type Writeable<T, K extends keyof T> = Omit<T, K> &
  { -readonly [P in K]: T[K] };

export type WithPartial<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type WithRequired<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Required<Pick<T, K>>;

export type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T;

export const generateId = (length?: number) => {
  const alphanumeric =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const len = length ?? 4;
  var result = "";
  for (var i = 0; i < len; ++i) {
    result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  return result;
};
