import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "test/assets/Modules/moduleOne.ts",
    output: [
      {
        file: "test/fixtures/modules/moduleOne/moduleOne-esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "test/fixtures/modules/moduleOne/moduleOne-system.js",
        format: "system",
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript( { module: "esnext", target: "esnext" , tsconfig:"./test/assets/tsconfig.modules.json"}),
    ],
  },
  {
    input: "test/assets/Modules/moduleThree.ts",
    output: [
      {
        file: "test/fixtures/modules/moduleThree/moduleThree-esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "test/fixtures/modules/moduleThree/moduleThree-system.js",
        format: "system",
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript( { module: "esnext", target: "esnext" , tsconfig:"./test/assets/tsconfig.modules.json"}),
    ],
  },  
  {
    input: "test/assets/Modules/moduleFour.ts",
    output: [
      {
        file: "test/fixtures/modules/moduleFour/moduleFour-esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "test/fixtures/modules/moduleFour/moduleFour-system.js",
        format: "system",
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript( { module: "esnext", target: "esnext" , tsconfig:"./test/assets/tsconfig.modules.json"}),
    ],
  },   
  {
    input: "test/assets/Modules/moduleTwo.ts",
    output: [
      {
        file: "test/fixtures/modules/moduleTwo/moduleTwo-esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "test/fixtures/modules/moduleTwo/moduleTwo-system.js",
        format: "system",
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ module: "esnext", target: "esnext", tsconfig:"./test/assets/tsconfig.modules.json" }),
      copy({
        targets: [
          { src: "test/assets/Compositions/**", dest: "test/fixtures/compositions/" },
          { src: "test/assets/TypeMaps/**", dest: "test/fixtures/typemaps/" },
        ],
      }),
    ],
  },
];
