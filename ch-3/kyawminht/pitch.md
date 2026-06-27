---
marp: true
theme: default
paginate: true
backgroundColor: #0F1A2E
color: #F8FAFC
style: |
  section {
    font-family: 'Noto Sans Myanmar', 'Segoe UI', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
  }
  h1 {
    color: #0D9488;
    font-size: 2.8em;
    margin-bottom: 0.3em;
  }
  h2 {
    color: #0D9488;
    font-size: 2em;
    margin-bottom: 0.5em;
  }
  p, li {
    font-size: 1.3em;
    line-height: 1.6;
  }
  ul {
    margin-top: 0.5em;
  }
  li {
    margin-bottom: 0.4em;
  }
  strong {
    color: #0D9488;
  }
  code {
    background: #1E3A5F;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.9em;
  }
  blockquote {
    border-left: 4px solid #0D9488;
    padding-left: 20px;
    font-style: italic;
    color: #94A3B8;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
  }
  th {
    background: #1E3A5F;
    color: #0D9488;
    padding: 12px;
    text-align: left;
  }
  td {
    padding: 12px;
    border-bottom: 1px solid #1E3A5F;
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  footer {
    color: #64748B;
    font-size: 0.8em;
  }
---

# 🚦 Road Safety for Myanmar Children

**A mobile-first flip card app teaching road safety to kids ages 6–17 through visual learning — no reading required.**

`road-safety-mm.vercel.app`

---

# 📊 The Problem

Myanmar has **one of the highest road fatality rates** in Southeast Asia.

- 🚨 Children are the most vulnerable road users
- 🏫 Schools lack projectors, screens, or internet
- 📖 Existing materials are text-heavy and outdated
- 👀 Kids learn better through **visuals**, not words

> Over 70% of children in Myanmar cannot access digital learning tools.

---

# 💡 The Solution

**Visual Flip Cards** — Instagram-style swipeable feed.

- **Tap to flip**: see the wrong behavior (❌) → reveal the correct behavior (✅)
- **5 topics**: Walking, Helmet, Sidecar, Bicycle, Tricycle
- **14+ real-world scenarios** with visual comparisons
- **100% Burmese** — zero English required
- **Color and icons** carry the meaning — no reading needed

---

# 🎯 How It Works

| Step | Action | Result |
|------|--------|--------|
| 1 | Child opens the app | Single screen, no menus |
| 2 | Sees a card | Wrong behavior (red, ❌) |
| 3 | Taps the card | Flips to correct behavior (green, ✅) |
| 4 | Swipes next | New scenario loads |
| 5 | Toggles quiz | "Which one is safe?" mode |

**One interaction model everywhere: Tap to flip.**

---

# 👨‍🏫 Teacher Tools & Accessibility

- **PDF Download** — teachers print flashcards for classroom use
- **No app store** — works on any phone browser
- **Mobile-first**: optimized for 320px–428px screens
- **Mixpanel analytics** — track usage, engagement, and downloads
- **Culturally relevant**: built for Myanmar roads and Myanmar children

---

# 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Analytics | Mixpanel |
| Hosting | Vercel |

**No backend. No auth. No complexity.**

---

# 📈 Impact & Reach

- 🌐 Deployed at `road-safety-mm.vercel.app`
- 💰 **Free and open** for educational use
- 👩‍🏫 Teachers can use without permission or signup
- 🇲🇲 Built for the children of Myanmar
- 📱 Works on any phone with a browser

> Not for sale — built for the children of Myanmar.

---

# 🗺️ Roadmap

**Phase 1** ✅ Complete
- Core flip card experience
- 5 topics, 14+ scenarios
- Quiz mode
- PDF download

**Phase 2** 🚧 In Progress
- More scenarios and topics
- Teacher dashboard
- Offline support

**Phase 3** 📋 Planned
- Audio narration in Burmese
- Multi-language support
- School integration tools

---

# 🙏 Thank You

**Road Safety for Myanmar Children**

A visual learning tool that meets kids where they are — on their phones, in their language, through their eyes.

`road-safety-mm.vercel.app`

---

# 📧 Contact

**Kyaw Min Htwe**

GitHub: `@kyawminht`

Project: `road-safety-mm.vercel.app`
