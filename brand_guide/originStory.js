/**
 * originStory.js
 * Skill: Extract and structure the brand's origin story from creator content.
 *
 * Pulls posts where the creator talks about their background, why they started,
 * what problem they solve, and formats it into a structured origin story.
 */

import { scrapePosts } from "../utils/scraper.js";
import { search } from "../utils/researcher.js";

/**
 * Build an origin story profile for a creator/brand.
 * @param {string} platform  - social platform to scrape
 * @param {string} handle    - creator handle
 * @param {string} brandName - name of the brand (for web research)
 * @returns {Promise<object>} structured origin story data
 */
export async function buildOriginStory(platform, handle, brandName) {
  console.log(`\n[Origin Story] Gathering data for @${handle} on ${platform}...`);

  // Scrape posts and search for founder story in parallel
  const [posts, webResult] = await Promise.all([
    scrapePosts(platform, handle, 50),
    search(`${brandName} founder origin story why they started`, 5, "advanced"),
  ]);

  // Filter posts that likely contain origin story keywords
  const keywords = ["started", "why i", "story", "journey", "founded", "begin", "first", "how i", "backstory"];
  const storyPosts = (posts?.data || posts || []).filter((post) => {
    const text = (post.text || post.caption || post.content || "").toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });

  return {
    skill: "origin_story",
    brand: brandName,
    platform,
    handle,
    summary: webResult?.answer || "No web summary found.",
    sources: webResult?.results?.map((r) => ({ title: r.title, url: r.url })) || [],
    rawPosts: storyPosts.slice(0, 10),
    template: {
      whoTheyAre: "[Fill in: who is this person/brand?]",
      theProblem: "[Fill in: what problem did they face that led to this brand?]",
      theShift: "[Fill in: what was the turning point?]",
      theMission: "[Fill in: what are they building and why?]",
      theProof: "[Fill in: early wins or credibility markers]",
    },
  };
}
