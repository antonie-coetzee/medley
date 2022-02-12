export type IdGenerator = (idLookup: (id: string) => boolean) => string;

export const defaultIdGenerator: IdGenerator = (idLookup) => {
  const maxItterations = 10;
  let newId: string;
  for (let ittr = 0; ittr < maxItterations; ittr++) {
    newId = generateId();
    if (idLookup(newId) === false) {
      return newId;
    }
  }
  throw new Error("unable to generate unique id");
};

const generateId = (length?: number) => {
  const alphanumeric =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const len = length ?? 4;
  var result = "";
  for (var i = 0; i < len; ++i) {
    result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  return result;
};
