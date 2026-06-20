# Report: Road Safety Flip Cards

## Project Overview

**Repository:** [github.com/kyawminht/road-safety](https://github.com/kyawminht/road-safety)
**Live Demo:** [road-safety-mm.vercel.app](https://road-safety-mm.vercel.app/)
**Author:** kyawminht
**Date:** 2026-06-20

## What I Built

A mobile-first Burmese road safety learning app for Myanmar children ages 6–17. The app teaches road safety through visual flip cards — children see the wrong behavior (red ❌), tap to reveal the correct behavior (green ✅), and learn through color, icons, and simple Burmese captions. No reading required.

## Methodology

I used an iterative, commit-driven development approach:

1. **Planning** — Defined the problem (Myanmar road safety for kids), identified the target audience (ages 6–17), and chose a visual-first interaction model (flip cards).
2. **Core Build** — Built the React + Vite + Tailwind stack, implemented the RevealCard component with Framer Motion animations, created the data layer with 14+ Burmese scenarios across 5 topics.
3. **Enhancement** — Added horizontal story-feed navigation, progress tracking, PDF download for teachers, and responsive mobile design.
4. **Analytics** — Integrated Mixpanel for tracking user engagement, card views, flips, and PDF downloads.
5. **Polish** — Custom traffic light favicon, SEO meta tags, Open Graph images, and educational license.
6. **Deployment** — Pushed to GitHub with frequent small commits, deployed to Vercel.

Each step resulted in a working, deployable version. Small, frequent commits kept the git history clean and reviewable.

## Claude Code Features Used

### MCP (Model Context Protocol)

**`.mcp.json`** — Configured two MCP servers:
- `@modelcontextprotocol/server-filesystem` — local file access
- `@modelcontextprotocol/server-github` — GitHub API integration

### Skills

Three custom skills defined in `.claude/skills/`:

1. **`react-developer/SKILL.md`** — Expert React developer skill for single-page mobile-first apps with 3D animations. Covers component architecture, Framer Motion flip cards, Tailwind CSS, and mobile optimization.

2. **`ui-ux-designer/SKILL.md`** — UI/UX design skill focused on mobile-first design systems, color theory, and accessibility for Burmese-language apps.

3. **`game-developer/SKILL.md`** — Game development skill for interactive educational content, gamification patterns, and quiz mechanics.

### Agent

**`.claude/agents/project-manager.md`** — Project Manager agent responsible for:
- Breaking down work into small tasks
- Reviewing code quality and consistency
- Ensuring requirements are met
- Tracking the project checklist

## Evidence

| Feature | Path | Exists |
|---------|------|--------|
| MCP Config | `.mcp.json` | ✅ |
| Skill: React Developer | `.claude/skills/react-developer/SKILL.md` | ✅ |
| Skill: UI/UX Designer | `.claude/skills/ui-ux-designer/SKILL.md` | ✅ |
| Skill: Game Developer | `.claude/skills/game-developer/SKILL.md` | ✅ |
| Agent: Project Manager | `.claude/agents/project-manager.md` | ✅ |
| Slides (Marp) | `slides/pechakucha-6x20.md` | ✅ |
| Claude Instructions | `.claude/CLAUDE.md` | ✅ |
| Report | `report.md` | ✅ |

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS 4
- Framer Motion (card flip animations)
- Mixpanel (analytics)
- Burmese Unicode (Noto Sans Myanmar font)

## Key Features

- 14+ flip card scenarios across 5 safety topics
- Tap-to-flip interaction with smooth 3D animations
- Horizontal story-feed navigation (Instagram-style)
- PDF flashcard download for teachers
- Mixpanel analytics (card views, flips, downloads)
- Mobile-first responsive design (320px–428px)
- 100% Burmese language
- Educational license (free for teachers, not for sale)

## What I Learned

- Visual-first design works better than text for children's education
- Single interaction model (tap to flip) reduces cognitive load
- PDF downloads bridge the digital divide for schools without projectors
- Small, frequent commits make it easy to track progress and rollback
- MCP servers extend Claude Code's capabilities for file and GitHub operations

## Future Improvements

- Add more scenarios and topics
- Implement quiz mode with active recall
- Teacher dashboard for tracking student progress
- Offline support with service workers
- Multi-language support (Burmese + English)
