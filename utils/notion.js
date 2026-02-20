/**
 * notion.js
 * Wrapper for the Notion API — creates and updates pages in your workspace.
 */

import { Client } from "@notionhq/client";
import { config } from "../config/settings.js";

export const notion = new Client({ auth: config.notion.apiKey });

/**
 * Create a new page inside a Notion database.
 * @param {string} databaseId   - target database ID
 * @param {string} title        - page title
 * @param {object[]} blocks     - array of Notion block objects
 * @param {object} extraProps   - additional database properties (optional)
 * @returns {Promise<object>}   created page object
 */
export async function createPage(databaseId, title, blocks = [], extraProps = {}) {
  const page = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: title } }],
      },
      ...extraProps,
    },
    children: blocks,
  });
  return page;
}

/**
 * Append blocks to an existing page.
 * @param {string} pageId
 * @param {object[]} blocks
 */
export async function appendBlocks(pageId, blocks) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: blocks,
  });
}

// ─── Block Builders ───────────────────────────────────────────────────────────

export function heading1(text) {
  return {
    object: "block",
    type: "heading_1",
    heading_1: { rich_text: [{ type: "text", text: { content: text } }] },
  };
}

export function heading2(text) {
  return {
    object: "block",
    type: "heading_2",
    heading_2: { rich_text: [{ type: "text", text: { content: text } }] },
  };
}

export function heading3(text) {
  return {
    object: "block",
    type: "heading_3",
    heading_3: { rich_text: [{ type: "text", text: { content: text } }] },
  };
}

export function paragraph(text) {
  return {
    object: "block",
    type: "paragraph",
    paragraph: { rich_text: [{ type: "text", text: { content: text } }] },
  };
}

export function bulletList(items) {
  return items.map((item) => ({
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [{ type: "text", text: { content: item } }],
    },
  }));
}

export function divider() {
  return { object: "block", type: "divider", divider: {} };
}
