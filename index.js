/**
 * index.js
 * Claude Content Machine — main entry point.
 *
 * Usage:
 *   node index.js brand-guide   → Run full brand guide pipeline
 *   node index.js origin-story  → Run only origin story skill
 *   node index.js opinions      → Run only opinions & views skill
 *   node index.js knowledge     → Run only knowledge skill
 *   node index.js rapid-fire    → Run only rapid fire Q&A skill
 *   node index.js niche         → Run only niche analysis skill
 *   node index.js competitors   → Run only competitor analysis skill
 *   node index.js brand-doc     → Push brand outline to Notion
 *   node index.js competitor-doc→ Push competitor docs to Notion
 */

import "dotenv/config";
import { validateConfig } from "./config/settings.js";

import { buildOriginStory }         from "./brand_guide/originStory.js";
import { extractOpinionsAndViews }  from "./brand_guide/opinionsViews.js";
import { mapKnowledge }             from "./brand_guide/knowledge.js";
import { buildRapidFireQA }         from "./brand_guide/rapidFireQA.js";
import { analyzeNiche }             from "./brand_guide/niche.js";
import { analyzeCompetitors }       from "./brand_guide/competitors.js";
import { writeBrandOutlineToNotion } from "./brand_guide/docs/brandOutline.js";
import { writeAllCompetitorsToNotion } from "./brand_guide/docs/competitorDoc.js";

// ─── CONFIG — Edit these before running ──────────────────────────────────────
const BRAND = {
  name: "Your Brand Name",       // e.g. "Alex Hormozi"
  platform: "instagram",         // twitter | instagram | tiktok | linkedin
  handle: "yourhandle",          // without @
  niche: "Your niche here",      // e.g. "business coaching for entrepreneurs"
  competitors: [
    // Now accepts full profile URLs — platform and handle are auto-detected
    { url: "https://www.instagram.com/competitor1/", name: "Competitor One" },
    { url: "https://www.instagram.com/competitor2/", name: "Competitor Two" },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

const command = process.argv[2] || "brand-guide";

async function run() {
  validateConfig();
  console.log(`\n Claude Content Machine`);
  console.log(`Command: ${command}`);
  console.log(`Brand: ${BRAND.name} | @${BRAND.handle} on ${BRAND.platform}\n`);

  // Shared state for full pipeline
  let originStory, opinionsViews, knowledge, rapidFireQA, niche, competitors;

  switch (command) {
    case "origin-story":
      originStory = await buildOriginStory(BRAND.platform, BRAND.handle, BRAND.name);
      console.log("\nResult:", JSON.stringify(originStory, null, 2));
      break;

    case "opinions":
      opinionsViews = await extractOpinionsAndViews(BRAND.platform, BRAND.handle);
      console.log("\nResult:", JSON.stringify(opinionsViews, null, 2));
      break;

    case "knowledge":
      knowledge = await mapKnowledge(BRAND.platform, BRAND.handle, BRAND.niche);
      console.log("\nResult:", JSON.stringify(knowledge, null, 2));
      break;

    case "rapid-fire":
      rapidFireQA = await buildRapidFireQA(BRAND.platform, BRAND.handle);
      console.log("\nResult:", JSON.stringify(rapidFireQA, null, 2));
      break;

    case "niche":
      niche = await analyzeNiche(BRAND.platform, BRAND.handle, BRAND.niche);
      console.log("\nResult:", JSON.stringify(niche, null, 2));
      break;

    case "competitors":
      competitors = await analyzeCompetitors(BRAND.competitors);
      console.log("\nResult:", JSON.stringify(competitors, null, 2));
      break;

    case "brand-doc":
      // Collect all data then push to Notion
      [originStory, opinionsViews, knowledge, rapidFireQA, niche] = await Promise.all([
        buildOriginStory(BRAND.platform, BRAND.handle, BRAND.name),
        extractOpinionsAndViews(BRAND.platform, BRAND.handle),
        mapKnowledge(BRAND.platform, BRAND.handle, BRAND.niche),
        buildRapidFireQA(BRAND.platform, BRAND.handle),
        analyzeNiche(BRAND.platform, BRAND.handle, BRAND.niche),
      ]);
      await writeBrandOutlineToNotion({
        brandName: BRAND.name,
        originStory,
        opinionsViews,
        knowledge,
        rapidFireQA,
        niche,
      });
      break;

    case "competitor-doc":
      competitors = await analyzeCompetitors(BRAND.competitors);
      await writeAllCompetitorsToNotion(competitors);
      break;

    case "brand-guide":
    default:
      // Full pipeline — all skills
      console.log("Running full brand guide pipeline...\n");
      [originStory, opinionsViews, knowledge, rapidFireQA, niche, competitors] =
        await Promise.all([
          buildOriginStory(BRAND.platform, BRAND.handle, BRAND.name),
          extractOpinionsAndViews(BRAND.platform, BRAND.handle),
          mapKnowledge(BRAND.platform, BRAND.handle, BRAND.niche),
          buildRapidFireQA(BRAND.platform, BRAND.handle),
          analyzeNiche(BRAND.platform, BRAND.handle, BRAND.niche),
          analyzeCompetitors(BRAND.competitors),
        ]);

      console.log("\n All skills complete. Writing docs to Notion...\n");

      await Promise.all([
        writeBrandOutlineToNotion({
          brandName: BRAND.name,
          originStory,
          opinionsViews,
          knowledge,
          rapidFireQA,
          niche,
        }),
        writeAllCompetitorsToNotion(competitors),
      ]);

      console.log("\n Brand guide complete! Check your Notion workspace.");
      break;
  }
}

run().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
