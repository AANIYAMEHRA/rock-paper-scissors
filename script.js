// ---------- Configuration ----------
const CHOICES = {
  rock:     { icon: "✊",  name: "Rock",     beats: "scissors" },
  paper:    { icon: "✋",  name: "Paper",    beats: "rock" },
  scissors: { icon: "✌️", name: "Scissors", beats: "paper" },
};
const KEY_MAP = { r: "rock", p: "paper", s: "scissors" };
const COUNTDOWN = ["3", "2", "1", "Shoot!"];
const STEP_MS = 450;          // time between countdown steps
const HISTORY_LIMIT = 10;     // rounds shown in the history strip
const STORAGE_KEY = "rps-stats-v1";

// ---------- State ----------
const state = {
  player: 0,
  computer: 0,
  draws: 0,
  streak: 0,
  bestStreak: 0,
  history: [],    // newest first: { player, computer, outcome }
  busy: false,    // true while a round is in progress
};
let pendingTimers = [];

// ---------- DOM references ----------
const $ = (id) => document.getElementById(id);
const dom = {
  playerScore:   $("playerScore"),
  computerScore: $("computerScore"),
  drawScore:     $("drawScore"),
  streakScore:   $("streakScore"),
  streakBox:     $("streakBox"),
  playerHand:    $("playerHand"),
  computerHand:  $("computerHand"),
  status:        $("status"),
  history:       $("history"),
  choiceButtons: document.querySelectorAll(".choice-btn"),
  resetRound:    $("resetRoundBtn"),
  resetScore:    $("resetScoreBtn"),
};

// ---------- Game logic ----------
function randomChoice() {
  const keys = Object.keys(CHOICES);
  return keys[Math.floor(Math.random() * keys.length)];
}

// Returns "win", "lose" or "draw" from the player's point of view.
function decideOutcome(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "draw";
  return CHOICES[playerChoice].beats === computerChoice ? "win" : "lose";
}

function startRound(playerChoice) {
  if (state.busy || !CHOICES[playerChoice]) return;
  state.busy = true;
  setChoicesEnabled(false);
  setStatus("", "countdown");

  const cycle = Object.keys(CHOICES);

  // Countdown: 3, 2, 1, Shoot! – hands cycle through moves for effect
  COUNTDOWN.forEach((text, i) => {
    schedule(() => {
      const shown = CHOICES[cycle[i % cycle.length]].icon;
      dom.playerHand.textContent = shown;
      dom.computerHand.textContent = shown;
      restartAnimation(dom.playerHand, "tick");
      restartAnimation(dom.computerHand, "tick");
      setStatus(text, "countdown");
    }, i * STEP_MS);
  });

  // Reveal after the countdown
  schedule(() => revealRound(playerChoice), COUNTDOWN.length * STEP_MS);
}

function revealRound(playerChoice) {
  const computerChoice = randomChoice();
  const outcome = decideOutcome(playerChoice, computerChoice);

  // Update statistics
  if (outcome === "win") {
    state.player++;
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
  } else if (outcome === "lose") {
    state.computer++;
    state.streak = 0;
  } else {
    state.draws++;   // a draw does not break the streak
  }

  state.history.unshift({ player: playerChoice, computer: computerChoice, outcome });
  state.history = state.history.slice(0, HISTORY_LIMIT);
  state.busy = false;

  // Show the result
  showHands(playerChoice, computerChoice, outcome);
  setStatus(buildMessage(playerChoice, computerChoice, outcome), outcome);
  setChoicesEnabled(true);
  renderScore();
  renderHistory();
  saveStats();
}

function buildMessage(p, c, outcome) {
  const P = CHOICES[p].name, C = CHOICES[c].name;
  if (outcome === "win")  return `${P} beats ${C}. You win! 🎉`;
  if (outcome === "lose") return `${C} beats ${P}. Computer wins 😢`;
  return `Both chose ${P}. It's a draw! 🤝`;
}

function cancelRound() {
  if (!state.busy) return;
  clearPendingTimers();
  state.busy = false;
  resetHands();
  setStatus("Round cancelled. Make your move!");
  setChoicesEnabled(true);
}

