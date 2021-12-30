const path = require("path");

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  babel: async options => ({
    ...options,
    presets: [
        ["@babel/preset-env", { shippedProposals: true }],
        "@babel/preset-typescript",
        ["@babel/preset-react", { runtime: "automatic" }],
    ],
    plugins: ["@babel/plugin-transform-typescript", ...options.plugins],
  }),
  webpackFinal: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "../src"),
		};
		return config;
	},
}