import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "src/Modules/moduleOne.ts",
    output: [
      {
        file: "dist/modules/moduleOne/moduleOne-esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/modules/moduleOne/moduleOne-system.js",
        format: "system",
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ module: "esnext", target: "esnext" }),
    ],
  },
  {
    input: "src/Modules/moduleTwo.ts",
    output: [
      {
        file: "dist/modules/moduleTwo/moduleTwo-esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/modules/moduleTwo/moduleTwo-system.js",
        format: "system",
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ module: "esnext", target: "esnext" }),
      copy({
        targets: [
          { src: "Assets/Compositions/**", dest: "dist/compositions/" },
          { src: "Assets/TypeMaps/**", dest: "dist/typemaps/" },
        ],
      }),
    ],
  },
];
