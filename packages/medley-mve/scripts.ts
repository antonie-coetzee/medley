import { ScriptsConfiguration } from "https://deno.land/x/velociraptor@1.0.0-beta.18/mod.ts";

export default <ScriptsConfiguration> {
  scripts: {
    format: "deno fmt",
    build: [
      "deno bundle ./mod.ts ./esmod.js",
      "deno run --allow-read --allow-write --unstable ./generateTypes.ts",
    ],
    test: "deno test --allow-net --allow-read",
  },
};
