const $ = id => document.getElementById(id);

let dashboardData = { students: [], attempts: [] };
let refreshTimer = null;

async function requestJson(url, options) {
  const response = await fetch(url, { cache: "no-store", ...options });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response. Deploy this site with its Vercel API functions enabled.");
  }
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data;
}

function showLogin() {
  $("adminLoginView").classList.remove("hidden");
  $("adminDashboardView").classList.add("hidden");
}

function showDashboard() {
  $("adminLoginView").classList.add("hidden");
  $("adminDashboardView").classList.remove("hidden");
  if (refreshTimer === null) {
    refreshTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadDashboard();
    }, 60000);
  }
}

function stopAutoRefresh() {
  if (refreshTimer !== null) {
    window.clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function createCell(row, value, className = "") {
  const cell = document.createElement("td");
  cell.textContent = value === null || value === undefined || value === "" ? "—" : String(value);
  if (className) cell.className = className;
  row.appendChild(cell);
}

function makeEmptyRow(body, columnCount, message) {
  body.replaceChildren();
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = columnCount;
  cell.className = "admin-empty";
  cell.textContent = message;
  row.appendChild(cell);
  body.appendChild(row);
}

function completedAttempts() {
  return dashboardData.attempts.filter(attempt => attempt.status === "completed" && Number.isFinite(attempt.score));
}

function getStudentStats() {
  const byRollno = new Map();
  for (const attempt of dashboardData.attempts) {
    const key = String(attempt.rollno || "").toUpperCase();
    if (!byRollno.has(key)) byRollno.set(key, []);
    byRollno.get(key).push(attempt);
  }
  return dashboardData.students.map(student => {
    const attempts = byRollno.get(String(student.rollno).toUpperCase()) || [];
    const completed = attempts.filter(attempt => attempt.status === "completed" && Number.isFinite(attempt.score));
    const passedLevels = new Set(completed.filter(attempt => attempt.passed).map(attempt => Number(attempt.level)));
    const average = completed.length
      ? Math.round(completed.reduce((sum, attempt) => sum + attempt.score, 0) / completed.length)
      : 0;
    const bestAttempt = completed.reduce((best, attempt) => !best || attempt.score > best.score ? attempt : best, null);
    const latest = attempts.reduce((best, attempt) => !best || new Date(attempt.started_at) > new Date(best.started_at) ? attempt : best, null);
    return { student, attempts, completed, passedLevels, average, bestAttempt, latest };
  });
}

function updateScorecards() {
  const completed = completedAttempts();
  const passed = completed.filter(attempt => attempt.passed).length;
  const average = completed.length
    ? Math.round(completed.reduce((sum, attempt) => sum + attempt.score, 0) / completed.length)
    : 0;
  $("studentCount").textContent = dashboardData.students.length.toLocaleString();
  $("completedCount").textContent = completed.length.toLocaleString();
  $("passedCount").textContent = passed.toLocaleString();
  $("averageScore").textContent = average.toLocaleString();
}

function drawChart(canvas, values, mode) {
  const bounds = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  const width = Math.max(260, bounds.width);
  const height = Math.max(190, bounds.height);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.clearRect(0, 0, width, height);

  const left = 36;
  const right = width - 12;
  const top = 12;
  const bottom = height - 34;
  const plotWidth = right - left;
  const plotHeight = bottom - top;
  context.font = "11px system-ui, sans-serif";
  context.lineWidth = 1;
  context.strokeStyle = "rgba(174, 185, 209, .18)";
  context.fillStyle = "#aeb9d1";
  for (let tick = 0; tick <= 4; tick++) {
    const y = bottom - plotHeight * tick / 4;
    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(right, y);
    context.stroke();
    context.fillText(String(Math.round(mode === "line" ? values.max * tick / 4 : values.max * tick / 4)), 2, y + 4);
  }

  if (!values.points.length || values.max <= 0 || !values.points.some(point => point.value > 0)) {
    context.fillStyle = "#aeb9d1";
    context.textAlign = "center";
    context.fillText("No completed scores yet", width / 2, height / 2);
    context.textAlign = "left";
    return;
  }

  if (mode === "line") {
    const count = values.points.length;
    const points = values.points.map((point, index) => ({
      x: count === 1 ? left + plotWidth / 2 : left + plotWidth * index / (count - 1),
      y: bottom - plotHeight * point.value / values.max
    }));
    context.beginPath();
    points.forEach((point, index) => index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y));
    context.strokeStyle = "#70e6bf";
    context.lineWidth = 2.5;
    context.stroke();
    context.fillStyle = "#70e6bf";
    points.forEach(point => {
      context.beginPath();
      context.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
      context.fill();
    });
    context.fillStyle = "#aeb9d1";
    context.textAlign = "center";
    values.points.forEach((point, index) => {
      if (index % 2 === 0 || index === count - 1) context.fillText(point.label, points[index].x, height - 10);
    });
    context.textAlign = "left";
    return;
  }

  const slotWidth = plotWidth / values.points.length;
  const barWidth = Math.max(4, slotWidth * 0.58);
  values.points.forEach((point, index) => {
    const barHeight = plotHeight * point.value / values.max;
    const x = left + slotWidth * index + (slotWidth - barWidth) / 2;
    context.fillStyle = "#70e6bf";
    context.fillRect(x, bottom - barHeight, barWidth, barHeight);
    context.fillStyle = "#aeb9d1";
    context.textAlign = "center";
    context.fillText(point.label, x + barWidth / 2, height - 10);
  });
  context.textAlign = "left";
}

function renderCharts() {
  const daily = new Map();
  const now = new Date();
  const dateKeys = [];
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    dateKeys.push({ key, label: date.toLocaleDateString(undefined, { weekday: "short" }) });
    daily.set(key, []);
  }
  completedAttempts().forEach(attempt => {
    const date = new Date(attempt.completed_at);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (daily.has(key)) daily.get(key).push(attempt.score);
  });
  const dailyPoints = dateKeys.map(day => {
    const scores = daily.get(day.key);
    return { label: day.label, value: scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0 };
  });
  drawChart($("scoreTrendChart"), {
    points: dailyPoints,
    max: Math.max(100, Math.ceil(Math.max(...dailyPoints.map(point => point.value), 0) / 100) * 100)
  }, "line");

  const passedByLevel = Array.from({ length: 10 }, (_, index) => ({
    label: String(index + 1),
    value: completedAttempts().filter(attempt => Number(attempt.level) === index + 1 && attempt.passed).length
  }));
  drawChart($("levelCompletionChart"), {
    points: passedByLevel,
    max: Math.max(1, ...passedByLevel.map(point => point.value))
  }, "bar");
}

