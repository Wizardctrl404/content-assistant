# /brand-snapshot -Brand Outline Doc

## Purpose
Compiles everything extracted across all sessions into a single Brand Outline Doc -the source of truth for positioning, voice, origin, beliefs, hot takes, frameworks, and audience. This is what gets handed to a designer, writer, or collaborator. Also pushes to Notion via `brandOutline.js` if configured.

## Before Starting
1. Read ALL data files:
   - `USER_PROFILE.md`
   - `data/origin_notes.md`
   - `data/rapidfire_answers.md`
   - `data/hot_takes.md`
   - `data/beliefs.md`
   - `data/voice_patterns.md`
   - `data/brand_snapshot.md` (existing -update, don't replace)
2. Assess completeness. Tell the user what's missing and which skills to run first:
   - No origin → `/origin-story`
   - No beliefs → `/belief-mining`
   - No hot takes → `/hot-takes`
   - No voice data → `/voice-capture`

Minimum to proceed: `USER_PROFILE.md` complete + at least 2 data files with real content.

---

## Build the Brand Outline Doc

Work through each section. Present one at a time, get quick confirmation, then move to the next.

---

## Output -data/brand_outline.md

```
# Brand Outline -[Name]
> [Role / Company]
> Last updated: [Date]

---

## 1. Positioning

**Who they are (one line):**
[The guy/person who does X for Y]

**One-liner:**
[Full one-sentence positioning -who + what + for whom]

**The core idea:**
[2–3 sentences. The central tension or problem they solve. Written in plain language, not marketing-speak.]

---

## 2. Origin Story

**The hook:**
[The most compelling specific moment -one sentence]

**The before:**
[Who they were, what they assumed their life would look like]

**The turning point:**
[What happened -specific, not general]

**The proof point:**
[First real win. The moment it became undeniable.]

**The mission:**
[Why they do this now. What their story makes them uniquely able to see or do.]

**Key lines (verbatim):**
- "[Quote]"
- "[Quote]"
- "[Quote]"

---

## 3. Core Beliefs

[For each belief:]

**Belief:** [Statement in their words]
**Origin:** [Where it came from]
**Framework name (if any):** [The name they gave it]

---

## 4. Original Frameworks & IP

[For each framework:]

**Name:** [Framework name]
**Definition:** [What it is in one sentence]
**The diagnosis:** [What it identifies]
**The fix:** [What the opposite looks like]
**Key line:** "[The line that closes it]"

---

## 5. Hot Takes

[List all confirmed takes, status noted]

1. "[Take]" -[Ready / Needs sharpening]
2. "[Take]" -[Ready / Needs sharpening]
...

---

## 6. Voice Guide

**Sounds like:** [One sentence]

**Always:**
- [Rule]
- [Rule]
- [Rule]

**Never:**
- [Word/phrase to avoid]
- [Word/phrase to avoid]

**Signature phrases:**
- "[Phrase]"
- "[Phrase]"
- "[Phrase]"

---

## 7. Audience

**For:** [Specific person -stage of business, situation they are in, what is breaking for them right now]

**Not for:** [Pull this from intake Q5 and any client stories that surfaced in sessions. This should be a real type of person, not a vibe. What specific belief, behavior, or situation makes someone the wrong fit? Who have they turned down or regretted working with?]

If the "not for" answer in the data is vague or missing, ask one question before writing this section:
> "Who specifically is the wrong fit for you? Not a personality type -what situation are they in, or what do they believe, that makes your work pointless for them?"

Do not write "people who aren't ready to invest" or "people who don't take action." That is filler. Get the real answer.

**What they believe when they find [Name]:**
[Their starting assumption -what wrong diagnosis are they operating under?]

**What they believe after:**
[The shift -not a mindset shift, a practical one. What do they now see or do differently?]

---

## 8. Differentiation

**vs. [competitor type 1]:** [How Marc is different]
**vs. [competitor type 2]:** [How Marc is different]
**The unfair advantage:** [What about their background can't be replicated]

---

## 9. Tools & Stack (if captured)

[From rapidfire sessions]

---

## 10. Content Pillars

Build this from the actual extracted material. Each pillar must come from one of:
- A framework or original concept they named (from `data/beliefs.md`)
- A recurring theme across their hot takes (from `data/hot_takes.md`)
- A pattern in how they explain their work (from `data/origin_notes.md` or `data/rapidfire_answers.md`)

Do not invent generic pillars like "Education" or "Motivation." Every pillar needs to be grounded in something they actually said or believe.

Format for each pillar:
**[Name they would use, not a category]**
What it covers: [1 sentence from their perspective, not marketing-speak]
Content types this generates: [What kinds of posts/videos live here]
Example angle: [A real post idea drawn from their actual material]

Minimum 3 pillars, maximum 5. Each one should be distinct enough that you could immediately tell which pillar a piece of content belongs to.

---

## 11. What to Avoid

- [Specific positioning mistake]
- [Word/framing to never use]
- [Common trap in their space to avoid]

---

## Quick Reference Card

| Element | Content |
|---------|---------|
| One-liner | |
| Core idea | |
| Origin hook | |
| Top belief | |
| Signature framework | |
| Top take | |
| Audience | |
| Sounds like | |
| Never says | |
```

---

## Notion Push (Optional)

If Notion is configured in `config/settings.js`, after writing the doc run:
```bash
node index.js brand-doc
```
This calls `brand_guide/docs/brandOutline.js` which pushes the full outline to the Notion database.

---

## Closing

After delivering the doc:
> "That's your Brand Outline. This governs everything -every post, every pitch, every piece of content. Read it slowly and tell me what sounds wrong. One thing off here affects everything downstream."

Tell them what's missing and what to run next.
