const path = require("path");

module.exports = {
  content: [
    path.join(__dirname, "../../apps/client/**/*.{js,ts,jsx,tsx,mdx,svelte}"),
    path.join(__dirname, "../../packages/**/*.{js,ts,jsx,tsx,mdx,svelte}"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
