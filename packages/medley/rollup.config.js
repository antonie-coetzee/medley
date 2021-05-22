import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/medley-esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/medley-cjs.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [nodeResolve(), commonjs(), typescript()],
  },
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist/dts",
        format: "es",
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        outDir: "dist/dts",
        declarationDir: "dist/dts",
        emitDeclarationOnly: true,
        declaration:true
      }),
    ],
  },
  {
    input: "dist/dts/index.d.ts",
    output: [{ file: "dist/medley.d.ts", format: "es" }],
    plugins: [
      dts(),
      del({
        targets: "dist/dts",
        hook: "buildEnd",
      }),
    ],
  },
];
