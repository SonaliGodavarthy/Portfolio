import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The chat route reads this file at runtime; make sure it ships with the function.
  outputFileTracingIncludes: {
    "/api/chat": ["./knowledge_base.md"],
  },
};

export default nextConfig;
