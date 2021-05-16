import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import image from "@rollup/plugin-image";
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
    input: ["src/index.tsx"],
    output: [
      {
        file: "dist/index.js",
        format: "es",
        sourcemap: true,
        paths: {
          "react": "/vendor/react.17.0.2.js",
          "mobx": "/vendor/mobx.6.1.8.js",
          "mobx-react": "/vendor/mobx-react.7.1.0.js",
          "react-dom": "/vendor/react-dom.17.0.2.js",
          "medley" : "/vendor/medley.1.0.0.js"
        }
      },
    ],
    external: [
      "react",
      "react-dom",
      "mobx",
      "mobx-react",
      "medley"
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
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#000000" />
              <meta
                name="description"
                content="Medley composer application"
              />
              <title>Medley Composer</title>
              <link rel="stylesheet" href="index.css">
            </head>
            <body>
              <noscript>You need to enable JavaScript to run this app.</noscript>
              <div id="root"></div>
              <script type="module"src="index.js"></script>        
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
