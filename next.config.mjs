/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
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

          /*           {
            key: "Content-Security-Policy",
            value: `
    default-src 'self';
    connect-src 'self' https://clerk.dev https://*.clerk.dev https://*.clerk.com https://mint-chimp-59.clerk.accounts.dev;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.dev https://*.clerk.dev https://*.clerk.com https://mint-chimp-59.clerk.accounts.dev;
    style-src 'self' 'unsafe-inline';
    img-src 'self' https://images.clerk.dev https://img.clerk.com data:;
    frame-src 'self' https://*.clerk.dev https://*.clerk.com https://mint-chimp-59.clerk.accounts.dev;
    child-src 'self' https://*.clerk.dev https://*.clerk.com https://mint-chimp-59.clerk.accounts.dev;
  `
              .replace(/\s{2,}/g, " ")
              .trim(),
          }, */
          {
            key: "Content-Security-Policy",
            value: `
    default-src * data: blob:;
    script-src * 'unsafe-inline' 'unsafe-eval';
    style-src * 'unsafe-inline';
    img-src * data: blob:;
    connect-src *;
    frame-src *;
    child-src *;
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
            value: `
        default-src 'self';
        script-src 'self';
        connect-src 'self' https://clerk.dev https://*.clerk.dev https://*.clerk.accounts.dev https://*.clerk.com https://mint-chimp-59.clerk.accounts.dev;
      `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
  /*   {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      }, */
};

export default nextConfig;
