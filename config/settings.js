import "dotenv/config";

export const config = {
  scrapeCreators: {
    apiKey: process.env.SCRAPE_CREATORS_API_KEY,
    baseUrl: "https://api.scrapecreators.com/v1",
  },
  tavily: {
    apiKey: process.env.TAVILY_API_KEY,
    baseUrl: "https://api.tavily.com",
  },
  notion: {
    apiKey: process.env.NOTION_API_KEY,
    databases: {
      brandOutline: process.env.NOTION_BRAND_OUTLINE_DB_ID,
      competitor: process.env.NOTION_COMPETITOR_DB_ID,
    },
  },
};

// Validate required keys on startup
export function validateConfig() {
  const required = [
    ["SCRAPE_CREATORS_API_KEY", config.scrapeCreators.apiKey],
    ["TAVILY_API_KEY", config.tavily.apiKey],
    ["NOTION_API_KEY", config.notion.apiKey],
    ["NOTION_BRAND_OUTLINE_DB_ID", config.notion.databases.brandOutline],
    ["NOTION_COMPETITOR_DB_ID", config.notion.databases.competitor],
  ];

  const missing = required
    .filter(([, val]) => !val || val.includes("your_"))
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error("Missing or placeholder values in .env:");
    missing.forEach((key) => console.error(`  - ${key}`));
    process.exit(1);
  }
}
