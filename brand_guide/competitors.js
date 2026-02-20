/**
 * competitors.js
 * Skill: Research and map out the competitive landscape.
 *
 * Accepts competitor social media URLs, scrapes their profiles and most viral
 * posts via ScapeCreators, then supplements with Tavily web research to build
 * a full competitor intelligence report.
 */

import { parseProfileUrl, scrapeProfile, scrapeViralPosts } from "../utils/scraper.js";
import { researchCompetitor } from "../utils/researcher.js";

/**
 * Analyze a single competitor from a profile URL.
 * @param {string} url - full social media profile URL
 * @param {string} name - display name for research
 * @returns {Promise<object>}
 */
export async function analyzeCompetitorFromUrl(url, name) {
  const parsed = parseProfileUrl(url);
  if (!parsed) {
    console.warn(`  Could not parse URL: ${url}`);
    return null;
  }

  const { platform, handle } = parsed;
  console.log(`  Analyzing competitor: @${handle} on ${platform} (${name})`);

  const [profile, viralPosts, webData] = await Promise.all([
    scrapeProfile(platform, handle),
    scrapeViralPosts(platform, handle, 50, 15),
    researchCompetitor(name),
  ]);

  return {
    name,
    platform,
    handle,
    url,
    followers: profile?.followers || profile?.followerCount || profile?.subscriberCount || "N/A",
    bio: profile?.bio || profile?.description || "",
    webInsights: {
      summary: webData?.answer || "",
      sources: webData?.results?.slice(0, 3).map((r) => ({ title: r.title, url: r.url })) || [],
    },
    viralPosts: viralPosts.map((post) => ({
      url: post.url,
      caption: post.caption,
      type: post.type,
      videoUrl: post.videoUrl,
      likes: post.likes,
      comments: post.comments,
      views: post.views,
      shares: post.shares,
      engagement: post.engagement,
      date: post.date,
      // Extract the hook — first line or first 120 chars of caption
      hook: post.caption ? post.caption.split("\n")[0].slice(0, 120).trim() : "",
    })),
  };
}

/**
 * Analyze multiple competitors from URLs and produce a comparison report.
 * @param {Array<{url: string, name: string}>} competitors
 * @returns {Promise<object>}
 */
export async function analyzeCompetitors(competitors) {
  console.log(`\n[Competitors] Analyzing ${competitors.length} competitors...`);

  const results = await Promise.all(
    competitors.map(({ url, name }) => analyzeCompetitorFromUrl(url, name))
  );

  const analyses = results.filter(Boolean);

  return {
    skill: "competitors",
    totalAnalyzed: analyses.length,
    competitors: analyses,
  };
}
