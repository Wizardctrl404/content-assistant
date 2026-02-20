# /competitor-intel — Competitor Research & Analysis

## Purpose
Collect competitor social media URLs, scrape their profiles and most viral content via ScapeCreators, supplement with Tavily web research, and produce a Competitor Doc with: viral topics, viral hooks, and angles the user can adapt for their own brand.

## Before Starting
1. Read `USER_PROFILE.md` — know their niche, industry, and positioning.
2. Read `data/brand_snapshot.md` — understand their differentiation so you can spot real gaps.
3. Read `data/competitor_doc.md` if it exists — don't re-research competitors already covered.

---

## Step 1 — Collect Competitor URLs

Ask the user:

> "Paste the social media profile URLs for the competitors you want to analyze. One per line. Include anyone in your space you watch, who shows up when people search for what you do, or who you think is doing it well."

Accept any mix of platforms: Instagram, TikTok, Twitter/X, LinkedIn, YouTube.

If they give names without URLs, ask: "Can you give me the direct profile links? I need the URLs to scrape their content."

For each URL, confirm what you're working with:
> "Got it — I'll analyze: [list name + platform + handle for each]. Anything else to add before I run this?"

---

## Step 2 — Scrape & Research

For each competitor, run:

```bash
node -e "
import('./brand_guide/competitors.js').then(({ analyzeCompetitors }) =>
  analyzeCompetitors([{ url: '[URL]', name: '[Name]' }])
  .then(r => console.log(JSON.stringify(r, null, 2)))
)"
```

Or call via:
```bash
node index.js competitors
```

This will:
- Scrape their profile (followers, bio)
- Pull their last 50 posts, ranked by engagement
- Return top 15 most viral posts with caption, URL, hook, and metrics
- Pull web research via Tavily

If the scraper isn't available or errors, fall back to WebSearch:
- `[competitor handle] most viral posts [current year]`
- `[competitor name] content strategy [current year]`
- `[niche] top performing content [platform] [current year]`

---

## Step 3 — Analyze & Extract

From the scraped viral posts, extract:

### Viral Topics
What subjects, themes, or angles drive the most engagement.
- Group the top 15 posts by theme
- Identify 5–8 recurring topics
- Note which topic appears most (their content pillar)
- Flag any topic they repeat week after week (signal: it works)

### Viral Hooks
The opening lines from their highest-performing posts.
- Pull the first line/sentence from each top post (the hook)
- Identify the pattern type:
  - **Curiosity gap** — "Most people don't know this about..."
  - **Contrarian** — "Everyone says X. They're wrong."
  - **Data/proof** — "I did X for 30 days. Here's what happened."
  - **Personal story** — "I was [situation]..."
  - **Fear/urgency** — "If you're still doing X, stop."
  - **Identity** — "This is for people who..."
- List the top 5–8 hooks verbatim with their pattern type
- Note which hook type dominates their feed

### Angles You Could Use
How the user can enter the same conversations with their own positioning.
- Cross-reference competitor topics with `data/brand_snapshot.md`
- For each viral topic: what's the user's angle via their frameworks, hot takes, and differentiation?
- Flag where they can offer a contrarian take vs. where they can validate and go deeper
- Identify 3–5 "steal and reframe" opportunities: competitor's topic + user's unique angle

---

## Step 4 — Present Findings

Walk through each competitor section by section:

> "Here's what's working for [name] on [platform]:"

1. **Viral Topics** — "These are the subjects they come back to over and over."
2. **Viral Hooks** — "Here are their actual opening lines from their top posts. [Read 3–4 verbatim.] The pattern is [X]."
3. **Angles you could use** — "Here's how I'd frame these for you given your positioning."

After each competitor: "Anything here that surprises you?"

At the end: "Across all of them, here are the 3 biggest gaps — the territory nobody's owning that you could."

---

## Step 5 — Store Everything

Write to `data/competitor_doc.md`:

```
## Competitor Research — [Date]

---

### [Competitor Name]
**Platform:** [platform]
**Handle:** @[handle]
**URL:** [url]
**Followers:** [count]
**Bio:** [bio]

#### Top Viral Posts (by engagement)

| # | Hook (first line) | Likes | Comments | Views | Post URL |
|---|-------------------|-------|----------|-------|----------|
| 1 | [hook] | [n] | [n] | [n] | [url] |
| 2 | [hook] | [n] | [n] | [n] | [url] |
| 3 | [hook] | [n] | [n] | [n] | [url] |
...

#### Full Captions (Top 5)

**Post 1** ([date]) — [engagement] total engagement
[Full caption / script]
[Post URL]

**Post 2** ([date]) — [engagement] total engagement
[Full caption / script]
[Post URL]

...

#### Viral Topics
1. [Topic] — appears in [X] of top 15 posts
2. [Topic] — [frequency]
3. [Topic] — [frequency]
4. [Topic] — [frequency]
5. [Topic] — [frequency]

#### Viral Hooks (by pattern type)
1. "[Hook]" — [Curiosity / Contrarian / Story / Data / Fear / Identity]
2. "[Hook]" — [Type]
3. "[Hook]" — [Type]
4. "[Hook]" — [Type]
5. "[Hook]" — [Type]

**Dominant hook type:** [Type]

#### Angles You Could Use
1. Their topic: [X] → Your angle: [Marc's take via Ghost Ops / positioning]
2. Their topic: [X] → Your angle: [take]
3. Their topic: [X] → Your angle: [take]

#### Web Intelligence
[Tavily summary]
Sources: [links]

---

### Overall Gaps (Top 3)
1. [Biggest gap across all competitors]
2. [Second]
3. [Third]
```

## Tone Notes
- This is intelligence, not flattery. Competitors occupy territory — you're mapping it.
- Always tie angles back to the user's frameworks, hot takes, and core differentiation.
- The point isn't to copy hooks — it's to understand what resonates, then say something only they can say in that format.
