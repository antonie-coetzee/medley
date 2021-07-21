import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import url from "postcss-url";

const vendors = [
  {
    srcName: "react-is.ts",
    dstName: "react-is.17.0.2.js",
    name: "react-is"
  },
  {
    srcName: "react-dom.ts",
    dstName: "react-dom.17.0.2.js",
    name: "react-dom"
  },
  {
    srcName: "react.ts",
    dstName: "react.17.0.2.js",
    name:"react"
  },
  {
    srcName: "mobx.ts",
    dstName: "mobx.6.1.8.js",
    name: "mobx"
  },
  {
    srcName: "mobx-react.ts",
    dstName: "mobx-react.7.1.0.js",
    name: "mobx-react"
  },
  {
    srcName: "medley.ts",
    dstName: "medley.1.0.0.js",
    name: "medley"
  },
  {
    srcName: "material-ui-core.ts",
    dstName: "material-ui-core.4.11.4.js",
    name: "@material-ui/core"
  },
  {
    srcName: "material-ui-core-styles.ts",
    dstName: "material-ui-core-styles.4.11.4.js",
    name: "@material-ui/core/styles"
  },
  {
    srcName: "material-ui-styles.ts",
    dstName: "material-ui-styles.4.11.4.js",
    name: "@material-ui/styles"
  },
  {
    srcName: "material-ui-icons.ts",
    dstName: "material-ui-icons.4.11.4.js",
    name: "@material-ui/icons"
  },
  {
    srcName: "material-ui-lab.ts",
    dstName: "material-ui-lab.4.0.0-alpha.57.js",
    name: "@material-ui/lab"
  },
  {
    srcName: "rjsf-material-ui.ts",
    dstName: "rjsf-material-ui.3.0.0.js",
    name: "@rjsf/material-ui",
  },
  {
    srcName: "rjsf-core.ts",
    dstName: "rjsf-core.3.0.0.js",
    name: "@rjsf/core",
  },  
];

const externals = vendors.map((v) => v.name);

function fixRjsfMaterialUiImports(){
  return {
    name: "replacor",
    transform(code,id){
      if(id.includes("material-ui.esm.js")){
        return code
          .replace(/import (\w*) from '@material-ui\/core\/(\1)';/g, "import {$1} from '@material-ui/core';")
          .replace(/import (\w*) from '@material-ui\/icons\/(\1)';/g, "import {$1} from '@material-ui/icons';");
      }
    }
  }
}

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
    external: externals.filter(e=>e !== v.name),
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
      }),
      fixRjsfMaterialUiImports(),
      typescript(),
      json(),
      nodeResolve({
        browser: true
      }),
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
    ],
  };
});

export default configs;
