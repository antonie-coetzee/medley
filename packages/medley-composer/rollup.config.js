import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import html from "@rollup/plugin-html";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import replace from "@rollup/plugin-replace";
import url from "postcss-url";

const production = false;

export default [
  {
    treeshake: false,
    input: ["src/index.tsx"],
    output: [
      {
        file: "dist/index.js",
        format: "system",
        sourcemap: true,
      },
    ],
    external: [
      "react",
      "react-dom",
      "mobx",
      "mobx-react",
      "medley",
      "@material-ui/core",
      //"@material-ui/styles",
      //"@material-ui/core/CssBaseline",
      //"@material-ui/core/utils",
      "@material-ui/icons",
      "@material-ui/lab"
    ],
    plugins: [
      image(),
      typescript({ sourceMap: !production, inlineSources: !production }),
      replace({
        preventAssignment: true,
        values: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
      }),
      json(),
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
      html({
        template({ attributes, bundles, files, publicPath, title }) {
          return `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta name="importmap-type" content="systemjs-importmap" />
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#000000" />
              <meta
                name="description"
                content="Medley composer application" 
              />
              <title>Medley Composer</title>
              <link rel="stylesheet" href="index.css">
              <script type="systemjs-importmap">
              {
                "imports": {
                  "crypto": "/vendor/crypto-js.4.0.0.js",
                  "react": "/vendor/react.17.0.2.js",
                  "react-dom": "/vendor/react-dom.17.0.2.js",
                  "mobx": "/vendor/mobx.6.1.8.js",
                  "mobx-react": "/vendor/mobx-react.7.1.0.js",
                  "medley": "/vendor/medley.1.0.0.js",
                  "@material-ui/core": "/vendor/material-core.4.11.4.js",
                  "@material-ui/icons": "/vendor/material-ui-icon-4.11.2.js",
                  "@material-ui/lab": "/vendor/material-ui-lab.4.0.0-alpha.57.js",
                  "@material-ui/styles": "/vendor/material-ui-styles.4.11.4.js"
                }
              }
            </script>
            <script src="https://cdn.jsdelivr.net/npm/systemjs/dist/system.js"></script>   
            <script
              type="text/javascript"
              src="https://cdn.jsdelivr.net/npm/import-map-overrides/dist/import-map-overrides.js"
            ></script>           
            </head>
            <body>
              <noscript>You need to enable JavaScript to run this app.</noscript>
              <div id="root"></div>
              <script type="systemjs-module" src="index.js"></script>    
              <import-map-overrides-full
                show-when-local-storage="devtools"
              ></import-map-overrides-full>                 
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
