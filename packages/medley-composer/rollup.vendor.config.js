import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import replace from "@rollup/plugin-replace";

export default [
  {
    input: ["src/vendor/react-dom-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/react-dom.17.0.2.js",
        format: "es",
        paths: {
          "react": "/vendor/react.17.0.2.js",         
       },
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
        format: "es",
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
        format: "es",
        paths: {
          "react": "/vendor/react.17.0.2.js",
          "react-dom": "/vendor/react-dom.17.0.2.js",
        },
      },
    ],
    external: ["react", "react-dom"],
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
    treeshake: false,
    output: [
      {
        file: "dist/vendor/mobx-react.7.1.0.js",
        format: "es",
        paths: {
          "react": "/vendor/react.17.0.2.js",
          "react-dom": "/vendor/react-dom.17.0.2.js",
          "mobx": "/vendor/mobx.6.1.8.js",
        },
      },
    ],
    external: ["react", "react-dom", "mobx"],
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
    input: ["src/vendor/material-ui-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/material-ui.4.11.4.js",
        format: "es",
        paths: {
          "react": "/vendor/react.17.0.2.js",
          "react-dom": "/vendor/react-dom.17.0.2.js",
        },
      },
    ],
    external: ["react", "react-dom"],
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
      postcss({
        extract: true,
        minimize: true,
        extensions: [".css"],
      }),
    ],
  },
  {
    input: ["src/vendor/material-ui-lab-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/material-ui-lab.4.0.0.js",
        format: "es",
        paths: {
          "react": "/vendor/react.17.0.2.js",
          "react-dom": "/vendor/react-dom.17.0.2.js",
          "@material-ui/core": "/vendor/material-ui.4.11.4.js",  
        },
      },
    ],
    external: ["react", "react-dom", /@material-ui\/core/],
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
      postcss({
        extract: true,
        minimize: true,
        extensions: [".css"],
      }),
    ],
  },
  {
    input: ["src/vendor/material-ui-icons-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/material-ui-icons.4.11.2.js",
        format: "es",
        paths: {
          "react": "/vendor/react.17.0.2.js",
          "@material-ui/core/utils": "/vendor/material-ui.4.11.4.js",
          "react-dom": "/vendor/react-dom.17.0.2.js",
          "@material-ui/core": "/vendor/material-ui.4.11.4.js",  
        },
      },
    ],
    external: ["react", "react-dom", /@material-ui\/core/, "@material-ui/core/utils"],
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
      postcss({
        extract: true,
        minimize: true,
        extensions: [".css"],
      }),
    ],
  },     
  {
    input: ["src/vendor/flexlayout-react-wrapper.ts"],
    treeshake: false,
    output: [
      {
        file: "dist/vendor/flexlayout-react.0.5.5.js",
        format: "es",
        paths: {
          "react": "/vendor/react.17.0.2.js",
          "react-dom": "/vendor/react-dom.17.0.2.js",
        },
      },
    ],
    external: ["react", "react-dom"],
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
  }
];
