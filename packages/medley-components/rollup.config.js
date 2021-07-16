import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";

export default [
  {
    input: "src/components/tester.tsx",
    output: [
      {
        file: "dist/tester-esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/tester-cjs.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
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
      }),],
  }
];
