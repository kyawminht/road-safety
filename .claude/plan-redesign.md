# Redesign Plan — Road Safety Myanmar

## Scope

Complete rebuild of the app per `newui.md`. **Mobile + Desktop simultaneously.**

---

## Phase 1: Foundation

### 1A. Tailwind Theme + CSS
- File: `src/index.css`
- New palette: yellow (#FBBF24 / #F59E0B), black (#1A1A1A), red (#EF4444 / #DC2626), white (#FFFFFF), gray (#F3F4F6 / #D1D5DB)
- Road-sign inspired: high contrast, bold
- Noto Sans Myanmar font (keep existing)
- Rounded cards 16-24px radius default

### 1B. Route Architecture
- File: `src/App.jsx`
- Remove existing router → new structure
- Mobile routes: `/` (onboarding), `/home`, `/learn`, `/assess`, `/progress`, `/play`
- Desktop routes: `/teacher/*`, `/parent/*`
- Detect mobile vs desktop → render appropriate layout

### 1C. Supabase Schema
- SQL file: `supabase-schema.sql`
- Tables: profiles, parent_student_links, classes, class_students, topics, rule_cards, quiz_questions, quiz_attempts, quiz_attempt_answers
- RLS policies per role
- Apply via Supabase dashboard SQL editor

### 1D. Auth Context
- File: `src/context/AuthContext.jsx`
- Wrap existing `supabase` client + `useAuth` hook
- Add role-based methods: `loginAsTeacher()`, `loginAsParent()`, `loginAsStudent()`
- Store user profile + role in context

---

## Phase 2: Mobile (Student-Facing)

### 2A. Bottom Nav
- File: `src/components/layout/MobileNav.jsx`
- 4 tabs: Home 🏠 | Learn 📖 | Quiz 📝 | Progress 📊
- Icon + label (never icon-only)
- Active state: yellow underline
- `safe-area-inset-bottom` padding

### 2B. Onboarding (Screen 1)
- File: `src/pages/mobile/OnboardingPage.jsx`
- 3 role cards: Student / Teacher / Parent
- Large illustrations, bold title
- Tap role → store in context → navigate to home
- Full-screen, no nav bar

### 2C. Home (Screen 2)
- File: `src/pages/mobile/HomePage.jsx`
- Welcome message with role-based greeting
- 4 quick-action cards (large tap targets):
  - 📖 Learn Rules → /learn
  - 📝 Take Quiz → /assess
  - 📊 My Progress → /progress
  - 🎮 Play Game → /play
- "Continue Learning" section: show topic cards with progress bars

### 2D. Rule Cards Library (Screen 3)
- File: `src/pages/mobile/LearnPage.jsx`
- Horizontal filter tabs: All | Walking 🚶 | Helmet ⛑️ | Sidecar 🛵 | Bicycle 🚲 | Tricycle 🛺
- Search bar (filter by keyword)
- Grid of rule cards (reuse `FlipCard` component)
- Each card shows wrong→right on tap

### 2E. Card Detail (Screen 4)
- File: `src/pages/mobile/CardDetailPage.jsx`
- Full-screen card view
- Swipe left/right between cards (Framer Motion AnimatePresence)
- Tap to flip
- Prev/Next buttons
- Progress dots

### 2F. Quiz Flow (Screen 5)
- File: `src/pages/mobile/QuizPage.jsx`
- One question per screen
- Progress bar (Q 1/5)
- Multiple choice buttons (large, rounded)
- Correct: green pulse ✅ | Incorrect: red pulse ❌
- Auto-advance after correct
- Result screen at end with score gauge

### 2G. Score Results (Screen 6)
- File: `src/pages/mobile/ScorePage.jsx`
- Big score display: `4/5 (80%)`
- Score ring/circle visual
- "Topics to Review" chips → tap = deep-link to Learn filtered
- Retake button

### 2H. My Progress (Screen 7)
- File: `src/pages/mobile/ProgressPage.jsx`
- Streak counter (🔥 days in a row)
- Badge display (earned achievements)
- Per-topic progress bars
- "Recent Quiz Results" list

### 2I. Presentation/Group Mode (Screen 8)
- File: `src/pages/mobile/PresentationPage.jsx`
- Toggle-able by teacher
- Full-screen cards, no nav dots, no quiz
- Large text, large images
- Arrow nav only
- Projector-friendly

### 2J. Play/Simulator (Screen 9)
- File: `src/pages/mobile/PlayPage.jsx`
- Game hub: 3 game cards
- "လမ်းကူးခြင်း" road-crossing 2D canvas game
- Keep existing pedestrian game logic, restyle UI chrome

---

## Phase 3: Desktop — Teacher

### 3A. Left Sidebar
- File: `src/components/desktop/TeacherSidebar.jsx`
- Logo at top
- Nav items: Dashboard / My Classes / Content Library / Assessments / Reports
- Active state highlight
- User avatar + name + sign out at bottom

### 3B. Teacher Dashboard
- File: `src/pages/desktop/teacher/DashboardPage.jsx`
- Class roster table: student name, latest score, weak-topic tags, status badge
- "Class average by topic" chart (Recharts bar chart)
- "Assign Group Lesson" button
- "Present to Class" button (launches mobile PresentationPage)

### 3C. My Classes
- File: `src/pages/desktop/teacher/ClassesPage.jsx`
- List of classes
- Per-class student roster
- Add/remove students
- Quick stats per class

### 3D. Content Library
- File: `src/pages/desktop/teacher/ContentPage.jsx`
- Browse all rule cards
- Filter by topic
- Assign cards to classes (checkbox interface)
- Tag system

### 3E. Assessments
- File: `src/pages/desktop/teacher/AssessmentsPage.jsx`
- View quiz questions bank
- Create/edit questions
- View all student attempts
- Filter by class, topic, date

### 3F. Reports
- File: `src/pages/desktop/teacher/ReportsPage.jsx`
- Per-student score history (line chart)
- Per-topic class breakdown (bar chart)
- Exportable/printable summary
- Curriculum reference section

---

## Phase 4: Desktop — Parent

### 4A. Parent Sidebar
- File: `src/components/desktop/ParentSidebar.jsx`
- Simpler than teacher sidebar
- Child selector dropdown
- Nav: Dashboard / Quiz History / Resources

### 4B. Parent Dashboard
- File: `src/pages/desktop/parent/DashboardPage.jsx`
- Child selector (if >1 child)
- Score history line chart
- Per-topic mastery breakdown (Recharts)
- Badge/streak summary
- Latest quiz result highlight

### 4C. Quiz History
- File: `src/pages/desktop/parent/QuizHistoryPage.jsx`
- Past attempts list: date, score, topic
- "Retake Quiz" button per attempt (creates new attempt)
- Progress over time chart

### 4D. Resources
- File: `src/pages/desktop/parent/ResourcesPage.jsx`
- Links to rule cards
- Parent tips (reuse from curriculum.js)
- Downloadable worksheets

---

## Phase 5: Supabase Integration

### 5A. Data Service
- File: `src/lib/supabaseService.js`
- CRUD functions for all tables
- Quiz attempt tracking (never overwrite)
- Progress computation functions
- Topic suggestion logic

### 5B. RLS Policies
- Students: read/write own quiz_attempts only
- Parents: read attempts for linked children only
- Teachers: read/write own classes, read student data for enrolled students

### 5C. Environment
- `.env` — VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- `src/lib/supabase.js` — existing client (keep)

---

## File Count Estimate

| Phase | Files |
|-------|-------|
| Foundation | 6 |
| Mobile screens | 10 |
| Desktop Teacher | 8 |
| Desktop Parent | 6 |
| Supabase | 4 |
| **Total** | **~34 files** |

## Dependencies to Add

```json
{
  "recharts": "^2.x"
}
```

## Build Order

1. Foundation (theme, routes, auth, supabase schema)
2. Mobile: Onboarding → Home → BottomNav
3. Mobile: Learn → Card Detail → FlipCard component
4. Mobile: Quiz → Score → Progress
5. Mobile: Play (restyle games)
6. Desktop: Teacher sidebar → Dashboard → Classes
7. Desktop: Teacher Content → Assessments → Reports
8. Desktop: Parent sidebar → Dashboard → Quiz History
9. Supabase: Data service + RLS
