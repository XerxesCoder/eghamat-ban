/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      /*       {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              connect-src 'self' https://mint-chimp-59.clerk.accounts.dev https://*.clerk.accounts.dev;
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://mint-chimp-59.clerk.accounts.dev https://*.clerk.accounts.dev;
              img-src 'self' https://images.clerk.dev;
              frame-src 'self' https://mint-chimp-59.clerk.accounts.dev https://*.clerk.accounts.dev;
              style-src 'self' 'unsafe-inline';
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      }, */
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              connect-src 'self' https://mint-chimp-59.clerk.accounts.dev https://*.clerk.accounts.dev;
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://mint-chimp-59.clerk.accounts.dev https://*.clerk.accounts.dev;
              img-src 'self' https://images.clerk.dev;
              frame-src 'self' https://mint-chimp-59.clerk.accounts.dev https://*.clerk.accounts.dev;
              style-src 'self' 'unsafe-inline';
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
