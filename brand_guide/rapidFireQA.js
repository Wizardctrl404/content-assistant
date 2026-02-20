/**
 * rapidFireQA.js
 * Skill: Generate and answer rapid-fire Q&A questions about the brand.
 *
 * Extracts common audience questions from comments/posts and produces
 * short punchy answers in the brand's voice.
 */

import { scrapePosts, scrapeComments } from "../utils/scraper.js";

const QUESTION_PATTERNS = [/\?$/, /^(what|how|why|when|who|where|should|can|do|does|is|are)/i];

/**
 * Build a rapid-fire Q&A bank from a creator's content.
 * @param {string} platform
 * @param {string} handle
 * @param {number} postLimit     - posts to scan for questions
 * @param {number} commentLimit  - comments per post to scan
 * @returns {Promise<object>}
 */
export async function buildRapidFireQA(platform, handle, postLimit = 30, commentLimit = 20) {
  console.log(`\n[Rapid Fire Q&A] Building Q&A bank for @${handle}...`);

  const posts = await scrapePosts(platform, handle, postLimit);
  const allPosts = posts?.data || posts || [];

  // Pull questions from post captions
  const captionQuestions = allPosts
    .map((post) => post.text || post.caption || post.content || "")
    .filter((text) => QUESTION_PATTERNS.some((p) => p.test(text.trim())))
    .slice(0, 15);

  // Pull questions from comments on top posts
  const topPosts = allPosts.slice(0, 5);
  const commentQArrays = await Promise.all(
    topPosts.map(async (post) => {
      try {
        const comments = await scrapeComments(platform, post.id || post.postId);
        const commentList = comments?.data || comments || [];
        return commentList
          .map((c) => c.text || c.comment || "")
          .filter((t) => QUESTION_PATTERNS.some((p) => p.test(t.trim())))
          .slice(0, commentLimit);
      } catch {
        return [];
      }
    })
  );

  const allCommentQuestions = commentQArrays.flat().slice(0, 20);

  return {
    skill: "rapid_fire_qa",
    platform,
    handle,
    questionsFromPosts: captionQuestions,
    questionsFromComments: allCommentQuestions,
    totalQuestions: captionQuestions.length + allCommentQuestions.length,
    template: {
      format: "Q: [Question]\nA: [Short, punchy answer in brand voice — 1-2 sentences max]",
      categories: {
        gettingStarted: "[Fill in: beginner questions]",
        productService: "[Fill in: questions about what they offer]",
        personal: "[Fill in: questions about the person behind the brand]",
        deepDive: "[Fill in: advanced questions from engaged followers]",
      },
    },
  };
}
