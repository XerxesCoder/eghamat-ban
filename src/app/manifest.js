export default function manifest() {
  return {
    name: "اقامت بان",
    short_name: "اقامت بان",
    description: 'مدیریت هوشمند اقامتگاه‌ها"',
    start_url: "/dashboard",
    id: "EghamatBan",
    display: "standalone",
    background_color: "#E9DAC7",
    theme_color: "#f5f7fa",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "s1.png",
        type: "image/png",
        sizes: "350*570",
        form_factor: "narrow",
      },
    ],
  };
}
