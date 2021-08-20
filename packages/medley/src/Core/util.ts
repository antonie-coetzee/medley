export const generateId = (length?:number) => {
  const alphanumeric =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const len = length ?? 10;
  var result = "";
  for (var i = 0; i < len; ++i) {
    result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  return result;
}