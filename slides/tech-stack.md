---
marp: true
theme: default
paginate: true
---

# Road Safety for Myanmar Children

Tech stack, AI workflow, skills, agents, triggers, and commands.

---

# Product

- Mobile-first road-safety learning app for Myanmar children ages 6-17
- Visual flip cards show unsafe behavior first, then safe behavior after a tap
- Interactive games reinforce visibility, hazard spotting, and pedestrian priority
- Teachers can download printable flashcards for classrooms without projectors

---

# Tech Stack

- React 19 + Vite 8 for the web app
- React Router for page navigation
- Tailwind CSS 4 for responsive styling
- Framer Motion for flip-card and screen transitions
- Canvas/Web Audio patterns for interactive game feedback
- Supabase client for auth/data features
- Vercel for deployment

---

# AI Tools Used

- Claude Code for planning, implementation, review, and report writing
- Filesystem MCP for reading and updating local project files
- GitHub MCP configuration for repository workflow support
- Superpowers planning docs for structured design notes and implementation plans

---

# Skills

- `.claude/skills/react-developer/SKILL.md`
- Builds mobile-first React pages, reusable components, animations, and responsive UI

- `.claude/skills/ui-ux-designer/SKILL.md`
- Guides child-friendly visual design, accessibility, spacing, color, and Burmese-language UX

- `.claude/skills/game-developer/SKILL.md`
- Guides educational game loops, scoring, feedback, and simple quiz interactions

---

# Subagent

- `.claude/agents/project-manager.md`
- Breaks roadmap work into small tasks
- Checks feature completeness against requirements
- Reviews project consistency before shipping
- Tracks next steps and implementation priorities

---

# Methodology

1. Define the learner problem and target users
2. Build a simple visual learning loop: see, tap, compare, remember
3. Add games to turn safety rules into practice
4. Keep screens mobile-first for low-resource classrooms
5. Deploy early, test the live URL, and collect feedback for the next chapter

---

# Trigger And Commands

- React skill trigger: when building or refactoring app UI and components
- UI/UX skill trigger: when polishing screens for children, parents, and teachers
- Game skill trigger: when designing quiz/game mechanics and feedback
- Project-manager agent trigger: when planning, sequencing, or reviewing feature work

Commands:

- `npm run dev`
- `npm run build`
- `npm run lint`
- Ask Claude Code to use the relevant skill or project-manager agent for the next task

---

# Live Project

- Repo: `https://github.com/kyawminht/road-safety`
- Live URL: `https://road-safety-mm.vercel.app/`
- Chapter 5 evidence:
  - `slides/tech-stack.md`
  - `feedback/interview-notes.md`
