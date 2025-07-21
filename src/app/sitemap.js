export default async function sitemap() {
  const dashboardPages = [
    "rooms",
    "reservation",
    "lodge",
    "invoice",
    "finance",
    "customers",
    "calendar",
  ];

  const baseUrls = [
    {
      url: "https://eghamatban.ir/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://eghamatban.ir/dashboard",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://eghamatban.ir/sign-in",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://eghamatban.ir/sign-up",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const dashboardUrls = dashboardPages.map((page) => ({
    url: `https://eghamatban.ir/dashboard/${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...baseUrls, ...dashboardUrls];
}
