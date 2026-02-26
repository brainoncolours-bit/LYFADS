const SITE_URL = "https://lyfads.com"; // TODO: Update with your actual domain

export default async function sitemap() {
  const routes = [
    {
      url: SITE_URL,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/works`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/FAQ`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // TODO: If you have dynamic routes like individual video projects or case studies, add them here
  // Example:
  // const works = await getWorks();
  // const workRoutes = works.map((work) => ({
  //   url: `${SITE_URL}/works/${work.id}`,
  //   lastModified: work.updatedAt,
  //   changeFrequency: "monthly",
  //   priority: 0.6,
  // }));
  //
  // return [...routes, ...workRoutes];

  return routes;
}
