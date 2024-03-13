export default async function sitemap() {
  try {
    const currentDate = new Date().toISOString();

    return [
      {
        url: "https://www.findmalek.com/",
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url: "https://www.findmalek.com/projects",
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: "https://www.findmalek.com/about",
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.8,
      },
      {
        url: "https://www.findmalek.com/contact",
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.7,
      },
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}
