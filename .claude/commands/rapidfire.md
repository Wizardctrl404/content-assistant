# /rapidfire -Adaptive RapidFire Q&A

## Purpose
Fast-paced, instinct-driven Q&A. Selects 5–10 questions from the 200+ question bank based on the user's profile and gaps. Then runs a niche sub-flow that uses live research to surface controversial topics in their space and asks their take.

## Before Starting
1. Read `USER_PROFILE.md`. If missing, stop: "Run `/intake` first."
2. Read `questions.md` in full.
3. Read `data/rapidfire_answers.md` -never re-ask answered questions.
4. Read `data/hot_takes.md`, `data/beliefs.md`, `data/origin_notes.md` -know what's covered.

## Question Selection Logic

Select **5–10 questions** from the bank:

**Must include at least:**
- 2 questions from their specific industry/niche
- 1 tools or software question
- 1 habits or workflow question
- 1 contrarian or belief question

**Prioritize:**
- Categories where USER_PROFILE.md shows gaps
- Questions likely to produce quotable, specific answers given what you already know
- Tools/software questions if that data hasn't been captured yet

**Avoid:**
- Questions already answered in any data file
- Questions too similar to each other
- Questions that need long reflection (save for `/origin-story` or `/belief-mining`)

Lock your 5–10 before starting. Don't change mid-session unless an answer opens something critical.

---

## Part 1 -RapidFire Questions

### Opening
> "RapidFire -two parts. First, [X] quick questions. Then I'm looking up what's actually being debated in your space right now and getting your take. Fast pace. First instinct, not best answer. Ready?"

Ask questions one at a time. After each:
- Move on (most of the time)
- One follow-up if the answer is genuinely interesting: "Say more." / "Give me an example."
- Flag it: "That's one we're coming back to."

Never summarize. Never give feedback. Keep momentum.

---

## Part 2 -Niche Sub-Flow (Live Research)

After the rapid-fire questions, transition:

> "Good. Now the live part -I'm looking up what's actually being debated in [their niche/industry] right now."

### Research Step
Use the WebSearch tool to run these searches:
1. `[niche] controversial opinions [current year]`
2. `[niche] most debated topics reddit`
3. `[niche] hot takes [current year]`

From the results, extract 3–5 genuinely controversial or contested topics currently circulating in their space. Use real, specific debates -not generic industry platitudes.

### Present & Probe
For each topic (pick the 3 most interesting):

> "This is actually being debated in your space right now: [State the controversy as a direct, clear position]. Where do you land on this?"

After their answer:
- "Why?" -minimum one follow-up
- If strong: "Say it cleaner. That's publishable."
- If hedged: "That's the diplomatic answer. What do you actually think?"

---

## Closing

1. Read back the **3 strongest answers** from both parts.
2. Tell them which are ready to use and which need depth.
3. Write all answers to `data/rapidfire_answers.md`.
4. Update `USER_PROFILE.md` with any new tool/software/habit data captured.

## Output Format -data/rapidfire_answers.md

Append after each session:

```
## RapidFire Session -[Date]

### Part 1 -Questions

**Q:** [Question]
**A:** [Answer verbatim or close]
[GOLD / NEEDS DEPTH -if flagged]

### Part 2 -Niche Topics

**Topic:** [The controversy]
**Position:** [Where they landed]
**Reasoning:** [Their answer]
[Status: Ready / Needs sharpening]

### Session Highlights
- [Top 3 answers worth developing]

### New Data Captured
- Tools/software: [anything new]
- Habits/workflow: [anything new]
```

## Tone Notes
- Fast but not cold.
- "That's the one." -say it when something lands.
- Never say "Great answer!" -just move or probe.
