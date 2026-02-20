/**
 * opinionsViews.js
 * Skill: Extract the brand's opinions, takes, and worldview from their content.
 *
 * Identifies what the creator stands for, what they push back against,
 * and their unique perspective on their niche.
 */

import { scrapePosts } from "../utils/scraper.js";

const OPINION_KEYWORDS = [
  "i think", "i believe", "hot take", "unpopular opinion", "controversial",
  "nobody talks about", "the truth is", "stop", "you should", "you shouldn't",
  "mistake", "wrong", "change my mind", "fight me", "disagree",
];

/**
 * Extract opinions and views from a creator's content.
 * @param {string} platform
 * @param {string} handle
 * @param {number} limit - posts to scan
 * @returns {Promise<object>}
 */
export async function extractOpinionsAndViews(platform, handle, limit = 100) {
  console.log(`\n[Opinions & Views] Scanning @${handle} on ${platform}...`);

  const posts = await scrapePosts(platform, handle, limit);
  const allPosts = posts?.data || posts || [];

  const opinionPosts = allPosts.filter((post) => {
    const text = (post.text || post.caption || post.content || "").toLowerCase();
    return OPINION_KEYWORDS.some((kw) => text.includes(kw));
  });

  // Bucket by stance type
  const buckets = {
    hotTakes: [],
    beliefs: [],
    pushbacks: [],
    advice: [],
  };

  opinionPosts.forEach((post) => {
    const text = (post.text || post.caption || post.content || "").toLowerCase();
    if (["hot take", "unpopular opinion", "controversial"].some((k) => text.includes(k))) {
      buckets.hotTakes.push(post);
    } else if (["i think", "i believe", "the truth"].some((k) => text.includes(k))) {
      buckets.beliefs.push(post);
    } else if (["stop", "wrong", "mistake", "shouldn't"].some((k) => text.includes(k))) {
      buckets.pushbacks.push(post);
    } else {
      buckets.advice.push(post);
    }
  });

  return {
    skill: "opinions_views",
    platform,
    handle,
    totalScanned: allPosts.length,
    totalFound: opinionPosts.length,
    buckets: {
      hotTakes: buckets.hotTakes.slice(0, 5),
      beliefs: buckets.beliefs.slice(0, 5),
      pushbacks: buckets.pushbacks.slice(0, 5),
      advice: buckets.advice.slice(0, 5),
    },
    template: {
      coreBeliefs: "[Fill in: 3-5 things this brand fundamentally believes]",
      standAgainst: "[Fill in: what common practices/ideas do they push back on?]",
      uniqueAngles: "[Fill in: their contrarian or fresh takes in the niche]",
      voiceTone: "[Fill in: how do they express opinions — direct, nuanced, provocative?]",
    },
  };
}
