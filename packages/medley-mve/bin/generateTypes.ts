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
  .filter((k) => !k.startsWith("///"))
  .join("\n");

Deno.writeTextFile("./dist/medley.d.ts", output);
