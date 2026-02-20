/**
 * competitors.js
 * Skill: Research and map out the competitive landscape.
 *
 * Scrapes and researches multiple competitors to identify content gaps,
 * positioning opportunities, and differentiation strategies.
 */

import { scrapeProfile, scrapePosts } from "../utils/scraper.js";
import { researchCompetitor } from "../utils/researcher.js";

/**
 * Analyze a single competitor.
 * @param {string} platform
 * @param {string} handle
 * @param {string} name   - display name for research
 * @returns {Promise<object>}
 */
export async function analyzeCompetitor(platform, handle, name) {
  console.log(`  Analyzing competitor: @${handle} (${name})`);

  const [profile, posts, webData] = await Promise.all([
    scrapeProfile(platform, handle),
    scrapePosts(platform, handle, 30),
    researchCompetitor(name),
  ]);

  const allPosts = posts?.data || posts || [];

  return {
    name,
    platform,
    handle,
    followers: profile?.followers || profile?.followerCount || "N/A",
    bio: profile?.bio || profile?.description || "",
    avgEngagement: calculateAvgEngagement(allPosts),
    topContentTypes: detectContentTypes(allPosts),
    postingFrequency: estimateFrequency(allPosts),
    webInsights: {
      summary: webData?.answer || "",
      sources: webData?.results?.slice(0, 3).map((r) => ({ title: r.title, url: r.url })) || [],
    },
    recentPosts: allPosts.slice(0, 5),
  };
}

/**
 * Analyze multiple competitors and produce a comparison report.
 * @param {string} platform
 * @param {Array<{handle: string, name: string}>} competitors
 * @returns {Promise<object>}
 */
export async function analyzeCompetitors(platform, competitors) {
  console.log(`\n[Competitors] Analyzing ${competitors.length} competitors on ${platform}...`);

  const analyses = await Promise.all(
    competitors.map(({ handle, name }) => analyzeCompetitor(platform, handle, name))
  );

  return {
    skill: "competitors",
    platform,
    totalAnalyzed: analyses.length,
    competitors: analyses,
    template: {
      marketGaps: "[Fill in: what topics/angles are underserved in this space?]",
      differentiators: "[Fill in: how does our brand stand apart from each competitor?]",
      contentOpportunities: "[Fill in: content styles or formats competitors aren't using?]",
      audienceOverlap: "[Fill in: shared audience segments]",
      positioningStatement: "[Fill in: one-line statement on how we position vs. competitors]",
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calculateAvgEngagement(posts) {
  if (!posts.length) return 0;
  const total = posts.reduce((sum, p) => {
    const likes = p.likes || p.likesCount || 0;
    const comments = p.comments || p.commentsCount || 0;
    return sum + likes + comments;
  }, 0);
  return Math.round(total / posts.length);
}

function detectContentTypes(posts) {
  const types = {};
  posts.forEach((p) => {
    const type = p.type || p.contentType || (p.videoUrl ? "video" : p.imageUrl ? "image" : "text");
    types[type] = (types[type] || 0) + 1;
  });
  return types;
}

function estimateFrequency(posts) {
  if (posts.length < 2) return "Unknown";
  const sorted = posts
    .map((p) => new Date(p.createdAt || p.timestamp || p.date))
    .filter((d) => !isNaN(d))
    .sort((a, b) => b - a);
  if (sorted.length < 2) return "Unknown";
  const daysDiff = (sorted[0] - sorted[sorted.length - 1]) / (1000 * 60 * 60 * 24);
  const postsPerDay = (sorted.length / daysDiff).toFixed(2);
  return `~${postsPerDay} posts/day`;
}
