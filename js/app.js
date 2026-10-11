const LEVEL_SEQUENCE = [10, 5, 1, 2, 3, 4, 6, 7, 8, 9];

function getLevelSequencePosition(levelId) {
  const index = LEVEL_SEQUENCE.indexOf(levelId);
  return index === -1 ? LEVEL_SEQUENCE.length + Number(levelId) : index;
}

function getLevelDisplaySlot(levelId) {
  return getLevelSequencePosition(levelId) + 1;
}

function getLevelDisplayNumber(levelId) {
  return getLevelDisplaySlot(levelId);
}

function isLevelUnlocked(levelId) {
  return getLevelDisplaySlot(levelId) <= player.unlockedLevel;
}

const levels = Object.values(window.QUEST_LEVELS || {}).sort((a, b) => getLevelSequencePosition(a.id) - getLevelSequencePosition(b.id));
const PLAYER_STORAGE_KEY = "vinsinfo-coding-quest-player-v1";
const LEADERBOARD_STORAGE_KEY = "vinsinfo-coding-quest-leaderboard-v1";
const QUESTIONS_PER_GAME = 30;

const player = {
  name: "Player",
  xp: 0,
  streak: 0,
  bestScore: 0,
  bestStreak: 0,
  unlockedLevel: 1,
  completedLevels: new Set(),
  bestLevelScores: {}
};

const QUESTION_TIME_LIMIT = 60;
const MAX_LIVES = 5;

let currentLevel = null;
let currentQuestions = [];
let questionIndex = 0;
let score = 0;
let lives = MAX_LIVES;
let correctAnswers = 0;
let levelStreak = 0;
let bestLevelStreak = 0;
let timerId = null;
let timeLeft = QUESTION_TIME_LIMIT;
let answered = false;
let hintUsed = false;
let earnedXP = 0;
let nextLevelId = null;

const $ = id => document.getElementById(id);

function announceStatus(message) {
  const liveRegion = $("liveRegion");
  if (!liveRegion) return;
  liveRegion.textContent = "";
  window.setTimeout(() => {
    liveRegion.textContent = message;
  }, 20);
}

let audioContext = null;

function ensureAudioContext() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioContext) audioContext = new AudioCtor();
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

function playTone({ frequency, duration = 0.16, volume = 0.04, type = "sine", delay = 0, sweep = 0 }) {
  const context = ensureAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime + delay);
  if (sweep) {
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(40, frequency + sweep),
      context.currentTime + delay + duration
    );
  }

  gainNode.gain.setValueAtTime(0.0001, context.currentTime + delay);
  gainNode.gain.exponentialRampToValueAtTime(volume, context.currentTime + delay + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime + delay);
  oscillator.stop(context.currentTime + delay + duration);
}

function playAnswerSound(isCorrect) {
  if (isCorrect) {
    playTone({ frequency: 660, duration: 0.12, volume: 0.05, type: "triangle", sweep: 120 });
    setTimeout(() => playTone({ frequency: 880, duration: 0.14, volume: 0.05, type: "triangle", sweep: 150 }), 90);
  } else {
    playTone({ frequency: 220, duration: 0.18, volume: 0.045, type: "sawtooth", sweep: -90 });
  }
}

function triggerCardAnimation(type) {
  const card = document.querySelector(".question-card");
  if (!card) return;
  card.classList.remove("answer-correct", "answer-incorrect");
  void card.offsetWidth;
  card.classList.add(type === "correct" ? "answer-correct" : "answer-incorrect");
  setTimeout(() => card.classList.remove(type === "correct" ? "answer-correct" : "answer-incorrect"), 330);
}

function loadPlayerProgress() {
  let savedProgress;
  try {
    const serializedProgress = localStorage.getItem(PLAYER_STORAGE_KEY);
    if (!serializedProgress) return;
    savedProgress = JSON.parse(serializedProgress);
  } catch (error) {
    console.error("Unable to read saved Coding Quest progress.", error);
    return;
  }

  if (!savedProgress || typeof savedProgress !== "object") {
    console.error("Saved Coding Quest progress has an invalid format.");
    return;
  }

  const completedLevelIds = Array.isArray(savedProgress.completedLevels)
    ? savedProgress.completedLevels.filter(id => Number.isInteger(id) && levels.some(level => level.id === id))
    : [];
  const highestCompletedSlot = completedLevelIds.length
    ? Math.max(...completedLevelIds.map(getLevelDisplaySlot))
    : 0;
  const savedUnlockedLevel = Number.isInteger(savedProgress.unlockedLevel)
    ? Math.max(1, Math.min(savedProgress.unlockedLevel, levels.length))
    : 1;

  const savedName = typeof savedProgress.name === "string" ? savedProgress.name.trim() : "";
  player.name = savedName || "Player";
  player.xp = Number.isFinite(savedProgress.xp) && savedProgress.xp >= 0 ? savedProgress.xp : 0;
  player.streak = Number.isInteger(savedProgress.streak) && savedProgress.streak >= 0 ? savedProgress.streak : 0;
  player.bestScore = Number.isFinite(savedProgress.bestScore) && savedProgress.bestScore >= 0 ? savedProgress.bestScore : 0;
  player.bestStreak = Number.isInteger(savedProgress.bestStreak) && savedProgress.bestStreak >= 0 ? savedProgress.bestStreak : 0;
  player.unlockedLevel = Math.max(savedUnlockedLevel, Math.min(highestCompletedSlot + 1, levels.length));
  player.completedLevels = new Set(completedLevelIds);

  const rawBestLevelScores = savedProgress.bestLevelScores && typeof savedProgress.bestLevelScores === "object"
    ? savedProgress.bestLevelScores
    : {};
  player.bestLevelScores = {};
  Object.entries(rawBestLevelScores).forEach(([levelId, score]) => {
    const levelNumber = Number(levelId);
    if (Number.isInteger(levelNumber) && levelNumber >= 1 && Number.isFinite(score) && score >= 0) {
      player.bestLevelScores[levelNumber] = Math.max(score, player.bestLevelScores[levelNumber] || 0);
    }
  });
}

