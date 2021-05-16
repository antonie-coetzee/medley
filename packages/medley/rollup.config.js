import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const production = false;

export default [
  {
    input: ["src/index.ts"],
    output: [
      {
        file: "dist/medley.js",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({ sourceMap: !production, inlineSources: !production }),
      nodeResolve(),
      commonjs()
    ],
  },
];
