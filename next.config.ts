import type { NextConfig } from "next";
import { createContentCollectionPlugin } from "@content-collections/next";

const nextConfig: NextConfig = {
  images: {
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