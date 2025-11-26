const lightningcss = require("postcss-lightningcss")

const isProduction = process.env.NODE_ENV === "production"

module.exports = {
  plugins: [
    require("@tailwindcss/postcss"),
    lightningcss({
      browsers: ["defaults", "maintained node versions"],
      lightningcssOptions: {
        minify: isProduction,
        drafts: {
          nesting: false,
          customMedia: false,
        },
      },
    }),
  ],
}
