import type { NextConfig } from "next";
import { createContentCollectionPlugin } from "@content-collections/next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.findmalek.com', 'image-cdn-fa.spotifycdn.com', 'image-cdn-ak.spotifycdn.co', 'image-cdn-ak.spotifycdn.com','mosaic.scdn.co', 'i.scdn.co'],
  },
};

const withPlugin = createContentCollectionPlugin({
  configPath: "./actions/content-collections.ts",
});
 
export default withPlugin(nextConfig);