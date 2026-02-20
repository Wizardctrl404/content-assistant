/**
 * scraper.js
 * Wrapper for the ScapeCreators API — pulls social media content from creators.
 */

import axios from "axios";
import { config } from "../config/settings.js";

const client = axios.create({
  baseURL: config.scrapeCreators.baseUrl,
  headers: {
    "x-api-key": config.scrapeCreators.apiKey,
    "Content-Type": "application/json",
  },
});

/**
 * Scrape a creator's profile by platform and handle.
 * @param {string} platform - e.g. "twitter", "instagram", "tiktok", "linkedin"
 * @param {string} handle   - username/handle without @
 * @returns {Promise<object>} profile data
 */
export async function scrapeProfile(platform, handle) {
  const { data } = await client.get(`/${platform}/profile`, {
    params: { username: handle },
  });
  return data;
}

/**
 * Scrape recent posts from a creator.
 * @param {string} platform
 * @param {string} handle
 * @param {number} limit - number of posts to retrieve (default 20)
 * @returns {Promise<object[]>} array of posts
 */
export async function scrapePosts(platform, handle, limit = 20) {
  const { data } = await client.get(`/${platform}/posts`, {
    params: { username: handle, limit },
  });
  return data;
}

/**
 * Scrape comments/engagement on a specific post.
 * @param {string} platform
 * @param {string} postId
 * @returns {Promise<object[]>} comments
 */
export async function scrapeComments(platform, postId) {
  const { data } = await client.get(`/${platform}/comments`, {
    params: { post_id: postId },
  });
  return data;
}
