export default function manifest() {
  return {
    name: 'اقامت بان',
    short_name: 'اقامت بان',
    description: 'مدیریت هوشمند اقامتگاه‌ها"',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}