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

/**
 * Parse a social media profile URL into platform + handle.
 * Supports: Instagram, TikTok, Twitter/X, LinkedIn, YouTube
 * @param {string} url - full profile URL
 * @returns {{ platform: string, handle: string } | null}
 */
export function parseProfileUrl(url) {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace("www.", "");
    const parts = u.pathname.replace(/^\//, "").replace(/\/$/, "").split("/");

    if (host === "instagram.com") {
      return { platform: "instagram", handle: parts[0].replace("@", "") };
    }
    if (host === "tiktok.com") {
      return { platform: "tiktok", handle: parts[0].replace("@", "") };
    }
    if (host === "twitter.com" || host === "x.com") {
      return { platform: "twitter", handle: parts[0].replace("@", "") };
    }
    if (host === "linkedin.com" && parts[0] === "in") {
      return { platform: "linkedin", handle: parts[1] };
    }
    if (host === "youtube.com") {
      const handle = parts[0].startsWith("@") ? parts[0].replace("@", "") : parts[1];
      return { platform: "youtube", handle };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Scrape and rank a creator's most viral posts by engagement.
 * @param {string} platform
 * @param {string} handle
 * @param {number} limit - posts to fetch (default 50)
 * @param {number} topN  - how many viral posts to return (default 15)
 * @returns {Promise<object[]>} top posts sorted by engagement
 */
export async function scrapeViralPosts(platform, handle, limit = 50, topN = 15) {
  const posts = await scrapePosts(platform, handle, limit);
  const allPosts = posts?.data || posts || [];

  const ranked = allPosts
    .map((post) => {
      const likes = post.likes || post.likesCount || post.likeCount || 0;
      const comments = post.comments || post.commentsCount || post.commentCount || 0;
      const views = post.views || post.viewCount || post.playCount || 0;
      const shares = post.shares || post.shareCount || 0;
      const engagement = likes + comments * 2 + shares * 3;
      const caption = post.text || post.caption || post.content || post.description || "";

      return {
        id: post.id || post.postId,
        url: post.url || post.postUrl || post.link || null,
        caption,
        hook: caption.split(/[.!?\n]/)[0].trim() || "",
        type: post.type || post.contentType || (post.videoUrl ? "video" : post.imageUrl ? "image" : "text"),
        videoUrl: post.videoUrl || null,
        imageUrl: post.imageUrl || null,
        likes,
        comments,
        views,
        shares,
        engagement,
        date: post.createdAt || post.timestamp || post.date || null,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, topN);

  return ranked;
}

/**
 * Get related/suggested accounts from an Instagram profile.
 * Uses the ScapeCreators Instagram profile endpoint which returns
 * related accounts alongside profile data.
 * @param {string} handle - Instagram username without @
 * @returns {Promise<object[]>} array of related account objects
 */
export async function getRelatedAccounts(handle) {
  const { data } = await client.get("/instagram/profile", {
    params: { username: handle },
  });

  const related = data?.related_profiles
    || data?.edge_related_profiles?.edges?.map((e) => e.node)
    || data?.relatedAccounts
    || data?.suggestedUsers
    || [];

  return related.map((account) => ({
    handle: account.username || account.handle || "",
    fullName: account.full_name || account.name || "",
    bio: account.biography || account.bio || "",
    followers: account.follower_count || account.followersCount || account.followers || 0,
    postCount: account.media_count || account.postsCount || account.postCount || 0,
    category: account.category || account.businessCategory || "",
    profileUrl: `https://instagram.com/${account.username || account.handle || ""}`,
  }));
}

/**
 * Scrape up to 50 posts from a creator sorted by view count descending.
 * Returns full metadata needed for competitor deep-dive.
 * @param {string} handle - Instagram username
 * @param {number} limit - posts to fetch (default 50)
 * @returns {Promise<object[]>} posts sorted by views
 */
export async function scrapePostsByViews(handle, limit = 50) {
  const posts = await scrapePosts("instagram", handle, limit);
  const allPosts = posts?.data || posts || [];

  return allPosts
    .map((post) => {
      const caption = post.text || post.caption || post.content || post.description || "";
      const transcript = post.transcript || post.transcription || post.subtitles || post.speechText || "";
      const views = post.views || post.viewCount || post.playCount || 0;
      const likes = post.likes || post.likesCount || post.likeCount || 0;
      const comments = post.comments || post.commentsCount || post.commentCount || 0;
      // Use spoken transcript for hook if available, otherwise fall back to caption
      const hookSource = transcript || caption;

      return {
        id: post.id || post.postId,
        url: post.url || post.postUrl || post.link || null,
        videoUrl: post.videoUrl || null,
        caption,
        transcript,
        hook: hookSource.split(/[.!?\n]/)[0].trim() || "",
        views,
        likes,
        comments,
        date: post.createdAt || post.timestamp || post.date || null,
        type: post.type || (post.videoUrl ? "video" : "image"),
      };
    })
    .sort((a, b) => b.views - a.views);
}
