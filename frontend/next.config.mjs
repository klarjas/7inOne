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

// The marketplace is served from public files. Explicitly require browsers
// and intermediary caches to revalidate these files after every deployment,
// so users do not keep an old HTML/CSS/JS bundle until they hard-refresh.
const revalidateHeaders = [
  { key: 'Cache-Control', value: 'no-cache, must-revalidate, proxy-revalidate' },
  { key: 'Pragma', value: 'no-cache' },
  { key: 'Expires', value: '0' },
];

const nextConfig = {
  poweredByHeader: false,
  deploymentId,
  async headers() {
    return [
      {
        source: '/marketplace',
        headers: revalidateHeaders,
      },
      {
        source: '/marketplace/:path(index.html|style.css|tailwind.css|app.js|i18n.js)',
        headers: revalidateHeaders,
      },
    ];
  },
};

export default nextConfig;
