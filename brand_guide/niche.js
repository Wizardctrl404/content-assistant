/**
 * niche.js
 * Skill: Define and analyze the brand's niche positioning.
 *
 * Maps the specific audience, sub-niche, pain points, desires, and
 * the brand's unique angle within their space.
 */

import { scrapeProfile } from "../utils/scraper.js";
import { researchNiche } from "../utils/researcher.js";

/**
 * Build a niche analysis for a brand.
 * @param {string} platform
 * @param {string} handle
 * @param {string} niche       - the declared niche (e.g. "personal finance for millennials")
 * @returns {Promise<object>}
 */
export async function analyzeNiche(platform, handle, niche) {
  console.log(`\n[Niche] Analyzing niche "${niche}" for @${handle}...`);

  const [profile, nicheData] = await Promise.all([
    scrapeProfile(platform, handle),
    researchNiche(niche),
  ]);

  const bio = profile?.bio || profile?.description || "";

  return {
    skill: "niche",
    platform,
    handle,
    declaredNiche: niche,
    profileBio: bio,
    followerCount: profile?.followers || profile?.followerCount || "N/A",
    nicheResearch: {
      summary: nicheData?.answer || "",
      sources: nicheData?.results?.map((r) => ({ title: r.title, url: r.url })) || [],
    },
    template: {
      broadCategory: "[Fill in: e.g., 'Personal Finance', 'Fitness', 'Business']",
      subNiche: "[Fill in: the specific corner they own, e.g., 'Debt payoff for Gen Z women']",
      targetAudience: {
        demographics: "[Fill in: age, gender, location, income, etc.]",
        psychographics: "[Fill in: values, fears, aspirations, lifestyle]",
        painPoints: "[Fill in: top 3-5 problems this audience faces]",
        desires: "[Fill in: top 3-5 outcomes they want]",
      },
      uniqueAngle: "[Fill in: what makes this brand different from everyone else in this niche?]",
      contentLanguage: "[Fill in: specific words, phrases, slang their audience uses]",
    },
  };
}