function renderLeaderboard() {
  const body = $("adminLeaderboardRows");
  const ranking = getStudentStats()
    .filter(stats => stats.bestAttempt)
    .sort((left, right) => right.bestAttempt.score - left.bestAttempt.score
      || new Date(left.bestAttempt.completed_at) - new Date(right.bestAttempt.completed_at))
    .slice(0, 10);
  if (!ranking.length) return makeEmptyRow(body, 7, "No completed scores yet.");

  body.replaceChildren();
  ranking.forEach((stats, index) => {
    const row = document.createElement("tr");
    createCell(row, `#${index + 1}`);
    createCell(row, stats.student.name);
    createCell(row, stats.student.rollno);
    createCell(row, stats.student.department);
    createCell(row, stats.student.section);
    createCell(row, stats.bestAttempt.score);
    createCell(row, `Level ${stats.bestAttempt.level}`);
    body.appendChild(row);
  });
}

function renderStudentProgress() {
  const body = $("studentProgressRows");
  const search = $("studentSearch").value.trim().toLowerCase();
  const rows = getStudentStats().filter(stats =>
    `${stats.student.name} ${stats.student.rollno} ${stats.student.department} ${stats.student.section}`.toLowerCase().includes(search)
  );
  if (!rows.length) return makeEmptyRow(body, 8, dashboardData.students.length ? "No students match this search." : "No students have started a run yet.");

  body.replaceChildren();
  rows.forEach(stats => {
    const row = document.createElement("tr");
    createCell(row, stats.student.name);
    createCell(row, stats.student.rollno);
    createCell(row, stats.student.department);
    createCell(row, stats.student.section);
    createCell(row, `${stats.passedLevels.size}/10`);
    createCell(row, stats.completed.length);
    createCell(row, stats.completed.length ? stats.average : "—");
    createCell(row, stats.latest ? `${stats.latest.status.replace("_", " ")} · ${formatDate(stats.latest.started_at)}` : formatDate(stats.student.created_at));
    body.appendChild(row);
  });
}

async function loadDashboard() {
  $("dashboardStatus").textContent = "Loading student progress…";
  try {
    dashboardData = await requestJson("/api/admin/dashboard");
    if (!Array.isArray(dashboardData.students) || !Array.isArray(dashboardData.attempts)) {
      throw new Error("The dashboard returned invalid student data.");
    }
    updateScorecards();
    renderLeaderboard();
    renderStudentProgress();
    renderCharts();
    $("dashboardStatus").textContent = `Updated ${new Date().toLocaleTimeString()}.`;
  } catch (error) {
    console.error("Unable to load admin dashboard.", error);
    $("dashboardStatus").textContent = error.message;
    if (error.message.includes("sign in")) {
      stopAutoRefresh();
      showLogin();
    }
  }
}

$("adminLoginForm").addEventListener("submit", async event => {
  event.preventDefault();
  const button = $("adminLoginButton");
  button.disabled = true;
  $("adminLoginStatus").textContent = "Signing in…";
  try {
    await requestJson("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: $("adminUsername").value,
        password: $("adminPassword").value
      })
    });
    $("adminPassword").value = "";
    $("adminLoginStatus").textContent = "";
    showDashboard();
    await loadDashboard();
  } catch (error) {
    $("adminLoginStatus").textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

$("adminLogoutButton").addEventListener("click", async () => {
  try {
    await requestJson("/api/admin/auth", { method: "DELETE" });
    stopAutoRefresh();
    showLogin();
  } catch (error) {
    $("dashboardStatus").textContent = error.message;
  }
});

$("adminRefreshButton").addEventListener("click", loadDashboard);
$("studentSearch").addEventListener("input", renderStudentProgress);
window.addEventListener("resize", () => {
  if (!$("adminDashboardView").classList.contains("hidden") && dashboardData) renderCharts();
});

(async function initializeAdminPage() {
  try {
    const session = await requestJson("/api/admin/auth");
    if (session.authenticated) {
      showDashboard();
      await loadDashboard();
    } else {
      showLogin();
    }
  } catch (error) {
    showLogin();
    $("adminLoginStatus").textContent = error.message;
  }
})();
