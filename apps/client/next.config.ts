import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.env.TURBOPACK_ROOT || path.resolve(__dirname),
  },
  outputFileTracingRoot:
    process.env.OUTPUT_FILE_TRACING_ROOT || path.resolve(process.cwd()),
};

export default nextConfig;