function savePlayerProgress() {
  try {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify({
      name: player.name,
      xp: player.xp,
      streak: player.streak,
      bestScore: player.bestScore,
      bestStreak: player.bestStreak,
      unlockedLevel: player.unlockedLevel,
      completedLevels: [...player.completedLevels],
      bestLevelScores: player.bestLevelScores
    }));
  } catch (error) {
    console.error("Unable to save Coding Quest progress.", error);
  }
}

function getLeaderboardEntries() {
  try {
    const entries = JSON.parse(localStorage.getItem(LEADERBOARD_STORAGE_KEY) || "[]");
    return Array.isArray(entries) ? entries.filter(entry => entry && typeof entry.score === "number" && Number.isFinite(entry.score)) : [];
  } catch (error) {
    console.error("Unable to read leaderboard data.", error);
    return [];
  }
}

function saveLeaderboardEntries(entries) {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Unable to save leaderboard data.", error);
  }
}

function renderLeaderboardEntries(entries) {
  const list = $("leaderboardList");
  if (!list) return;

  list.replaceChildren();
  if (!entries.length) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "leaderboard-empty";
    emptyItem.textContent = "No runs logged yet. Finish a level to set a score.";
    list.appendChild(emptyItem);
    return;
  }

  entries.slice(0, 10).forEach((entry, index) => {
    const item = document.createElement("li");
    item.className = "leaderboard-item";

    const rank = document.createElement("span");
    rank.className = "leaderboard-rank";
    rank.textContent = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;

    const summary = document.createElement("span");
    summary.className = "leaderboard-summary";
    summary.textContent = `${getDisplayName(entry.name)} · ${entry.score} pts · Level ${entry.level || 1}`;

    const date = entry.created_at || entry.date;
    const when = document.createElement("span");
    when.className = "leaderboard-time";
    when.textContent = date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Recent";

    item.append(rank, summary, when);
    list.appendChild(item);
  });
}

function getDisplayName(name) {
  const safeName = typeof name === "string" ? name.trim() : "";
  return safeName || "Player";
}

function renderLeaderboard() {
  const selectedLevel = $("leaderboardLevelFilter").value;
  const filteredEntries = getLeaderboardEntries().filter(entry =>
    selectedLevel === "all" || Number(entry.level) === Number(selectedLevel)
  );
  const entries = [...filteredEntries].sort((a, b) => b.score - a.score).slice(0, 10);
  renderLeaderboardEntries(entries);
}

async function loadGlobalLeaderboard() {
  const status = $("leaderboardStatus");
  const selectedLevel = $("leaderboardLevelFilter").value;
  status.textContent = "Loading shared scores…";
  try {
    const query = new URLSearchParams({ level: selectedLevel });
    const response = await fetch(`/api/leaderboard?${query}`);
    if (!response.ok) throw new Error(`Leaderboard request failed (${response.status}).`);
    const data = await response.json();
    if (!Array.isArray(data.entries)) throw new Error("The leaderboard response has an invalid format.");
    renderLeaderboardEntries(data.entries);
    status.textContent = selectedLevel === "all"
      ? "Scores shared across all players and levels."
      : `Scores shared across all players for Level ${selectedLevel}.`;
  } catch (error) {
    console.error("Unable to load the global leaderboard.", error);
    renderLeaderboard();
    status.textContent = "Global leaderboard unavailable. Showing scores saved in this browser.";
  }
}

