import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import url from "postcss-url";

const vendors = [
  {
    srcName: "material-ui-styles.ts",
    dstName: "material-ui-styles.4.11.4.js",
    external: ["react", "react-dom", "@material-ui/core"],
  },
  {
    srcName: "material-ui-icon.ts",
    dstName: "material-ui-icon-4.11.2.js",
    external: [
      "react",
      "react-dom",
      "@material-ui/core",
      "@material-ui/styles",
    ],
  },
  {
    srcName: "material-ui-lab.ts",
    dstName: "material-ui-lab.4.0.0-alpha.57.js",
    external: [
      "react",
      "react-dom",
      "@material-ui/core",
      "@material-ui/styles",
    ],
  },
  {
    srcName: "material-ui-core.ts",
    dstName: "material-core.4.11.4.js",
    external: ["react", "react-dom", "@material-ui/styles"],
  },
  {
    srcName: "react-dom.ts",
    dstName: "react-dom.17.0.2.js",
    external: ["react"],
  },
  {
    srcName: "react.ts",
    dstName: "react.17.0.2.js",
    external: [],
  },
  {
    srcName: "mobx.ts",
    dstName: "mobx.6.1.8.js",
    external: ["react"],
  },
  {
    srcName: "mobx-react.ts",
    dstName: "mobx-react.7.1.0.js",
    external: ["react", "mobx", "react-dom"],
  },
  {
    srcName: "medley.ts",
    dstName: "medley.1.0.0.js",
    external: [],
  },
];

const configs = vendors.map((v) => {
  return {
    input: [`src/vendor/${v.srcName}`],
    treeshake: false,
    output: [
      {
        file: `dist/vendor/${v.dstName}`,
        format: "system",
        sourcemap: true,
      },
    ],
    external: v.external,
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
  };
});

export default configs;
