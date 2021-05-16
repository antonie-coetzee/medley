import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import alias from '@rollup/plugin-alias';

export default [
  // {
  //   input: ["src/vendor/react-dom-wrapper.ts"],
  //   treeshake: false,
  //   output: [
  //     {
  //       file: "dist/vendor/react-dom.17.0.2.js",
  //       format: "es",
  //       paths: {
  //         "react": "/vendor/react.17.0.2.js",         
  //      },
  //     },
  //   ],
  //   external: ["react"],
  //   plugins: [
  //     typescript(),
  //     nodeResolve(),
  //     commonjs(),
  //     replace({
  //       preventAssignment: true,
  //       values: {
  //         "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  //       },
  //     }),
  //   ],
  // },
  // {
  //   input: ["src/vendor/react-wrapper.ts"],
  //   treeshake: false,
  //   output: [
  //     {
  //       file: "dist/vendor/react.17.0.2.js",
  //       format: "es",
  //     },
  //   ],
  //   plugins: [
  //     typescript(),
  //     nodeResolve(),
  //     commonjs(),
  //     replace({
  //       preventAssignment: true,
  //       values: {
  //         "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  //       },
  //     }),
  //   ],
  // },
  // {
  //   input: ["src/vendor/mobx-wrapper.ts"],
  //   treeshake: false,
  //   output: [
  //     {
  //       file: "dist/vendor/mobx.6.1.8.js",
  //       format: "es",
  //       paths: {
  //         "react": "/vendor/react.17.0.2.js",
  //       },
  //     },
  //   ],
  //   external: ["react"],
  //   plugins: [
  //     typescript(),
  //     nodeResolve(),
  //     commonjs(),
  //     replace({
  //       preventAssignment: true,
  //       values: {
  //         "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  //       },
  //     }),
  //   ],
  // },
  // {
  //   input: ["src/vendor/mobx-react-wrapper.ts"],
  //   treeshake: true,
  //   output: [
  //     {
  //       file: "dist/vendor/mobx-react.7.1.0.js",
  //       format: "es",
  //       paths: {
  //         "react": "/vendor/react.17.0.2.js",
  //         "mobx": "/vendor/mobx.6.1.8.js",
  //         "react-dom": "/vendor/react-dom.17.0.2.js",
  //       },
  //     },
  //   ],
  //   external: ["react", "mobx", "react-dom"],
  //   plugins: [
  //     typescript(),
  //     nodeResolve(),
  //     commonjs(),
  //     replace({
  //       preventAssignment: true,
  //       values: {
  //         "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  //       },
  //     }),
  //   ],
  // },
  {
    input: ["src/vendor/medley-wrapper.ts"],
    treeshake: true,
    output: [
      {
        file: "dist/vendor/medley.1.0.0.js",
        format: "es",
      },
    ],
    plugins: [
      alias({
        entries:[
          {find: '@medley', replacement:'../medley/dist/medley.js'}
        ]
      }),
      typescript(),
      nodeResolve(),
      commonjs(),
      replace({
        preventAssignment: true,
        values: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ],
  }            
];