async function submitGlobalLeaderboardRun(entry) {
  const status = $("leaderboardStatus");
  try {
    const response = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Score submission failed (${response.status}).`);
    }
    const data = await response.json();
    if (!Array.isArray(data.entries)) throw new Error("The leaderboard response has an invalid format.");
    $("leaderboardLevelFilter").value = String(entry.level);
    renderLeaderboardEntries(data.entries);
    status.textContent = `Your score was added to the Level ${entry.level} leaderboard.`;
  } catch (error) {
    console.error("Unable to submit the score to the global leaderboard.", error);
    status.textContent = `${error.message} The run remains saved only in this browser.`;
  }
}

function toggleLeaderboard() {
  const panel = $("leaderboardPanel");
  if (!panel) return;
  const isHidden = panel.classList.toggle("hidden");
  $("leaderboardButton").textContent = isHidden ? "View Leaderboard" : "Hide Leaderboard";
  if (!isHidden) loadGlobalLeaderboard();
}

function syncPlayerNameFromInput() {
  const input = $("playerNameInput");
  if (!input) return;
  player.name = getDisplayName(input.value);
  input.value = player.name;
  savePlayerProgress();
}

function showScreen(screenId) {
  ["dashboard", "gameScreen", "resultScreen"].forEach(id => $(id).classList.add("hidden"));
  $(screenId).classList.remove("hidden");
}

function getTopLevelSummary() {
  const entries = Object.entries(player.bestLevelScores);
  if (!entries.length) return { label: "—", score: 0 };
  const [levelId, score] = entries.reduce((best, current) => current[1] > best[1] ? current : best, entries[0]);
  return {
    label: `Level ${getLevelDisplayNumber(levelId)}`,
    score: Number(score)
  };
}

function resetPlayerProgress() {
  if (!window.confirm("Reset your progress and best scores? This cannot be undone.")) return;

  player.xp = 0;
  player.streak = 0;
  player.bestScore = 0;
  player.bestStreak = 0;
  player.unlockedLevel = 1;
  player.completedLevels = new Set();
  player.bestLevelScores = {};
  savePlayerProgress();
  renderLevels();
  renderStats();
  announceStatus("Progress reset successfully.");
}

function renderStats() {
  $("xp").textContent = player.xp;
  $("streak").textContent = player.streak;
  $("bestScore").textContent = player.bestScore;
  $("bestStreak").textContent = player.bestStreak;
  const topLevel = getTopLevelSummary();
  $("panelBestScore").textContent = player.bestScore;
  $("panelBestStreak").textContent = player.bestStreak;
  $("panelTopLevel").textContent = topLevel.score ? `${topLevel.label} (${topLevel.score})` : "—";

  const completed = player.completedLevels.size;
  const progress = levels.length ? completed / levels.length * 100 : 0;
  $("progressBar").style.width = `${progress}%`;
  $("progressBar").parentElement.setAttribute("aria-valuenow", completed);
  $("progressBar").parentElement.setAttribute("aria-valuemax", levels.length);
  $("progressText").textContent = `${completed} of ${levels.length} levels completed | Level ${player.unlockedLevel} unlocked`;

  const recommendedLevel = getRecommendedLevel();
  if (recommendedLevel) {
    const isReplay = player.completedLevels.has(recommendedLevel.id);
    $("continueLearningLabel").textContent = `${isReplay ? "Replay" : completed ? "Continue to" : "Start"} Level ${getLevelDisplayNumber(recommendedLevel.id)}`;
  }
}

function getRecommendedLevel() {
  return levels.find(level => isLevelUnlocked(level.id) && !player.completedLevels.has(level.id))
    || levels[levels.length - 1];
}

function renderLevels() {
  const grid = $("levelGrid");
  grid.replaceChildren();

  levels.forEach(level => {
    const unlocked = isLevelUnlocked(level.id);
    const completed = player.completedLevels.has(level.id);
    const displayNumber = getLevelDisplayNumber(level.id);
    const card = document.createElement("article");
    card.className = `level-card${unlocked ? "" : " locked"}${completed ? " completed" : ""}`;
    card.setAttribute("aria-label", `Level ${displayNumber}: ${level.title}, ${completed ? "completed" : unlocked ? "unlocked" : "locked"}`);

    const cardTop = document.createElement("div");
    cardTop.className = "level-card-top";
    const icon = document.createElement("div");
    icon.className = "level-number";
    icon.textContent = unlocked ? level.icon : "🔒";
    icon.setAttribute("aria-hidden", "true");

    const status = document.createElement("span");
    status.className = "level-status";
    status.textContent = completed ? "Completed ✓" : unlocked ? "Unlocked" : "Locked";
    cardTop.append(icon, status);

    const title = document.createElement("h3");
    title.textContent = `Level ${displayNumber}: ${level.title}`;

    const description = document.createElement("p");
    description.textContent = level.description;

    const meta = document.createElement("div");
    meta.className = "level-meta";
    const levelNumber = document.createElement("span");
    levelNumber.textContent = `Level ${String(displayNumber).padStart(2, "0")}`;
    const questionCount = document.createElement("span");
    questionCount.textContent = `${level.questions.length}-question bank`;
    const bestScore = player.bestLevelScores[level.id] ?? 0;
    const bestScoreDisplay = document.createElement("span");
    bestScoreDisplay.className = "level-best-score";
    bestScoreDisplay.textContent = bestScore ? `Best ${bestScore}` : "No best yet";
    meta.append(levelNumber, questionCount, bestScoreDisplay);

    const button = document.createElement("button");
    button.className = `btn ${unlocked ? "primary" : "secondary"}`;
    button.textContent = completed ? "Play Again" : unlocked ? "View Level" : "Locked";
    button.disabled = !unlocked;
    button.addEventListener("click", () => showLevel(level.id));

    card.append(cardTop, title, description, meta, button);
    grid.appendChild(card);
  });
  renderStats();
}

function showLevel(levelId) {
  currentLevel = levels.find(level => level.id === levelId);
  if (!currentLevel || !isLevelUnlocked(levelId)) return;

  $("levelGrid").classList.add("hidden");
  $("levelDetails").classList.remove("hidden");
  $("detailsContent").replaceChildren();

  const title = document.createElement("h2");
  title.textContent = `${currentLevel.icon} Level ${getLevelDisplayNumber(currentLevel.id)}: ${currentLevel.title}`;
  const description = document.createElement("p");
  description.textContent = currentLevel.description;
  const topicTitle = document.createElement("h3");
  topicTitle.textContent = "Topics covered";
  const topicList = document.createElement("ul");

  currentLevel.topics.forEach(topic => {
    const item = document.createElement("li");
    item.textContent = topic;
    topicList.appendChild(item);
  });

  const info = document.createElement("p");
  const gameQuestionCount = Math.min(QUESTIONS_PER_GAME, currentLevel.questions.length);
  info.textContent = `${gameQuestionCount} questions per game, randomly selected from ${currentLevel.questions.length} | ${QUESTION_TIME_LIMIT} seconds per question | ${MAX_LIVES} lives`;
  $("detailsContent").append(title, description, topicTitle, topicList, info);
  $("startButton").textContent = "Start Level 🚀";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToLevels() {
  $("levelDetails").classList.add("hidden");
  $("levelGrid").classList.remove("hidden");
  currentLevel = null;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function updateLivesDisplay() {
  const safeLives = Math.max(0, lives);
  $("lives").textContent = "❤️".repeat(safeLives) + "🖤".repeat(Math.max(0, MAX_LIVES - safeLives));
  $("lives").setAttribute("aria-label", `${safeLives} ${safeLives === 1 ? "life" : "lives"} remaining`);
}

function startLevel() {
  if (!currentLevel) return;
  clearInterval(timerId);
  currentQuestions = shuffle(currentLevel.questions).slice(0, QUESTIONS_PER_GAME);
  questionIndex = 0;
  score = 0;
  lives = MAX_LIVES;
  correctAnswers = 0;
  levelStreak = 0;
  bestLevelStreak = 0;
  earnedXP = 0;
  $("score").textContent = score;
  updateLivesDisplay();
  $("gameStreak").textContent = levelStreak;
  $("levelDetails").classList.add("hidden");
  showScreen("gameScreen");
  renderQuestion();
}

function findMatchingCodeDelimiter(source, openingIndex, openingCharacter, closingCharacter) {
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = openingIndex; index < source.length; index++) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
    } else if (character === "\"" || character === "'") {
      quote = character;
    } else if (character === openingCharacter) {
      depth++;
    } else if (character === closingCharacter && --depth === 0) {
      return index;
    }
  }
  return -1;
}

function findCodeStatementEnd(source, startIndex) {
  let parentheses = 0;
  let braces = 0;
  let quote = "";
  let escaped = false;

  for (let index = startIndex; index < source.length; index++) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
    } else if (character === "\"" || character === "'") {
      quote = character;
    } else if (character === "(") {
      parentheses++;
    } else if (character === ")") {
      parentheses = Math.max(0, parentheses - 1);
    } else if (character === "{") {
      braces++;
    } else if (character === "}") {
      braces = Math.max(0, braces - 1);
    } else if (character === ";" && parentheses === 0 && braces === 0) {
      return index + 1;
    }
  }
  return -1;
}

function extractCodeSnippet(text) {
  if (/\bfor each\b/i.test(text)) return null;
  const codeStartPattern = /\b(?:for|while|if|switch)\s*\(|\b(?:int|char|float|double|long|short|boolean|String|void)\s+[A-Za-z_]\w*\s*(?:=|;|\[\d+\])|\b(?:printf|System\.out\.(?:print|println)|print)\s*\(|\b(?:SET|FOR)\s+[A-Za-z_]\w*\s*=|\b(?:const|let|var)\s+[A-Za-z_]\w*\s*=/gi;
  const match = codeStartPattern.exec(text);
  if (!match) return null;

  let prefix = text.slice(0, match.index).trim().replace(/[:\s]+$/, "");
  let code = text.slice(match.index).trim();
  let suffix = "";
  const arrayDeclaration = match[0].match(/^(?:int|char|float|double|long|short|boolean|String)\s+[A-Za-z_]\w*\s*\[\d+\]/i);
  if (arrayDeclaration) {
    const trailingText = code.slice(arrayDeclaration[0].length);
    if (/^\s+(?:in|what|how|which|why|does|is)\b/i.test(trailingText)) {
      suffix = trailingText.trim().replace(/[?.!]\s*$/, "");
      code = code.slice(0, arrayDeclaration[0].length);
    }
  }
  const trailingPrompt = code.match(/;\s*,?\s*(?=(?:what|how|which|why|does|will|is the|the value|value of|print(?:[?.!]|$)))/i);
  if (!suffix && trailingPrompt) {
    const suffixIndex = trailingPrompt.index + trailingPrompt[0].length;
    suffix = code.slice(suffixIndex).replace(/[?.!]\s*$/, "").trim();
    code = code.slice(0, trailingPrompt.index + 1).trim();
  }
  const controlHeader = code.match(/^(?:for|if|while|switch)\s*\(/i);
  if (!suffix && controlHeader) {
    let parentheses = 0;
    let headerQuote = "";
    let headerEscaped = false;
    let headerEnd = -1;
    for (let index = controlHeader[0].length - 1; index < code.length; index++) {
      const character = code[index];
      if (headerQuote) {
        if (headerEscaped) headerEscaped = false;
        else if (character === "\\") headerEscaped = true;
        else if (character === headerQuote) headerQuote = "";
      } else if (character === "\"" || character === "'") {
        headerQuote = character;
      } else if (character === "(") {
        parentheses++;
      } else if (character === ")") {
        parentheses--;
        if (parentheses === 0) {
          headerEnd = index + 1;
          break;
        }
      }
    }

    if (headerEnd >= 0) {
      const trailingText = code.slice(headerEnd).trim();
      if (/^(?:[.,;]\s*)?(?:what|how|which|why|does|do\b|will|is|are|was|were|when|run\b)/i.test(trailingText)) {
        suffix = trailingText.replace(/^[.,;]\s*/, "").replace(/[?.!]\s*$/, "").trim();
        code = code.slice(0, headerEnd).trim();
      }
    }
  }
  let depth = 0;
  let quote = "";
  let escaped = false;
  let closingBrace = -1;

  for (let index = 0; index < code.length; index++) {
    const character = code[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
    } else if (character === "\"" || character === "'") {
      quote = character;
    } else if (character === "{") {
      depth++;
    } else if (character === "}") {
      depth--;
      if (depth === 0) {
        closingBrace = index + 1;
        const trailingElse = code.slice(closingBrace).match(/^\s*else\b/);
        if (trailingElse) {
          while (true) {
            const elseStart = closingBrace + code.slice(closingBrace).search(/\S/) + 4;
            let bodyStart = elseStart;
            while (/\s/.test(code[bodyStart] || "")) bodyStart++;
            if (/^if\b/i.test(code.slice(bodyStart))) {
              const openingParenthesis = code.indexOf("(", bodyStart);
              const closingParenthesis = findMatchingCodeDelimiter(code, openingParenthesis, "(", ")");
              if (openingParenthesis < 0 || closingParenthesis < 0) break;
              bodyStart = closingParenthesis + 1;
              while (/\s/.test(code[bodyStart] || "")) bodyStart++;
            }

            if (code[bodyStart] === "{") {
              const blockEnd = findMatchingCodeDelimiter(code, bodyStart, "{", "}");
              if (blockEnd < 0) break;
              closingBrace = blockEnd + 1;
            } else {
              const statementEnd = findCodeStatementEnd(code, bodyStart);
              if (statementEnd < 0) break;
              closingBrace = statementEnd;
            }

            if (!/^\s*else\b/.test(code.slice(closingBrace))) break;
          }
          break;
        } else {
          break;
        }
      }
    }
  }

  if (closingBrace >= 0) {
    let end = closingBrace;
    if (code[end] === ";") end++;
    suffix = [suffix, code.slice(end).trim()].filter(Boolean).join(" ");
    code = code.slice(0, end).trim();
  } else {
    code = code.replace(/[?]\s*$/, "").trim();
  }

  if (/,\s*if$/i.test(prefix) && /^is written\b/i.test(suffix)) {
    prefix = prefix.replace(/,\s*if$/i, ", this condition");
  } else if (/,\s*$/i.test(prefix) && /^is written\b/i.test(suffix)) {
    prefix = `${prefix} this condition`;
  }
  if (/what does$/i.test(prefix) && /^do$/i.test(suffix)) {
    prefix = `${prefix} this condition`;
    suffix = "do";
  }
  if (/\bin$/i.test(prefix) && /^in\b/i.test(suffix)) {
    suffix = suffix.replace(/^in\b\s*/i, "");
  }
  let prompt = [prefix, suffix].filter(Boolean).join(" ");
  if (prompt && !/[?.!]$/.test(prompt)) prompt += / by$/i.test(prompt) ? ":" : "?";
  return { prompt, code };
}

function formatCodeSnippet(source) {
  const isPseudocode = /\b(?:SET|FOR|WHILE|IF|END\s+(?:FOR|WHILE|IF))\b/.test(source);
  if (isPseudocode) {
    const lines = source
      .replace(/:\s*(?=(?:SET|PRINT|IF|FOR|WHILE)\b)/gi, "\n")
      .split(/[;\r\n]+/)
      .map(line => line.trim())
      .filter(Boolean);
    let indentation = 0;
    return lines.map(line => {
      const closesBlock = /^END\s+(?:FOR|WHILE|IF)\b/i.test(line);
      const startsElse = /^ELSE\b/i.test(line);
      if (closesBlock || startsElse) indentation = Math.max(0, indentation - 1);
      const formattedLine = `${"  ".repeat(indentation)}${line.replace(/;$/, "")}`;
      if (/^(?:FOR\b|WHILE\b|IF\b.*THEN|ELSE\b)/i.test(line)) indentation++;
      return formattedLine;
    }).join("\n");
  }

  if (/^(?:int|char|float|double|long|short|boolean|String)\s+\w+\s*\[\d+\]$/i.test(source)) {
    source += ";";
  }

  const lines = [];
  let currentLine = "";
  let indentation = 0;
  let parenthesisDepth = 0;
  let pendingBodyIndent = 0;
  let quote = "";
  let escaped = false;
  const flushLine = () => {
    const trimmed = currentLine.trim();
    if (trimmed) lines.push(`${"  ".repeat(indentation)}${trimmed}`);
    currentLine = "";
  };

  for (let index = 0; index < source.length; index++) {
    const character = source[index];
    if (quote) {
      currentLine += character;
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "\n") {
      flushLine();
    } else if (/^else\b/i.test(source.slice(index)) && !currentLine.trim()) {
      const afterElseIndex = index + 4;
      const nextCodeIndex = source.slice(afterElseIndex).search(/\S/);
      const nextSourceIndex = nextCodeIndex < 0 ? -1 : afterElseIndex + nextCodeIndex;
      const nextCharacter = nextSourceIndex < 0 ? "" : source[nextSourceIndex];
      currentLine = "else";
      index += 3;
      if (nextCharacter === "{") continue;
      flushLine();
      if (nextCharacter && !/^if\b/i.test(source.slice(nextSourceIndex))) {
        indentation++;
        pendingBodyIndent++;
      }
    } else if (character === "\"" || character === "'") {
      quote = character;
      currentLine += character;
    } else if (character === "(") {
      parenthesisDepth++;
      currentLine += character;
    } else if (character === ")") {
      parenthesisDepth = Math.max(0, parenthesisDepth - 1);
      currentLine += character;
      const nextCodeIndex = source.slice(index + 1).search(/\S/);
      const nextCharacter = nextCodeIndex < 0 ? "" : source[index + 1 + nextCodeIndex];
      if (parenthesisDepth === 0
        && /^(?:for|if|while|switch)\s*\([\s\S]*\)$/i.test(currentLine.trim())
        && nextCharacter
        && nextCharacter !== "{"
        && nextCharacter !== ";") {
        flushLine();
        indentation++;
        pendingBodyIndent++;
      }
    } else if (character === "{" && parenthesisDepth === 0) {
      currentLine = `${currentLine.trimEnd()} {`;
      flushLine();
      indentation++;
    } else if (character === "}" && parenthesisDepth === 0) {
      flushLine();
      indentation = Math.max(0, indentation - 1);
      const afterBraceIndex = index + 1;
      const elseOffset = source.slice(afterBraceIndex).search(/\S/);
      const elseIndex = elseOffset < 0 ? -1 : afterBraceIndex + elseOffset;
      const afterElseIndex = elseIndex + 4;
      const bodyOffset = source.slice(afterElseIndex).search(/\S/);
      const nextBodyCharacter = bodyOffset < 0 ? "" : source[afterElseIndex + bodyOffset];
      if (elseIndex >= 0
        && /^else\b/i.test(source.slice(elseIndex))
        && nextBodyCharacter === "{") {
        currentLine = "} else";
        index = afterElseIndex - 1;
        continue;
      }
      currentLine = "}";
      flushLine();
    } else if (character === ";" && parenthesisDepth === 0) {
      currentLine += character;
      flushLine();
      if (pendingBodyIndent) {
        indentation = Math.max(0, indentation - pendingBodyIndent);
        pendingBodyIndent = 0;
      }
    } else if (/\s/.test(character)) {
      if (currentLine && !currentLine.endsWith(" ")) currentLine += " ";
    } else {
      currentLine += character;
    }
  }
  flushLine();
  return lines.join("\n");
}

function detectCodeLanguage(prompt, code) {
  if (/\bSET\b|\bEND\s+(?:FOR|IF|WHILE)\b/.test(code)) return "Pseudocode";
  if (/\bSystem\.out\.|\bpublic\s+static\b/.test(code) || /\bJava\b/i.test(prompt)) return "Java";
  if (/\bprint\s*\(/.test(code) && !/\bprintf\s*\(/.test(code) || /\bPython\b/i.test(prompt)) return "Python";
  return "C";
}

function appendHighlightedCode(line, code) {
  const tokenPattern = /(\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:int|char|float|double|long|short|void|boolean|String|const|let|var|if|else|for|while|do|switch|case|default|break|continue|return|class|public|static|new|true|false|null|None|SET|FOR|WHILE|IF|THEN|ELSE|END|PRINT)\b|\b\d+(?:\.\d+)?\b|===?|!==?|<=?|>=?|&&|\|\||[+\-*\/%=!&|?:.,;()[\]{}])/g;
  let previousIndex = 0;
  let match;

  while ((match = tokenPattern.exec(code))) {
    if (match.index > previousIndex) line.append(document.createTextNode(code.slice(previousIndex, match.index)));
    const token = match[0];
    const highlighted = document.createElement("span");
    highlighted.className = /^["']/.test(token)
      ? "syntax-string"
      : /^\d/.test(token)
        ? "syntax-number"
        : /^[()[\]{}.,;]$/.test(token)
          ? "syntax-punctuation"
          : /^[+\-*\/%=!&|?:<>]/.test(token)
            ? "syntax-operator"
            : "syntax-keyword";
    highlighted.textContent = token;
    line.appendChild(highlighted);
    previousIndex = tokenPattern.lastIndex;
  }
  if (previousIndex < code.length) line.append(document.createTextNode(code.slice(previousIndex)));
}

function renderQuestionContent(text) {
  const container = $("questionText");
  container.replaceChildren();
  const snippet = extractCodeSnippet(text);

  if (!snippet) {
    container.classList.add("text-only");
    const prompt = document.createElement("p");
    prompt.className = "question-prompt";
    prompt.textContent = text;
    container.appendChild(prompt);
    return;
  }

  container.classList.remove("text-only");
  const prompt = document.createElement("p");
  prompt.className = "question-prompt";
  prompt.textContent = snippet.prompt;

  const codePanel = document.createElement("div");
  codePanel.className = "code-panel";
  const toolbar = document.createElement("div");
  toolbar.className = "code-toolbar";
  const windowControls = document.createElement("span");
  windowControls.className = "code-window-controls";
  windowControls.setAttribute("aria-hidden", "true");
  const language = document.createElement("span");
  language.className = "code-language";
  language.textContent = detectCodeLanguage(snippet.prompt, snippet.code);
  toolbar.append(windowControls, language);

  const codeLines = document.createElement("ol");
  codeLines.className = "code-lines";
  formatCodeSnippet(snippet.code).split("\n").forEach(codeLine => {
    const listItem = document.createElement("li");
    listItem.className = "code-line";
    appendHighlightedCode(listItem, codeLine || " ");
    codeLines.appendChild(listItem);
  });

  codePanel.append(toolbar, codeLines);
  container.append(prompt, codePanel);
}

function renderQuestion() {
  clearInterval(timerId);
  if (lives <= 0 || questionIndex >= currentQuestions.length) {
    finishLevel();
    return;
  }

  answered = false;
  hintUsed = false;
  timeLeft = QUESTION_TIME_LIMIT;
  const question = currentQuestions[questionIndex];

  $("questionCounter").textContent = `Question ${questionIndex + 1} of ${currentQuestions.length}`;
  const questionProgress = (questionIndex + 1) / currentQuestions.length * 100;
  $("questionProgress").style.width = `${questionProgress}%`;
  $("questionProgress").parentElement.setAttribute("aria-valuemax", currentQuestions.length);
  $("questionProgress").parentElement.setAttribute("aria-valuenow", questionIndex + 1);
  $("questionCategory").textContent = `LEVEL ${getLevelDisplayNumber(currentLevel.id)} · ${currentLevel.title.toUpperCase()}`;
  renderQuestionContent(question.question);
  $("options").replaceChildren();
  $("hintText").textContent = "";
  $("hintText").classList.add("hidden");
  $("hintButton").disabled = false;
  $("feedback").textContent = "";
  $("feedback").className = "feedback hidden";
  $("nextButton").disabled = true;
  $("nextButton").textContent = questionIndex === currentQuestions.length - 1 ? "View Results →" : "Next Question →";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.type = "button";
    button.setAttribute("aria-label", `Answer option ${String.fromCharCode(65 + index)}: ${option}`);
    const optionLetter = document.createElement("span");
    optionLetter.className = "option-letter";
    optionLetter.setAttribute("aria-hidden", "true");
    optionLetter.textContent = String.fromCharCode(65 + index);
    const optionText = document.createElement("span");
    optionText.className = "option-copy";
    optionText.textContent = option;
    button.append(optionLetter, optionText);
    button.addEventListener("click", () => chooseAnswer(index));
    $("options").appendChild(button);
  });

  const firstOption = $("options").querySelector("button");
  if (firstOption) firstOption.focus();
  announceStatus(`Question ${questionIndex + 1} of ${currentQuestions.length}. ${question.question}`);

  updateTimerDisplay();
  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      if (!answered) handleTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  $("timer").textContent = `⏱ ${timeLeft}s`;
  $("timer").classList.toggle("warning", timeLeft <= 5);
}

function chooseAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const question = currentQuestions[questionIndex];
  const buttons = [...$("options").querySelectorAll("button")];
  const isCorrect = selectedIndex === question.answer;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.answer) button.classList.add("correct");
    else if (index === selectedIndex) button.classList.add("incorrect");
  });

  if (isCorrect) {
    const points = 10 + Math.floor(timeLeft / 5) * 2;
    score += points;
    earnedXP += points;
    correctAnswers++;
    levelStreak++;
    bestLevelStreak = Math.max(bestLevelStreak, levelStreak);
    player.streak++;
    player.bestStreak = Math.max(player.bestStreak, player.streak);
    playAnswerSound(true);
    triggerCardAnimation("correct");
    $("feedback").className = "feedback good";
    $("feedback").textContent = `✅ Correct! +${points} points. ${question.explanation}`;
    announceStatus(`Correct. ${points} points earned. ${question.explanation}`);
  } else {
    lives--;
    levelStreak = 0;
    player.streak = 0;
    playAnswerSound(false);
    triggerCardAnimation("incorrect");
    $("feedback").className = "feedback bad";
    $("feedback").textContent = `❌ Incorrect. ${question.explanation}`;
    announceStatus(`Incorrect. ${question.explanation}`);
  }

  $("score").textContent = score;
  updateLivesDisplay();
  $("gameStreak").textContent = levelStreak;
  $("feedback").classList.remove("hidden");
  $("nextButton").disabled = false;
  $("hintButton").disabled = true;
  renderStats();
}

function handleTimeout() {
  if (answered) return;
  answered = true;
  lives--;
  levelStreak = 0;
  player.streak = 0;
  const question = currentQuestions[questionIndex];

  [...$("options").querySelectorAll("button")].forEach((button, index) => {
    button.disabled = true;
    if (index === question.answer) button.classList.add("correct");
  });

  playAnswerSound(false);
  triggerCardAnimation("incorrect");
  updateLivesDisplay();
  $("gameStreak").textContent = levelStreak;
  $("feedback").className = "feedback bad";
  $("feedback").textContent = `⏰ Time is up! ${question.explanation}`;
  announceStatus(`Time is up. ${question.explanation}`);
  $("nextButton").disabled = false;
  $("hintButton").disabled = true;
  $("feedback").classList.remove("hidden");
  renderStats();
}

function showHint() {
  if (answered || hintUsed) return;
  hintUsed = true;
  $("hintText").textContent = `💡 Hint: ${currentQuestions[questionIndex].hint}`;
  $("hintText").classList.remove("hidden");
  $("hintButton").disabled = true;
}

function nextQuestion() {
  if (!answered) return;
  questionIndex++;
  renderQuestion();
}

function finishLevel() {
  clearInterval(timerId);
  const passed = lives > 0 && correctAnswers >= Math.ceil(currentQuestions.length * 0.6);
  const accuracy = currentQuestions.length ? Math.round((correctAnswers / currentQuestions.length) * 100) : 0;

  if (passed) {
    player.completedLevels.add(currentLevel.id);
    const currentLevelSlot = getLevelDisplaySlot(currentLevel.id);
    player.unlockedLevel = Math.max(player.unlockedLevel, Math.min(currentLevelSlot + 1, levels.length));
  }
  player.bestScore = Math.max(player.bestScore, score);
  player.bestStreak = Math.max(player.bestStreak, levelStreak, player.streak);
  player.bestLevelScores[currentLevel.id] = Math.max(player.bestLevelScores[currentLevel.id] || 0, score);
  player.xp += earnedXP;
  savePlayerProgress();
  const leaderboardEntries = getLeaderboardEntries();
  const leaderboardEntry = {
    name: getDisplayName(player.name),
    score,
    level: currentLevel.id,
    date: new Date().toISOString()
  };
  leaderboardEntries.push(leaderboardEntry);
  saveLeaderboardEntries([...leaderboardEntries].sort((a, b) => b.score - a.score).slice(0, 10));
  submitGlobalLeaderboardRun(leaderboardEntry);
  const currentLevelSlotIndex = getLevelSequencePosition(currentLevel.id);
  nextLevelId = passed && currentLevelSlotIndex < LEVEL_SEQUENCE.length - 1 ? LEVEL_SEQUENCE[currentLevelSlotIndex + 1] : null;

  $("resultIcon").textContent = passed ? "🏆" : "💪";
  $("resultTitle").textContent = passed ? "Level Completed!" : "Keep Practicing!";
  const summaryMessage = passed
    ? "Great work! You passed this level. Your next level is unlocked if one remains."
    : "You haven't passed this level yet. Review the explanations and try again.";
  $("resultMessage").textContent = summaryMessage;
  announceStatus(`${passed ? "Level passed" : "Level not passed"}. ${summaryMessage}`);
  $("finalScore").textContent = score;
  $("finalCorrect").textContent = `${correctAnswers}/${currentQuestions.length}`;
  $("finalAccuracy").textContent = `${accuracy}%`;
  $("finalXP").textContent = earnedXP;
  $("finalLives").textContent = lives;
  $("finalBestStreak").textContent = bestLevelStreak;
  $("continueButton").textContent = passed && currentLevelSlotIndex < LEVEL_SEQUENCE.length - 1 ? "Continue to Next Level →" : "Back to Levels →";

  const resultIcon = $("resultIcon");
  resultIcon.classList.remove("result-pop");
  void resultIcon.offsetWidth;
  resultIcon.classList.add("result-pop");
  playTone({ frequency: passed ? 740 : 220, duration: 0.18, volume: 0.04, type: passed ? "triangle" : "sawtooth", sweep: passed ? 120 : -80 });
  if (passed) {
    setTimeout(() => playTone({ frequency: 980, duration: 0.14, volume: 0.04, type: "triangle", sweep: 140 }), 90);
  }

  renderLevels();
  showScreen("resultScreen");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function continueFromResult() {
  const targetId = nextLevelId;
  nextLevelId = null;
  clearInterval(timerId);
  showScreen("dashboard");
  backToLevels();
  renderLevels();
  if (targetId) showLevel(targetId);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function returnToDashboard() {
  if ($("gameScreen").classList.contains("hidden") === false
    && !window.confirm("Exit this level? Your current run will not count toward completion.")) return;
  clearInterval(timerId);
  showScreen("dashboard");
  backToLevels();
  renderLevels();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("backButton").addEventListener("click", backToLevels);
$("continueLearningButton").addEventListener("click", () => {
  const recommendedLevel = getRecommendedLevel();
  if (recommendedLevel) {
    showLevel(recommendedLevel.id);
    $("levelDetails").scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
$("startButton").addEventListener("click", startLevel);
$("hintButton").addEventListener("click", showHint);
$("nextButton").addEventListener("click", nextQuestion);
$("exitButton").addEventListener("click", returnToDashboard);
$("retryButton").addEventListener("click", startLevel);
$("continueButton").addEventListener("click", continueFromResult);
$("leaderboardButton").addEventListener("click", toggleLeaderboard);
$("leaderboardLevelFilter").addEventListener("change", loadGlobalLeaderboard);
$("resetProgressButton").addEventListener("click", resetPlayerProgress);
$("playerNameInput").addEventListener("change", event => {
  player.name = getDisplayName(event.target.value);
  event.target.value = player.name;
  savePlayerProgress();
});

loadPlayerProgress();
const playerNameInput = $("playerNameInput");
if (playerNameInput) {
  playerNameInput.value = player.name;
}
renderLeaderboard();
renderLevels();
