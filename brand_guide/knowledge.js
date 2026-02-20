/**
 * knowledge.js
 * Skill: Map out the brand's core knowledge domains and expertise areas.
 *
 * Identifies the topics they teach, frameworks they reference,
 * and depth of expertise to inform content pillars.
 */

import { scrapePosts } from "../utils/scraper.js";
import { search } from "../utils/researcher.js";

const TOPIC_PATTERNS = [
  "how to", "tip:", "lesson:", "framework", "strategy", "formula",
  "guide", "explained", "101", "steps to", "ways to", "secret to",
  "what most people", "what nobody tells you",
];

/**
 * Map the knowledge domains of a brand.
 * @param {string} platform
 * @param {string} handle
 * @param {string} niche       - general niche to anchor topic research
 * @param {number} limit
 * @returns {Promise<object>}
 */
export async function mapKnowledge(platform, handle, niche, limit = 100) {
  console.log(`\n[Knowledge] Mapping expertise for @${handle} in "${niche}"...`);

  const [posts, nicheResearch] = await Promise.all([
    scrapePosts(platform, handle, limit),
    search(`${niche} core knowledge areas, frameworks, expertise topics`, 5),
  ]);

  const allPosts = posts?.data || posts || [];

  // Find educational/knowledge posts
  const knowledgePosts = allPosts.filter((post) => {
    const text = (post.text || post.caption || post.content || "").toLowerCase();
    return TOPIC_PATTERNS.some((kw) => text.includes(kw));
  });

  // Simple frequency map of words to identify topic clusters
  const wordFreq = {};
  knowledgePosts.forEach((post) => {
    const text = post.text || post.caption || post.content || "";
    text.toLowerCase().split(/\s+/).forEach((word) => {
      if (word.length > 5) wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
  });

  const topTerms = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));

  return {
    skill: "knowledge",
    platform,
    handle,
    niche,
    totalScanned: allPosts.length,
    educationalPosts: knowledgePosts.slice(0, 10),
    topTerms,
    nicheContext: nicheResearch?.answer || "",
    template: {
      corePillars: "[Fill in: 3-5 main knowledge pillars this brand teaches]",
      frameworks: "[Fill in: any named frameworks, methods, or systems they reference]",
      audienceLevel: "[Fill in: beginner / intermediate / advanced audience?]",
      signatureContent: "[Fill in: content formats they excel at (threads, carousels, etc.)]",
    },
  };
}
