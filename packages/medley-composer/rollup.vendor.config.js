import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import micromatch from "micromatch";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import url from "postcss-url";

const vendors = [
  {
    srcName: "react-is.ts",
    dstName: "react-is.17.0.2.js",
    externals: ["react"]
  },
  {
    srcName: "react-dom.ts",
    dstName: "react-dom.17.0.2.js",
    externals: ["react"]
  },
  {
    srcName: "react.ts",
    dstName: "react.17.0.2.js",
  },
  {
    srcName: "mobx.ts",
    dstName: "mobx.6.1.8.js",
  },
  {
    srcName: "mobx-react.ts",
    dstName: "mobx-react.7.1.0.js",
    externals: ["react", "react-dom"]
  },
  {
    srcName: "medley.ts",
    dstName: "medley.1.0.0.js",
  },
  {
    srcName: "crypto-js.ts",
    dstName: "crypto-js.4.0.0.js"
  },
  {
    srcName: "material-ui-core.ts",
    dstName: "material-ui-core.4.11.4.js",
    externals: ["react", "react-dom", "@material-ui/core/styles", "@material-ui/styles"]
  },
  {
    srcName: "material-ui-core-styles.ts",
    dstName: "material-ui-core-styles.4.11.4.js",
    externals: ["react", "react-dom", "@material-ui/core", "@material-ui/styles"]
  },
  {
    srcName: "material-ui-styles.ts",
    dstName: "material-ui-styles.4.11.4.js",
    externals: ["react", "react-dom", "@material-ui/core", "@material-ui/core/styles"]
  }
];

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
    external:v.externals,
    plugins: [
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
