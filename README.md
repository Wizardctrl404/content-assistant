# Brand Extraction Engine

A Claude Code project that turns Claude into an intelligent brand extraction system. Through structured, adaptive conversation, it helps you discover and articulate your most compelling origin story, opinions, beliefs, and personal brand.

## How It Works

Each skill is a conversation-driven interview session. Claude leads, probes intelligently, and writes outputs to persistent files that carry context across sessions — so it gets smarter about you every time.

## Getting Started

```bash
git clone https://github.com/yourusername/brand-extraction-engine.git
cd brand-extraction-engine
cp .env.example .env    # Add your API keys
npm install
```

Then open Claude Code in the project folder and run:

```
/intake
```

Run this first. It builds your profile. Every other skill reads from it.

## Skills

| Command | Purpose |
|---------|---------|
| `/intake` | **Run first.** Establishes your user profile through 10 targeted questions. |
| `/origin-story` | Deep extraction of your backstory, turning points, and defining moments. |
| `/rapidfire` | Adaptive Q&A from a 160+ question bank, selected based on your profile. |
| `/hot-takes` | Opinion and contrarian angle extraction — finds what you actually believe. |
| `/belief-mining` | Surfaces core beliefs and operating principles. Slow, deep, foundational. |
| `/story-builder` | Drafts polished narrative (origin story, bio, posts) from extracted content. |
| `/voice-capture` | Analyzes your language patterns and builds a voice guide from your sessions. |
| `/brand-snapshot` | Generates the full brand summary — positioning, beliefs, POV, audience, voice. |

## How Sessions Work

Skills build on each other. Run them in this order for best results:

1. `/intake` — always first
2. `/origin-story` — mine the backstory
3. `/rapidfire` — surface instincts
4. `/hot-takes` — extract opinions
5. `/belief-mining` — find the principles
6. `/voice-capture` — capture the language
7. `/story-builder` — draft the content
8. `/brand-snapshot` — synthesize everything

Each session writes to a file in `data/`. That data persists across conversations so Claude always has context on who you are and what's already been covered.

## File Structure

```
.
├── .claude/
│   └── commands/          # Skill definitions (slash commands)
│       ├── intake.md
│       ├── origin-story.md
│       ├── rapidfire.md
│       ├── hot-takes.md
│       ├── belief-mining.md
│       ├── story-builder.md
│       ├── voice-capture.md
│       └── brand-snapshot.md
├── brand_guide/           # Supporting JS modules
├── config/
├── utils/
├── data/                  # Your session outputs (gitignored — stays local)
├── questions.md           # 160+ question bank used by /rapidfire
├── USER_PROFILE.md        # Your profile (gitignored — stays local)
├── CLAUDE.md              # Project config and behavior rules
├── .env.example           # API key template
└── package.json
```

## The Question Bank

`questions.md` contains 160+ questions across 9 categories:

- Origin & Backstory
- Industry & Expertise
- Beliefs & Philosophy
- Identity & Self-Perception
- Audience & Impact
- Content & Creative Process
- Contrarian & Provocative
- Future & Vision
- Relationships & Influences
- Money & Business
- Wildcard & Unexpected

Claude selects 15–20 per `/rapidfire` session based on your profile, gaps, and what's already been answered.

## Requirements

- [Claude Code CLI](https://claude.ai/claude-code)
- Node.js 18+
- API keys (see `.env.example`)
