import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";

const external = [
  "react-is",
  "react-dom",
  "react",
  "mobx",
  "mobx-react",
  "@medley-js/core",
  "notistack",
  "@material-ui/styles",
  "@material-ui/core",
  "@material-ui/icons",
  "@material-ui/lab",
  "@rjsf/material-ui",
  "@rjsf/core",
  "@material-ui/data-grid",
  "react-dnd",
];

export default [
  {
    input: "mpt/src/index.ts",
    output: [
      {
        file: "dist/mpt/mpt-esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/mpt/mpt-system.js",
        format: "system",
        sourcemap: true,
      },
    ],
    external,
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript(),
      postcss({
        extract: true,
        minimize: true,
        extensions: [".css"],
      }),
      replace({
        preventAssignment: true,
        values: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ],
  },
];
