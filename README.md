# ✊ ✋ ✌️ Rock Paper Scissors

A sleek, arcade-style Rock Paper Scissors game that runs entirely in your browser. Beat the computer, build a win streak, and track your history, with no installs and no internet connection required.

<img width="1862" height="948" alt="image" src="https://github.com/user-attachments/assets/ab9aae13-d9f1-4b8b-9502-73d0fcc16ed2" />

---

## 📑 Table of Contents

- [Features](#-features)
- [How to Play](#-how-to-play)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [Customization](#-customization)
- [Accessibility](#-accessibility)
- [Built With](#-built-with)
- [License](#-license)

---

## ✨ Features

| | Feature | Description |
| :-: | ------- | ----------- |
| ⏱️ | **Countdown reveal** | A 3-2-1-Shoot countdown builds suspense, with the hands cycling through the moves. |
| 💬 | **Clear results** | Every round explains the outcome, for example *"Rock beats Scissors. You win!"* |
| 📊 | **Scoreboard** | Tracks your wins, the computer's wins, draws, and your current win streak. |
| 🔥 | **Best streak** | Hover over the streak counter to see your personal best. |
| 🕘 | **Round history** | The last 10 rounds appear as W, L, or D tiles. Hover over a tile to see the moves played. |
| 💾 | **Saved progress** | Scores and history survive a page refresh. |
| ⌨️ | **Keyboard controls** | Play entirely from the keyboard. |
| ↩️ | **Cancel or reset** | Cancel a round in progress, or reset all scores at any time. |
| 📱 | **Responsive design** | Works on desktops, tablets, and phones. |
| ♿ | **Accessible** | Focus rings, screen-reader announcements, and reduced-motion support. |

---

## 🎮 How to Play

1. Click **Rock**, **Paper**, or **Scissors**, or press a key on your keyboard.
2. Watch the countdown: **3 → 2 → 1 → Shoot!**
3. See the computer's move and the result.

### Rules

| Your move | Beats | Loses to |
| --------- | ----- | -------- |
| ✊ Rock | ✌️ Scissors | ✋ Paper |
| ✋ Paper | ✊ Rock | ✌️ Scissors |
| ✌️ Scissors | ✋ Paper | ✊ Rock |

Matching moves are a **draw**. Draws don't break your win streak.

### Keyboard Shortcuts

| Key | Action |
| :-: | ------ |
| `R` | Play Rock |
| `P` | Play Paper |
| `S` | Play Scissors |

---

## 📁 Project Structure

```
rock-paper-scissors/
├── index.html    # Page structure
├── styles.css    # Visual design and animations
├── script.js     # Game logic, rendering, and saved stats
└── README.md     # Project documentation
```

---

## 🚀 Getting Started

No build step or dependencies are needed.

### Option 1: Open directly

Double-click `index.html` to open it in your browser.

### Option 2: Run a local server

From the project folder, start a simple server and visit the address it prints:

```bash
python -m http.server 5500
```

Then open [http://localhost:5500](http://localhost:5500) in your browser.

> **Note:** Keep `index.html`, `styles.css`, and `script.js` in the same folder. The HTML loads the other two files by relative path.

---

## 🧠 How It Works

- **State.** A single `state` object holds the scores, streak, history, and whether a round is in progress.
- **Round flow.** Choosing a move starts a timed countdown. When it finishes, the computer picks a random move, the outcome is calculated, and the scoreboard, hands, status line, and history are updated.
- **Safe cancellation.** Pending countdown timers are tracked, so cancelling or resetting mid-round stops cleanly without changing the scores.
- **Persistence.** After every round, stats are saved to `localStorage` under the key `rps-stats-v1`. If storage is unavailable, such as in private browsing, the game still works and simply doesn't remember your scores.

---

## 🎨 Customization

Most of the look is controlled by CSS variables at the top of `styles.css`:

```css
:root {
  --bg: #07071a;      /* page background */
  --cyan: #22d3ee;    /* primary accent */
  --pink: #f472b6;    /* secondary accent */
  --lime: #a3e635;    /* win colour */
  --amber: #fde047;   /* draw colour */
  /* ... */
}
```

Other settings you can change in `script.js`:

| Setting | Default | What it does |
| ------- | ------- | ------------ |
| `STEP_MS` | `450` | Milliseconds between countdown steps |
| `HISTORY_LIMIT` | `10` | Number of rounds kept in the history |
| `STORAGE_KEY` | `"rps-stats-v1"` | Key used to save stats in the browser |

---

## ♿ Accessibility

- All buttons are real `<button>` elements, so they work with the keyboard and screen readers.
- The status line uses `aria-live="polite"`, so results are announced as they happen.
- Visible focus rings appear on interactive elements.
- Animations turn off automatically for users who have enabled *reduce motion* in their operating system.

---

## 🛠️ Built With

- **HTML5** for structure
- **CSS3** with custom properties, gradients, and keyframe animations
- **Vanilla JavaScript**, with no frameworks or libraries

---

## 📄 License

This project is free to use, modify, and share.

Have fun, and may the best hand win! 🏆
