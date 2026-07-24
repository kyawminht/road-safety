# Prompt: Rebuild App UI/UX to Match Canva Mockups + Add Desktop Views + Supabase

Paste everything below into your coding agent.

---

## Context

I have an existing "Road Safety Myanmar" education app already implemented (mobile + web, React), but the current UI/UX does not match the design direction I want. Rework the front-end to match a new Canva-based design system, and add two new desktop views (Teacher, Parent) that don't exist yet. Data persistence should use Supabase.

**You are allowed to break/replace the current UI components.** Do not preserve old visual styling — only preserve existing business logic, routes, and data-fetching hooks where reasonable, and refactor them to the new design.

## Reference designs (Canva)

These are the approved mockups — match layout structure, color usage, spacing rhythm, and component shapes as closely as possible. Treat them as the source of truth for visual design, not literal pixel copies.

Mobile:
- Onboarding / role select: https://www.canva.com/d/g6m9M3CGNB9Y_yd
- Home: https://www.canva.com/d/Id3dayzrtsFb3OQ
- Rule Cards library: https://www.canva.com/d/dzSzRlUBb4VFYgU
- Rule Card detail: https://www.canva.com/d/zjM9QLIMS2Ip7Yw
- Quiz + Score results: https://www.canva.com/d/eomqLbIrNff3rUz
- My Progress: https://www.canva.com/d/LFw1FTifRPN5IqN
- Group teaching / presentation mode: https://www.canva.com/d/25C-Y6DBe3eQjrM
- Simulator game (static reference frame): https://www.canva.com/d/YbnSb3_9qmllU1s

Desktop:
- Teacher dashboard: https://www.canva.com/d/l6i-FmLxtP_JJ7D

## Design system to extract from the mockups

- **Palette**: yellow / black / red (road-sign inspired), high contrast, generous white space
- **Shape language**: rounded cards (16–24px radius), large flat icon illustrations, no heavy gradients/shadows
- **Typography**: bold, large headings for kids-facing screens; smaller/denser type only on the teacher/parent data screens; support bilingual text (Burmese + English) — pick a font stack with full Burmese Unicode coverage and test line-height with Burmese script
- **Touch targets**: minimum 44x44px on mobile, primary actions always full-width or clearly the largest element on screen
- **Navigation**: bottom tab bar on mobile (Home / Rule Cards / Quiz / Progress); left sidebar on desktop (Dashboard / Classes / Content Library / Assessments / Reports)
- **Consistency rule**: the card component used for rule cards should be the *same* base component reused (with a size/detail variant) across the library grid, the card-detail screen, and the presentation mode — don't create three different card components

## UX rules to enforce (non-negotiable)

1. One clear primary action per screen — everything else is visually secondary.
2. Recognition over recall — icon + text label together, never icon-only for primary nav.
3. Immediate feedback on every interaction (tap states, quiz answer feedback, loading states).
4. Progressive disclosure — student views stay simple; teacher/parent views can show more density.
5. Consistent placement of back/exit/nav controls across all screens.
6. Every screen must be usable one-handed on a standard phone (primary actions in thumb-reach zone, i.e. lower half of screen).
7. Bilingual (Burmese/English) labels wherever text appears — never hardcode one language without a toggle or side-by-side display.

## Screens to implement/rebuild

### Mobile (student-facing)
Rebuild these to match the mockups: Onboarding/role select, Home, Rule Cards library (with filter tabs + search), Rule Card detail (swipe/next-prev between cards), Quiz flow (one question per screen, progress bar), Score results (score gauge + "topics to review" chips that deep-link back into Rule Card detail for that topic), My Progress (streak, badges, per-topic progress bars), Group/Presentation mode (large text, arrow nav, no quiz elements — toggle-able by teacher), Simulator game shell (the actual crossing-game logic can stay as-is if already built; just restyle the surrounding UI chrome — score/lives/buttons — to match).