function resetScore() {
  clearPendingTimers();
  Object.assign(state, {
    player: 0, computer: 0, draws: 0,
    streak: 0, bestStreak: 0,
    history: [], busy: false,
  });
  resetHands();
  setStatus("Scores reset. Make your move!");
  setChoicesEnabled(true);
  renderScore();
  renderHistory();
  saveStats();
}

// ---------- Timing helpers ----------
function schedule(fn, delay) {
  pendingTimers.push(setTimeout(fn, delay));
}
function clearPendingTimers() {
  pendingTimers.forEach(clearTimeout);
  pendingTimers = [];
}

// ---------- Rendering ----------
function showHands(playerChoice, computerChoice, outcome) {
  const mirror = { win: "lose", lose: "win", draw: "draw" };

  dom.playerHand.textContent = CHOICES[playerChoice].icon;
  dom.computerHand.textContent = CHOICES[computerChoice].icon;

  dom.playerHand.className = `hand reveal ${outcome}`;
  dom.computerHand.className = `hand reveal ${mirror[outcome]}`;
}

function resetHands() {
  dom.playerHand.textContent = "❔";
  dom.computerHand.textContent = "❔";
  dom.playerHand.className = "hand";
  dom.computerHand.className = "hand";
}

function restartAnimation(node, className) {
  node.classList.remove(className);
  void node.offsetWidth; // force reflow so the animation replays
  node.classList.add(className);
}

function setStatus(text, className = "") {
  dom.status.textContent = text;
  dom.status.className = `status ${className}`.trim();
}

function setChoicesEnabled(enabled) {
  dom.choiceButtons.forEach((btn) => (btn.disabled = !enabled));
}

function renderScore() {
  dom.playerScore.textContent = state.player;
  dom.computerScore.textContent = state.computer;
  dom.drawScore.textContent = state.draws;
  dom.streakScore.textContent = state.streak;
  dom.streakBox.title = `Current win streak (best: ${state.bestStreak})`;
}

function renderHistory() {
  dom.history.replaceChildren();

  if (state.history.length === 0) {
    const empty = document.createElement("span");
    empty.className = "empty";
    empty.textContent = "No rounds played yet.";
    dom.history.appendChild(empty);
    return;
  }

  // Oldest first, so the most recent round is on the right
  [...state.history].reverse().forEach((round) => {
    const chip = document.createElement("span");
    const letter = { win: "W", lose: "L", draw: "D" }[round.outcome];
    chip.className = `chip ${round.outcome}`;
    chip.textContent = letter;
    chip.title = `${CHOICES[round.player].name} vs ${CHOICES[round.computer].name}`;
    dom.history.appendChild(chip);
  });
}

// ---------- Persistence ----------
function saveStats() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      player: state.player,
      computer: state.computer,
      draws: state.draws,
      streak: state.streak,
      bestStreak: state.bestStreak,
      history: state.history,
    }));
  } catch (err) {
    // Storage can be unavailable (private mode, blocked); the game still works.
  }
}

function loadStats() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;
    state.player = Number(saved.player) || 0;
    state.computer = Number(saved.computer) || 0;
    state.draws = Number(saved.draws) || 0;
    state.streak = Number(saved.streak) || 0;
    state.bestStreak = Number(saved.bestStreak) || 0;
    state.history = Array.isArray(saved.history) ? saved.history.slice(0, HISTORY_LIMIT) : [];
  } catch (err) {
    // Corrupt or unavailable storage: start fresh.
  }
}

// ---------- Events ----------
dom.choiceButtons.forEach((btn) => {
  btn.addEventListener("click", () => startRound(btn.dataset.choice));
});

dom.resetRound.addEventListener("click", cancelRound);
dom.resetScore.addEventListener("click", resetScore);

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const choice = KEY_MAP[e.key.toLowerCase()];
  if (choice) {
    e.preventDefault();
    startRound(choice);
  }
});

// ---------- Init ----------
loadStats();
renderScore();
renderHistory();
setStatus("Make your move!");