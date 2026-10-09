const levels = Object.values(window.QUEST_LEVELS || {}).sort((a, b) => a.id - b.id);
const PLAYER_STORAGE_KEY = "vinsinfo-coding-quest-player-v1";

const player = {
  xp: 0,
  streak: 0,
  unlockedLevel: 1,
  completedLevels: new Set()
};

let currentLevel = null;
let currentQuestions = [];
let questionIndex = 0;
let score = 0;
let lives = 3;
let correctAnswers = 0;
let levelStreak = 0;
let timerId = null;
let timeLeft = 20;
let answered = false;
let hintUsed = false;
let earnedXP = 0;
let nextLevelId = null;

const $ = id => document.getElementById(id);

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
  const highestCompletedLevel = completedLevelIds.length ? Math.max(...completedLevelIds) : 0;
  const savedUnlockedLevel = Number.isInteger(savedProgress.unlockedLevel)
    ? Math.max(1, Math.min(savedProgress.unlockedLevel, levels.length))
    : 1;

  player.xp = Number.isFinite(savedProgress.xp) && savedProgress.xp >= 0 ? savedProgress.xp : 0;
  player.streak = Number.isInteger(savedProgress.streak) && savedProgress.streak >= 0 ? savedProgress.streak : 0;
  player.unlockedLevel = Math.max(savedUnlockedLevel, Math.min(highestCompletedLevel + 1, levels.length));
  player.completedLevels = new Set(completedLevelIds);
}

function savePlayerProgress() {
  try {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify({
      xp: player.xp,
      streak: player.streak,
      unlockedLevel: player.unlockedLevel,
      completedLevels: [...player.completedLevels]
    }));
  } catch (error) {
    console.error("Unable to save Coding Quest progress.", error);
  }
}

function showScreen(screenId) {
  ["dashboard", "gameScreen", "resultScreen"].forEach(id => $(id).classList.add("hidden"));
  $(screenId).classList.remove("hidden");
}

function renderStats() {
  $("xp").textContent = player.xp;
  $("streak").textContent = player.streak;
  const completed = player.completedLevels.size;
  const progress = levels.length ? completed / levels.length * 100 : 0;
  $("progressBar").style.width = `${progress}%`;
  $("progressBar").parentElement.setAttribute("aria-valuenow", completed);
  $("progressBar").parentElement.setAttribute("aria-valuemax", levels.length);
  $("progressText").textContent = `${completed} of ${levels.length} levels completed | Level ${player.unlockedLevel} unlocked`;

  const recommendedLevel = getRecommendedLevel();
  if (recommendedLevel) {
    const isReplay = player.completedLevels.has(recommendedLevel.id);
    $("continueLearningLabel").textContent = `${isReplay ? "Replay" : completed ? "Continue to" : "Start"} Level ${recommendedLevel.id}`;
  }
}

function getRecommendedLevel() {
  return levels.find(level => level.id <= player.unlockedLevel && !player.completedLevels.has(level.id))
    || levels[levels.length - 1];
}

