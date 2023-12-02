export default async function sitemap() {
  try {
    const currentDate = new Date().toISOString();

    return [
      {
        url: "https://www.findservices.tech/",
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url: "https://www.findservices.tech/projects",
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: "https://www.findservices.tech/about",
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.8,
      },
      {
        url: "https://www.findservices.tech/contact",
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.7,
      },
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}
