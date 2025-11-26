/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
  typedRoutes: true,
  // Allow Turbopack to load platform-specific Lightning CSS bindings as native externals.
  serverExternalPackages: [
    "lightningcss",
    "lightningcss-darwin-x64",
    "lightningcss-darwin-arm64",
    "lightningcss-linux-x64-gnu",
    "lightningcss-linux-x64-musl",
    "lightningcss-linux-arm-gnueabihf",
    "lightningcss-linux-arm64-gnu",
    "lightningcss-linux-arm64-musl",
    "lightningcss-win32-x64-msvc",
    "lightningcss-win32-arm64-msvc",
    "lightningcss-freebsd-x64",
    "lightningcss-android-arm64",
  ],
}

module.exports = nextConfig
