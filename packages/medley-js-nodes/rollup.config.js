import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";

const external = [
  "react-is",
  "react-dom",
  "react",
  "mobx",
  "mobx-react",
  "@medley-js/core",
  "@medley-js/common",
  "@emotion/react",
  "@emotion/styled",
  "@mui/icons-material",
  "@mui/material",
];

export default [
  {
    input: "src/exportsMin.ts",
    output: [
      {
        file: "dist/nodes-min-esm.js",
        format: "es",
        sourcemap: true,
      }
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
      })
    ],
  },
  {
    input: "src/exports.ts",
    output: [
      {
        file: "dist/nodes-esm.js",
        format: "es",
        sourcemap: true,
      }
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
      })
    ],
  },
];
