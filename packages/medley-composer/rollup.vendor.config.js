import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import url from "postcss-url";

export default [
  {
    input: ["src/vendor/material-ui-styles-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/material-ui-styles.4.11.4.js",
        format: "system"
      },
    ],
    external: ["react", "react-dom", "@material-ui/core"],
    plugins: [
      typescript(),
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
  },     
  {
    input: ["src/vendor/material-ui-icons-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/material-ui-icon-4.11.2.js",
        format: "system"
      },
    ],
    external: ["react", "react-dom", "@material-ui/core", "@material-ui/styles"],
    plugins: [
      typescript(),
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
  },   
  {
    input: ["src/vendor/material-ui-lab-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/material-ui-lab.4.0.0-alpha.57.js",
        format: "system"
      },
    ],
    external: ["react", "react-dom", "@material-ui/core", "@material-ui/styles"],
    plugins: [
      typescript(),
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
  },  
  {
    input: ["src/vendor/material-ui-core-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/material-core.4.11.4.js",
        format: "system"
      },
    ],
    external: ["react", "react-dom", "@material-ui/styles"],
    plugins: [
      typescript(),
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
  },  
  {
    input: ["src/vendor/react-dom-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/react-dom.17.0.2.js",
        format: "system"
      },
    ],
    external: ["react"],
    plugins: [
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
  },
  {
    input: ["src/vendor/react-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/react.17.0.2.js",
        format: "system",
      },
    ],
    plugins: [
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
  },
  {
    input: ["src/vendor/mobx-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/mobx.6.1.8.js",
        format: "system"
      },
    ],
    external: ["react"],
    plugins: [
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
  },
  {
    input: ["src/vendor/mobx-react-wrapper.ts"],
    treeshake: true,
    output: [
      {
        file: "dist/vendor/mobx-react.7.1.0.js",
        format: "system"
      },
    ],
    external: ["react", "mobx", "react-dom"],
    plugins: [
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
  },
  {
    input: ["src/vendor/medley-wrapper.ts"],
    treeshake: true,
    output: [
      {
        file: "dist/vendor/medley.1.0.0.js",
        format: "system",
      },
    ],
    plugins: [
      typescript(),
      nodeResolve(),
      commonjs(),
    ],
  }            
];
