import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase storage public URLs (project ref varies per deployment)
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
