# /competitor-intel - Competitor Research & Analysis

## Purpose
Automatically discover competitors from a seed Instagram account, score ~50 related accounts for niche fit, surface the top 30, let the user pick up to 5, then deep-dive each one: scrape 50 posts/reels, transcribe the top 20 by views, and output a full Competitor Doc to Notion with linked reels, transcriptions, hooks, and metrics.

## Before Starting
1. Read `USER_PROFILE.md` - know their niche, industry, and positioning.
2. Read `data/brand_snapshot.md` - understand their differentiation so you can spot real gaps.
3. Read `data/competitor_doc.md` if it exists - don't re-research competitors already covered.

---

## Step 1 - Get the Seed Account

Ask the user:

> "What's your Instagram handle, or the handle of someone in your space we should use as a starting point? I'll pull related accounts from there and find your real competitors."

Accept either:
- Their own Instagram handle (discovers who the algorithm groups them with)
- A known competitor's handle (discovers that competitor's peer set)

---

## Step 2 - Discover Related Accounts

Run ScapeCreators "Get Instagram Profile" on the seed account. This returns related/suggested accounts alongside the profile data.

```bash
node -e "
import('./utils/scraper.js').then(({ getRelatedAccounts }) =>
  getRelatedAccounts('[handle]').then(r => console.log(JSON.stringify(r, null, 2)))
)"
```

This returns up to 50 related accounts. For each, collect: handle, bio, follower count, post count, category tag if available.

---

## Step 3 - Score and Filter to Top 30

For each of the ~50 returned accounts, score niche fit:

**Niche alignment (0-3)**
- 3: Same industry and audience (automation, AI, ops, business systems)
- 2: Adjacent niche (productivity, agency building, SaaS, no-code)
- 1: Loosely related (general entrepreneurship, business content)
- 0: Not relevant

**Audience overlap (0-2)**
- 2: Clearly targeting business owners or operators
- 1: Mixed audience
- 0: Different audience entirely

**Content type fit (0-2)**
- 2: Educational, how-to, case studies, opinion content
- 1: Mixed formats
- 0: Lifestyle, personal vlog, entertainment only

Filter out scores below 4. From the remaining, take top 30 by total score. Break ties by follower count.

Present the top 30 as a table:

> "Found [X] related accounts. Here are the top 30 that fit your niche. Pick up to 5 to deep-dive."

```
| # | Handle | Followers | Bio | Score |
|---|--------|-----------|-----|-------|
| 1 | @[handle] | [count] | [first 60 chars] | [score] |
...
```

---

## Step 4 - User Selects Up to 5

> "Which ones do you want to analyze? Pick up to 5. I'll pull their top content, transcribe it, and build the full competitor doc."

Wait for their selection. Confirm the list before running.

---

## Step 5 - Deep Scrape Each Selected Account

For each selected account:

```bash
node index.js competitor-deep "[handle]"
```

**5a - Profile**
Full profile: followers, following, bio, post count, avg engagement rate.

**5b - Scrape 50 posts/reels, sort by views**
For each post collect: post URL (direct reel link), video URL, caption (full text), views, likes, comments, date, hook (first sentence of caption or first 8 seconds of video).

Sort all 50 by views descending.

**5c - Transcripts**
ScapeCreators returns transcript data alongside each post. For the top 20 by views, use the `transcript` field returned in the post object. This gives the actual spoken script: how they open, how they structure the argument, how they close. This is the primary source for hook analysis. If no transcript is returned, fall back to the caption text.

---

## Step 6 - Analyze Each Competitor

From scraped + transcribed data:

**Viral Topics**
Group top 20 posts by theme. Identify 5-8 recurring topics. Flag which appears most (primary pillar) and which they return to every week.

**Hook Patterns**
Pull the opening line of each top post from transcriptions. Identify type:
- Curiosity gap: "Most people don't know this about..."
- Contrarian: "Everyone says X. They're wrong."
- Data/proof: "I did X for 30 days. Here's what happened."
- Personal story: "I was [situation]..."
- Fear/urgency: "If you're still doing X, stop."
- Identity: "This is for people who..."
- Demo: Opens by showing the result before explaining anything

Note if their spoken hook (from transcript) differs from their caption hook.

**Content Format**
What format drives the most views: talking head, screen record, voiceover + B-roll, text overlay.

**Angles You Could Use**
Cross-reference their viral topics with the user's brand from `data/brand_snapshot.md`. For each major topic: what is the user's angle using their frameworks and hot takes? Flag 3-5 "take the topic, flip the frame" opportunities.

---

## Step 7 - Present Findings

Walk through each competitor:

> "Here's what's working for @[handle]:"

1. Top 3 topics by views
2. Dominant hook type with 2-3 verbatim examples
3. Winning format
4. 2-3 specific angles the user could take

After each: "Anything here that surprises you?"

End with the cross-competitor gaps.

---

## Step 8 - Store to data/competitor_doc.md and Push to Notion

Write full results to `data/competitor_doc.md`:

```
# Competitor Research - [Date]

---

## @[handle]
Platform: Instagram
URL: https://instagram.com/[handle]
Followers: [count]
Avg engagement rate: [%]
Bio: [full bio]

### Top 20 Videos (sorted by views)

| # | Views | Likes | Comments | Hook | Reel Link |
|---|-------|-------|----------|------|-----------|
| 1 | [views] | [likes] | [comments] | [first sentence] | [url] |
...

### Full Transcriptions (Top 10)

**Video 1** - [views] views - [date]
Reel: [url]
Hook: [first sentence verbatim]
Transcript:
[full transcript]

---

**Video 2** - [views] views - [date]
Reel: [url]
Hook: [first sentence verbatim]
Transcript:
[full transcript]

---

[continue for top 10]

### Viral Topics
1. [Topic] - [X] of top 20 posts
2. [Topic] - [frequency]
3. [Topic] - [frequency]

### Hook Patterns
1. "[Hook verbatim]" - [Type]
2. "[Hook]" - [Type]
3. "[Hook]" - [Type]

Dominant hook type: [Type]

### Content Format
Winning format: [Talking head / Voiceover / Screen record / etc.]
Avg length on top posts: [X seconds]

### Angles You Could Use
1. Their topic: [X] -> Your angle: [specific take tied to user's frameworks/positioning]
2. Their topic: [X] -> Your angle: [take]
3. Their topic: [X] -> Your angle: [take]

---

[repeat for each selected competitor]

---

## Cross-Competitor Gaps

1. [Biggest gap - territory nobody owns]
2. [Second gap]
3. [Third gap]
```

After writing the doc, push to Notion as its own database:

```bash
node index.js competitor-doc
```

This creates one Notion page per competitor. Each reel is linked. Each transcription lives in a toggle block. Metrics are stored as database properties (views, likes, comments, engagement rate).

---

## Tone Notes
This is intelligence work. Competitors occupy territory - you're mapping it.
Tie every angle back to the user's actual frameworks, takes, and differentiation.
The point is not to copy hooks. It's to understand what resonates in this space, then say something only they can say in that format.
