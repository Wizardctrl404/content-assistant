/**
 * researcher.js
 * Wrapper for the Tavily API — web research and content discovery.
 */

import axios from "axios";
import { config } from "../config/settings.js";

const client = axios.create({
  baseURL: config.tavily.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Run a web search and return summarized results.
 * @param {string} query       - search query
 * @param {number} maxResults  - max results to return (default 5)
 * @param {string} searchDepth - "basic" or "advanced"
 * @returns {Promise<object>} search results with answer + sources
 */
export async function search(query, maxResults = 5, searchDepth = "basic") {
  const { data } = await client.post("/search", {
    api_key: config.tavily.apiKey,
    query,
    max_results: maxResults,
    search_depth: searchDepth,
    include_answer: true,
    include_raw_content: false,
  });
  return data;
}

/**
 * Research a competitor — pulls key facts from the web.
 * @param {string} competitorName
 * @returns {Promise<object>}
 */
export async function researchCompetitor(competitorName) {
  return search(
    `${competitorName} brand positioning, content strategy, target audience, strengths weaknesses`,
    8,
    "advanced"
  );
}

/**
 * Research a niche/industry topic.
 * @param {string} niche
 * @returns {Promise<object>}
 */
export async function researchNiche(niche) {
  return search(
    `${niche} industry trends, audience pain points, content opportunities 2025`,
    8,
    "advanced"
  );
}
