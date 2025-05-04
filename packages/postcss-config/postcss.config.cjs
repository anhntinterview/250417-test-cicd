/* postcss.config.js */
const path = require("path");

module.exports = {
  parser: "postcss-scss",
  plugins: {
    "postcss-import": {},
    "postcss-nesting": {}, // or postcss-nested, choose one
    "postcss-simple-vars": {},
    "postcss-mixins": {},
    "postcss-conditionals": {},
    "postcss-functions": {},
    "postcss-map-get": {},
    "postcss-calc": {},
    "postcss-extend": {},
    "postcss-custom-media": {},
    "postcss-custom-properties": {},
    "postcss-preset-env": {
      features: { "nesting-rules": true },
    },
    "@tailwindcss/postcss": {
      config: path.join(__dirname, "tailwind.config.cjs"),
    }, // ✅ the correct plugin in v4
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
