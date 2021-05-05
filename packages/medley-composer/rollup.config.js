import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import html from "@rollup/plugin-html";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import replace from "@rollup/plugin-replace";
import alias from "@rollup/plugin-alias";

export default [
  {
    input: ["src/react-dom-wrapper.ts"],
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
    input: ["src/react-wrapper.ts"],
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
          //"process.env.NODE_ENV": JSON.stringify("production"),
        },
      }),
    ],
  },
  {
    input: ["src/material-ui-wrapper.ts"],
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
  // {
  //   input: ["src/vendor.ts"],
  //   treeshake: false,
  //   output: [
  //     {
  //       file: "dist/vendor/vendor.js",
  //       format: "es",
  //     },
  //   ],
  //   plugins: [
  //     nodeResolve({browser: true}),
  //     commonjs(),
  //     replace({
  //       preventAssignment: true,
  //       values: {
  //         "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  //       },
  //     }),
  //     postcss({
  //       extract: true,
  //       minimize: true,
  //       extensions: [".css"],
  //     }),
  //   ],
  // },  
  {
    input: ["src/app.tsx"],
    output: [
      {
        file: "dist/app.js",
        format: "es",
        paths: {
          "react": "/vendor/react.17.0.2.js",
          "react-dom": "/vendor/react-dom.17.0.2.js",
          "@material-ui/core": "/vendor/material-ui.4.11.4.js",
           //"react": "/vendor/vendor.js",
           //"react-dom": "/vendor/vendor.js",
           //"@material-ui/core": "/vendor/vendor.js",          
        },
      },
    ],
    external: ["react", "react-dom", "@material-ui/core"],
    plugins: [
      typescript(),
      replace({
        preventAssignment: true,
        values: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
          //"process.env.NODE_ENV": JSON.stringify("production"),
        },
      }),
      nodeResolve(),
      commonjs(),
      html({
        template({ attributes, bundles, files, publicPath, title }) {
          return `
          <html>
            <body>
              <div id="root"></div>
              <script type="module"src="app.js"></script>             
            </body>
          </html>
        `;
        },
      }),
      serve("dist"),
      livereload({
        watch: "dist",
        verbose: true,
      }),
    ],
  },
];
