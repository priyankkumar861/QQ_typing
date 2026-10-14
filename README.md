# ⌨️ SSC & Railway Typing Exam Portal (DEST Simulation Engine)

A complete, full-stack Typing Platform specifically built for government exam aspirants preparing for **SSC CGL (DEST), SSC CHSL (Typing/DEST), and Railway RRB NTPC**.

---

## 🚀 Key Features

1. **Dual Interface Modes:**
   - **TCS iON Exam Hall Simulation Mode:** Authentic SSC examination interface with Node ID (C-042), candidate photo block, roll number, time remaining clock, strictly disabled right-click and copy/paste shortcuts.
   - **Modern Practice Mode:** High-productivity practice mode with real-time Gross WPM speed meter, customizable durations (3m, 5m, 10m, 15m), and mechanical keyboard sound toggle.

2. **Official SSC & Railway Evaluation Algorithm (`sscEvaluator.js`):**
   - **Full Mistakes (1.0 Penalty each):**
     - Omission of words
     - Substitution of incorrect words
     - Addition of extra words not in passage
   - **Half Mistakes (0.5 Penalty each):**
     - Spelling errors (typos within allowable edit distance)
     - Capitalization errors (uppercase vs lowercase)
     - Punctuation errors
   - **Formulas:**
     - `Total Mistakes = Full Mistakes + (Half Mistakes × 0.5)`
     - `Error % = (Total Mistakes / Total Words) × 100`
     - `Net WPM = Gross WPM - (Total Mistakes / Time in Minutes)`
     - `KDPH (Key Depressions Per Hour) = (Total Keystrokes / Time in Minutes) × 60`
   - **Category-wise Cutoff Matrix:**
     - Evaluates candidates against UR (5% / 7%), OBC/EWS (7% / 10%), SC/ST (10%) official cutoff limits.

3. **Interactive Word-by-Word Mistake Inspector:**
   - Color-coded diff of the user's typed passage against the master text.
   - Green (Correct), Red (Full Mistake with reason), Amber (Half Mistake with penalty).
   - Celebration confetti when candidate qualifies the cutoff!

4. **Authentic Passage Library & Custom Passages:**
   - Pre-loaded with SSC CGL, CHSL, and RRB NTPC previous year passages (English & Hindi).
   - Facility to add custom passages and set custom durations.

5. **Test History & Analytics:**
   - Tracks all completed tests, average net speed, peak speed, and qualification percentage.

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + Lucide Icons + Canvas Confetti
- **Backend:** Node.js + Express REST API
- **Evaluation Engine:** Dynamic Programming Levenshtein Distance & Word Alignment

---

## 🏃 Quick Start

To launch both the Node.js backend and React frontend:

```bash
cd typing-platform
npm run dev
```

Or on Windows, simply double click **`run.bat`**.

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