### Desktop — Teacher (rebuild to match mockup + extend)
- Sidebar: Dashboard / My Classes / Content Library / Assessments / Reports
- Dashboard: class roster table (student name, latest score, weak-topic tags, status badge), "Class average by topic" chart, "Assign Group Lesson" button, "Present to Class" button (launches the mobile presentation-mode view on a connected screen/projector)
- Content Library: browse/filter rule cards by topic, tag which ones are assigned to which class
- Reports: per-student score history over time (line chart), per-topic class breakdown (bar chart), exportable/printable summary — this is also the part worth polishing for the "school curriculum reference" goal you mentioned, since it's what a curriculum committee would actually look at

### Desktop — Parent (new, not mocked yet — build using the same design system/components as the Teacher dashboard, just simplified for a single child instead of a class)
- Login/role-select already covers Parent as a role
- **Child selector** if more than one child is linked to the account
- **Progress dashboard** for the selected child:
  - Score history line chart (score over time, per attempt)
  - Per-topic mastery breakdown (bar or radar chart) — same charting library as teacher view, for consistency
  - Badge/streak summary (reuse the mobile "My Progress" visuals, adapted to desktop width)
- **Quiz history list**: past attempts with date, score, and a **"Retake Quiz"** button per attempt (or a single persistent "Retake Quiz" CTA that starts a fresh attempt) — retaking should create a *new* attempt record, never overwrite the old one, so progress-over-time charts stay meaningful
- Keep information density lower than the teacher view — a parent is checking on one child, not managing a class; don't reuse the dense roster-table pattern here

## Data layer — Supabase

Use Supabase for auth (roles: student, teacher, parent) and data storage. Suggested minimal schema to start with — adjust to fit whatever you already have:

```sql
-- profiles (extends supabase auth.users)
profiles (
  id uuid primary key references auth.users,
  role text check (role in ('student','teacher','parent')),
  display_name text,
  language_pref text default 'mm'
)

-- links a parent to one or more student profiles
parent_student_links (
  parent_id uuid references profiles(id),
  student_id uuid references profiles(id),
  primary key (parent_id, student_id)
)

-- links a teacher to a class, and students to a class
classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references profiles(id),
  name text
)
class_students (
  class_id uuid references classes(id),
  student_id uuid references profiles(id),
  primary key (class_id, student_id)
)

topics (
  id uuid primary key default gen_random_uuid(),
  name text,
  name_mm text
)

rule_cards (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id),
  title text,
  title_mm text,
  body text,
  body_mm text,
  illustration_url text
)

quiz_questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id),
  question text,
  question_mm text,
  choices jsonb,
  correct_choice_index int
)

-- one row per quiz attempt — never overwritten, so retakes build history
quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id),
  started_at timestamptz default now(),
  completed_at timestamptz,
  score int,
  total int
)

quiz_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references quiz_attempts(id),
  question_id uuid references quiz_questions(id),
  selected_choice_index int,
  is_correct boolean
)
```

Row-Level Security notes:
- Students can only read/write their own `quiz_attempts` / `quiz_attempt_answers`.
- Parents can read (not write) attempts for students linked via `parent_student_links`.
- Teachers can read (not write) attempts for students linked via `class_students` → `classes`.

## Charting

Use one charting library consistently across Teacher and Parent desktop views (e.g. Recharts) — don't mix libraries between the two dashboards, since they should feel like the same product family.

## Acceptance checklist before calling a screen "done"

- [ ] Matches the reference mockup's layout structure and color system
- [ ] Bilingual text present where applicable
- [ ] Primary action is visually obvious within 1 second of looking at the screen
- [ ] Touch targets ≥44px on mobile
- [ ] Retaking a quiz creates a new attempt, doesn't overwrite history
- [ ] Parent view only shows their linked child/children (RLS enforced, not just UI-hidden)
- [ ] Teacher view only shows their own class(es)
