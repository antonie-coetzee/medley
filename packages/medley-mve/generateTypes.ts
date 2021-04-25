const typings = await Deno.emit("./mod.ts", {
  compilerOptions: {
    "declaration": true,
    "emitDeclarationOnly": true,
  },
});

const keys = Object.keys(typings.files);
const medleyTypings = keys.filter((k) => k.includes("medley-mve/src"));

let typingBundle = "";
for (const fileKey of medleyTypings) {
  typingBundle += typings.files[fileKey];
}

const output = typingBundle
  .split("\n")
  .filter((k) => !k.includes("import {"))
  .filter((k) => !k.includes("export *"))
  .join("\n");

Deno.writeTextFile("./mod.d.ts", output);
