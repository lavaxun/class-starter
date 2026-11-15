import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is the student's file: stop `next dev` adding its "nextjs-agent-rules" block to it.
  agentRules: false,
};

export default nextConfig;
