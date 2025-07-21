export default function manifest() {
  return {
    name: "اقامت بان",
    short_name: "اقامت بان",
    description: 'مدیریت هوشمند اقامتگاه‌ها"',
    start_url: "/dashboard",
    id: "/dashboard",
    display: "standalone",
    background_color: "#E9DAC7",
    theme_color: "#f5f7fa",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "s1.png",
        type: "image/png",
        sizes: "1080x1920",
        form_factor: "narrow",
      },
    ],
  };
}
