import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import micromatch from "micromatch";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import url from "postcss-url";
import wildcardExternal from "@oat-sa/rollup-plugin-wildcard-external";

const destPrefix = "/vendor/";

const vendors = [
  {
    srcName: "react-is.ts",
    dstName: "react-is.17.0.2.js",
    importPattern: "react-is"
  },
  {
    srcName: "rjsf-core.ts",
    dstName: "rjsf-core.3.0.0.js",
    importPattern: "@rjsf/core"
  },
  {
    srcName: "rjsf-material-ui.ts",
    dstName: "rjsf-material-ui.3.0.0.js",
    importPattern: "@rjsf/material-ui"
  },
  {
    srcName: "crypto-js.ts",
    dstName: "crypto-js.4.0.0.js",
    importPattern: "crypto"
  },
  {
    srcName: "material-ui-styles.ts",
    dstName: "material-ui-styles.4.11.4.js",
    importPattern: "@material-ui/styles"
  },
  {
    srcName: "material-ui-icon.ts",
    dstName: "material-ui-icon-4.11.2.js",
    importPattern: "@material-ui/icons"
  },
  {
    srcName: "material-ui-lab.ts",
    dstName: "material-ui-lab.4.0.0-alpha.57.js",
    importPattern: "@material-ui/lab"
  },
  {
    srcName: "material-ui-core.ts",
    dstName: "material-core.4.11.4.js",
    importPattern: "@material-ui/core"
  },
  {
    srcName: "react-dom.ts",
    dstName: "react-dom.17.0.2.js",
    importPattern: "react-dom",
  },
  {
    srcName: "react.ts",
    dstName: "react.17.0.2.js",
    importPattern: "react",
  },
  {
    srcName: "mobx.ts",
    dstName: "mobx.6.1.8.js",
    importPattern: "mobx",
  },
  {
    srcName: "mobx-react.ts",
    dstName: "mobx-react.7.1.0.js",
    importPattern: "mobx-react",
  },
  {
    srcName: "medley.ts",
    dstName: "medley.1.0.0.js",
    importPattern: "medley",
  },
];

const numBuilds = vendors.length;
let buildIndex = 0;
const externalMappings = new Map();
const importMappings = new Map();
vendors.forEach((vn) => {
  if(vn.importPattern) {
    importMappings.set(vn.importPattern, destPrefix + vn.dstName);
    importMappings.set(vn.importPattern + "/**", destPrefix + vn.dstName);
  }
});

console.log(importMappings);

for( const [key,value] of importMappings.entries()){
  console.log("\"" + key + "\",");
}

const externalsMapper = (ignorePatterns = []) => ({
  name: "externals-mapper",
  /**
   * Rollup resolveId function
   * @param {string} source imported module name that should check
   * @param {string} importer importer module name
   * @returns {string | false | null | object} module definition
   */
  resolveId(source, importer) {
    if (importer == null) {
      return null;
    }

    for (const [ip, path] of importMappings.entries()) {
      if(ignorePatterns.indexOf(ip) >= 0){
        continue;
      }
      if (micromatch.isMatch(source, ip)) {
        externalMappings.set(source, path);
        return {
          id: source,
          external: true,
          moduleSideEffects: true,
        };
      }
    }
    return null; // other ids should be handled as usually
  },
  closeBundle() {
    if (numBuilds == ++buildIndex) {
      const importMap = {};
      externalMappings.forEach((value, key) => {
        importMap[key] = value;
      });
      vendors.forEach((value) => {
        const importPath = importMappings.get(value.importPattern);
        if(importPath){
          importMap[value.importPattern] = importPath;
        }      
      });
      console.log(JSON.stringify(importMap, null, 1));
    }
  },
});

const configs = vendors.map((v) => {
  return {
    input: [`src/vendor/${v.srcName}`],
    treeshake: false,
    output: [
      {
        file: `dist/vendor/${v.dstName}`,
        format: "system",
        sourcemap: true,
      },
    ],
    //externals:v.external,
    plugins: [
      externalsMapper([v.importPattern, v.importPattern + "/**"]),
      //wildcardExternal(v.external),
      typescript(),
      json(),
      nodeResolve(),
      commonjs(),
      postcss({
        extract: true,
        minimize: true,
        plugins: [
          url({
            url: "inline",
          }),
        ],
        extensions: [".css"],
      }),
      replace({
        preventAssignment: true,
        values: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ],
  };
});

export default configs;
