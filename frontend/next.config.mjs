/** @type {import('next').NextConfig} */

// Render exposes the source commit for each deployment. Use it as a stable,
// deployment-specific identifier so Next.js can detect stale client bundles
// and force a full reload instead of mixing assets from different builds.
const rawDeploymentId =
  process.env.RENDER_GIT_COMMIT ||
  process.env.NEXT_DEPLOYMENT_ID ||
  'local';

const deploymentId = rawDeploymentId
  .replace(/[^a-zA-Z0-9_-]/g, '')
  .slice(0, 32) || 'local';

const nextConfig = {
  poweredByHeader: false,
  deploymentId,
};

export default nextConfig;
