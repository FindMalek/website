import type { NextConfig } from "next";
import { createContentCollectionPlugin } from "@content-collections/next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [16, 32, 40, 48, 64, 96, 128, 256],
    // Allows the hand-authored diagram at public/project/harmonia.svg to
    // go through next/image (used for the Harmonia project card) -- a
    // trusted, site-owned local asset, not third-party/remote content.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "www.findmalek.com" },
      { protocol: "https", hostname: "image-cdn-fa.spotifycdn.com" },
      { protocol: "https", hostname: "image-cdn-ak.spotifycdn.co" },
      { protocol: "https", hostname: "image-cdn-ak.spotifycdn.com" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "img.logo.dev" },
    ],
  },
  async redirects() {
    return [
      { source: "/work", destination: "/#work", permanent: true },
      { source: "/projects", destination: "/#projects", permanent: true },
      { source: "/stack", destination: "/#stack", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/contact", destination: "/", permanent: true },
    ]
  },
};

const withPlugin = createContentCollectionPlugin({
  configPath: "./actions/content-collections.ts",
});
 
export default withPlugin(nextConfig);