function renderLevels() {
  const grid = $("levelGrid");
  grid.replaceChildren();

  levels.forEach(level => {
    const unlocked = level.id <= player.unlockedLevel;
    const completed = player.completedLevels.has(level.id);
    const card = document.createElement("article");
    card.className = `level-card${unlocked ? "" : " locked"}${completed ? " completed" : ""}`;
    card.setAttribute("aria-label", `Level ${level.id}: ${level.title}, ${completed ? "completed" : unlocked ? "unlocked" : "locked"}`);

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
    title.textContent = `Level ${level.id}: ${level.title}`;

    const description = document.createElement("p");
    description.textContent = level.description;

    const meta = document.createElement("div");
    meta.className = "level-meta";
    const levelNumber = document.createElement("span");
    levelNumber.textContent = `Level ${String(level.id).padStart(2, "0")}`;
    const questionCount = document.createElement("span");
    questionCount.textContent = `${level.questions.length} questions`;
    meta.append(levelNumber, questionCount);

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
  if (!currentLevel || levelId > player.unlockedLevel) return;

  $("levelGrid").classList.add("hidden");
  $("levelDetails").classList.remove("hidden");
  $("detailsContent").replaceChildren();

  const title = document.createElement("h2");
  title.textContent = `${currentLevel.icon} Level ${currentLevel.id}: ${currentLevel.title}`;
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
  info.textContent = `${currentLevel.questions.length} questions | 20 seconds per question | 3 lives`;
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

function startLevel() {
  if (!currentLevel) return;
  clearInterval(timerId);
  currentQuestions = shuffle(currentLevel.questions);
  questionIndex = 0;
  score = 0;
  lives = 3;
  correctAnswers = 0;
  levelStreak = 0;
  earnedXP = 0;
  $("score").textContent = score;
  $("lives").textContent = "❤️❤️❤️";
  $("lives").setAttribute("aria-label", "3 lives remaining");
  $("gameStreak").textContent = levelStreak;
  $("levelDetails").classList.add("hidden");
  showScreen("gameScreen");
  renderQuestion();
}

function renderQuestion() {
  clearInterval(timerId);
  if (lives <= 0 || questionIndex >= currentQuestions.length) {
    finishLevel();
    return;
  }

  answered = false;
  hintUsed = false;
  timeLeft = 20;
  const question = currentQuestions[questionIndex];

  $("questionCounter").textContent = `Question ${questionIndex + 1} of ${currentQuestions.length}`;
  const questionProgress = (questionIndex + 1) / currentQuestions.length * 100;
  $("questionProgress").style.width = `${questionProgress}%`;
  $("questionProgress").parentElement.setAttribute("aria-valuemax", currentQuestions.length);
  $("questionProgress").parentElement.setAttribute("aria-valuenow", questionIndex + 1);
  $("questionCategory").textContent = currentLevel.title.toUpperCase();
  $("questionText").textContent = question.question;
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
    player.streak++;
    $("feedback").className = "feedback good";
    $("feedback").textContent = `✅ Correct! +${points} points. ${question.explanation}`;
  } else {
    lives--;
    levelStreak = 0;
    player.streak = 0;
    $("feedback").className = "feedback bad";
    $("feedback").textContent = `❌ Incorrect. ${question.explanation}`;
  }

  $("score").textContent = score;
  $("lives").textContent = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
  $("lives").setAttribute("aria-label", `${lives} ${lives === 1 ? "life" : "lives"} remaining`);
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

  $("lives").textContent = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
  $("lives").setAttribute("aria-label", `${lives} ${lives === 1 ? "life" : "lives"} remaining`);
  $("gameStreak").textContent = levelStreak;
  $("feedback").className = "feedback bad";
  $("feedback").textContent = `⏰ Time is up! ${question.explanation}`;
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

  if (passed) {
    player.completedLevels.add(currentLevel.id);
    player.unlockedLevel = Math.max(player.unlockedLevel, Math.min(currentLevel.id + 1, levels.length));
  }
  player.xp += earnedXP;
  savePlayerProgress();
  nextLevelId = passed && currentLevel.id < levels.length ? currentLevel.id + 1 : null;

  $("resultIcon").textContent = passed ? "🏆" : "💪";
  $("resultTitle").textContent = passed ? "Level Completed!" : "Keep Practicing!";
  $("resultMessage").textContent = passed
    ? "Great work! You passed this level. Your next level is unlocked if one remains."
    : "You haven't passed this level yet. Review the explanations and try again.";
  $("finalScore").textContent = score;
  $("finalCorrect").textContent = `${correctAnswers}/${currentQuestions.length}`;
  $("finalXP").textContent = earnedXP;
  $("continueButton").textContent = passed && currentLevel.id < levels.length ? "Continue to Next Level →" : "Back to Levels →";

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

loadPlayerProgress();
renderLevels();
