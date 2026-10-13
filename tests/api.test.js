const { afterEach, test } = require("node:test");
const assert = require("node:assert/strict");
const answerKeys = require("../api/_lib/answer-key.json");
const { setStudentSessionCookie, sign } = require("../api/_lib/student-auth");
const progressHandler = require("../api/student-progress");
const leaderboardHandler = require("../api/leaderboard");
const studentAuthHandler = require("../api/student/auth");

const originalFetch = global.fetch;
const originalEnvironment = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  STUDENT_SESSION_SECRET: process.env.STUDENT_SESSION_SECRET
};

function makeResponse(res) {
  res.headers = {};
  res.setHeader = (name, value) => { res.headers[name] = value; };
  res.status = status => {
    res.statusCode = status;
    return res;
  };
  res.json = body => {
    res.body = body;
    return res;
  };
  return res;
}

function signedStudentRequest(method, body) {
  const token = sign({
    role: "student",
    rollno: "24CS001",
    exp: Date.now() + 60_000
  }, process.env.STUDENT_SESSION_SECRET);
  return {
    method,
    headers: { cookie: `coding_quest_student=${token}`, "x-real-ip": "127.0.0.1" },
    body
  };
}

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body)
  };
}

function configureEnvironment() {
  process.env.SUPABASE_URL = "https://supabase.example.test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  process.env.STUDENT_SESSION_SECRET = "student-session-secret-for-unit-tests-32";
}

afterEach(() => {
  global.fetch = originalFetch;
  for (const [name, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

test("student progress rejects requests without a signed-in student", async () => {
  configureEnvironment();
  global.fetch = async () => {
    throw new Error("Unauthenticated requests must not reach Supabase.");
  };
  const response = makeResponse({});

  await progressHandler({ method: "POST", headers: {}, body: { action: "start" } }, response);

  assert.equal(response.statusCode, 401);
  assert.match(response.body.error, /Sign in/);
});

test("student session cookie reaches both student auth and progress API routes", () => {
  configureEnvironment();
  const response = { headers: {}, setHeader(name, value) { this.headers[name] = value; } };
  setStudentSessionCookie(response, { headers: { "x-forwarded-proto": "https" } }, "signed-token");
  assert.match(response.headers["Set-Cookie"], /Path=\/api;/);
  assert.match(response.headers["Set-Cookie"], /; Secure$/);
});

test("student sign-up creates a unique account, hashes its password, and signs in", async () => {
  configureEnvironment();
  let savedProfile;
  global.fetch = async (url, options = {}) => {
    const parsed = new URL(url);
    if (parsed.pathname.endsWith("/rpc/consume_leaderboard_submission")) return jsonResponse(true);
    if (parsed.pathname.endsWith("/student_profiles") && options.method === "POST") {
      savedProfile = JSON.parse(options.body);
      return jsonResponse([], 201);
    }
    throw new Error(`Unexpected Supabase request: ${options.method || "GET"} ${url}`);
  };

  const response = makeResponse({});
  await studentAuthHandler({
    method: "POST",
    headers: { "x-real-ip": "127.0.0.1", "x-forwarded-proto": "https" },
    body: {
      action: "signup",
      name: "Student Example",
      rollno: "24cs001",
      department: "B.Sc-CS",
      section: "A",
      password: "a-long-student-password"
    }
  }, response);

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.authenticated, true);
  assert.equal(response.body.student.rollno, "24CS001");
  assert.equal(savedProfile.rollno, "24CS001");
  assert.ok(savedProfile.password_hash.startsWith("scrypt$"));
  assert.notEqual(savedProfile.password_hash, "a-long-student-password");
  assert.ok(response.headers["Set-Cookie"].includes("Path=/api;"));
});

test("student sign-up rejects duplicate roll numbers without overwriting accounts", async () => {
  configureEnvironment();
  let requestCount = 0;
  global.fetch = async (url, options = {}) => {
    const parsed = new URL(url);
    if (parsed.pathname.endsWith("/rpc/consume_leaderboard_submission")) return jsonResponse(true);
    if (parsed.pathname.endsWith("/student_profiles") && options.method === "POST") {
      requestCount++;
      return jsonResponse({ code: "23505" }, 409);
    }
    throw new Error(`Unexpected Supabase request: ${options.method || "GET"} ${url}`);
  };

  const response = makeResponse({});
  await studentAuthHandler({
    method: "POST",
    headers: { "x-real-ip": "127.0.0.1" },
    body: {
      action: "signup",
      name: "Another Student",
      rollno: "24CS001",
      department: "B.Sc-CS",
      section: "A",
      password: "a-long-student-password"
    }
  }, response);

  assert.equal(response.statusCode, 409);
  assert.match(response.body.error, /already registered/);
  assert.equal(requestCount, 1);
});

test("student runs require consent and the full question set", async () => {
  configureEnvironment();
  let attemptWasCreated = false;
  global.fetch = async (url, options = {}) => {
    const path = new URL(url).pathname;
    if (path.endsWith("/student_profiles")) return jsonResponse([{ rollno: "24CS001", password_hash: "hash" }]);
    if (path.endsWith("/rpc/consume_leaderboard_submission")) return jsonResponse(true);
    if (path.endsWith("/student_attempts") && options.method === "POST") {
      attemptWasCreated = true;
      return jsonResponse([{ id: 1 }], 201);
    }
    throw new Error(`Unexpected Supabase request: ${options.method || "GET"} ${url}`);
  };

  const noConsent = makeResponse({});
  await progressHandler(signedStudentRequest("POST", {
    action: "start",
    level: 1,
    questionIndices: Array.from({ length: 30 }, (_, index) => index)
  }), noConsent);
  assert.equal(noConsent.statusCode, 400);

  const shortQuestionSet = makeResponse({});
  await progressHandler(signedStudentRequest("POST", {
    action: "start",
    level: 1,
    leaderboardConsent: true,
    questionIndices: [0]
  }), shortQuestionSet);
  assert.equal(shortQuestionSet.statusCode, 400);
  assert.equal(attemptWasCreated, false);
});

test("students can start Pseudocode Practice as Level 1 without a prior pass", async () => {
  configureEnvironment();
  let savedAttempt;
  global.fetch = async (url, options = {}) => {
    const path = new URL(url).pathname;
    if (path.endsWith("/student_profiles")) return jsonResponse([{ rollno: "24CS001", password_hash: "hash" }]);
    if (path.endsWith("/rpc/consume_leaderboard_submission")) return jsonResponse(true);
    if (path.endsWith("/student_attempts") && options.method === "POST") {
      savedAttempt = JSON.parse(options.body);
      return jsonResponse([{ id: 2 }], 201);
    }
    throw new Error(`Unexpected Supabase request: ${options.method || "GET"} ${url}`);
  };

  const response = makeResponse({});
  await progressHandler(signedStudentRequest("POST", {
    action: "start",
    level: 10,
    leaderboardConsent: true,
    questionIndices: Array.from({ length: 30 }, (_, index) => index)
  }), response);

  assert.equal(response.statusCode, 201);
  assert.equal(savedAttempt.level, 10);
});

test("Flowchart Master as Level 2 requires passing internal level 10", async () => {
  configureEnvironment();
  let checkedPreviousLevel;
  let attemptWasCreated = false;
  let previousLevelPassed = false;
  global.fetch = async (url, options = {}) => {
    const parsed = new URL(url);
    const path = parsed.pathname;
    if (path.endsWith("/student_profiles")) return jsonResponse([{ rollno: "24CS001", password_hash: "hash" }]);
    if (path.endsWith("/rpc/consume_leaderboard_submission")) return jsonResponse(true);
    if (path.endsWith("/student_attempts") && !options.method) {
      checkedPreviousLevel = parsed.searchParams.get("level");
      return jsonResponse(previousLevelPassed ? [{ id: 1 }] : []);
    }
    if (path.endsWith("/student_attempts") && options.method === "POST") {
      attemptWasCreated = true;
      return jsonResponse([{ id: 3 }], 201);
    }
    throw new Error(`Unexpected Supabase request: ${options.method || "GET"} ${url}`);
  };

  const response = makeResponse({});
  await progressHandler(signedStudentRequest("POST", {
    action: "start",
    level: 5,
    leaderboardConsent: true,
    questionIndices: Array.from({ length: 30 }, (_, index) => index)
  }), response);

  assert.equal(response.statusCode, 403);
  assert.equal(checkedPreviousLevel, "eq.10");
  assert.match(response.body.error, /Pass Level 1 before starting Level 2/);
  assert.equal(attemptWasCreated, false);

  previousLevelPassed = true;
  const unlockedResponse = makeResponse({});
  await progressHandler(signedStudentRequest("POST", {
    action: "start",
    level: 5,
    leaderboardConsent: true,
    questionIndices: Array.from({ length: 30 }, (_, index) => index)
  }), unlockedResponse);
  assert.equal(unlockedResponse.statusCode, 201);
  assert.equal(attemptWasCreated, true);
});

test("progress reset records a server cutoff and only loads attempts after it", async () => {
  configureEnvironment();
  let resetAt = null;
  let progressQuery;
  let progressionQuery;
  global.fetch = async (url, options = {}) => {
    const parsed = new URL(url);
    const path = parsed.pathname;
    if (path.endsWith("/rpc/consume_leaderboard_submission")) return jsonResponse(true);
    if (path.endsWith("/student_profiles") && options.method === "PATCH") {
      resetAt = JSON.parse(options.body).progress_reset_at;
      return jsonResponse([{ rollno: "24CS001" }]);
    }
    if (path.endsWith("/student_profiles")) {
      return jsonResponse([{
        rollno: "24CS001",
        name: "Student Example",
        department: "B.Sc-CS",
        section: "A",
        password_hash: "hash",
        progress_reset_at: resetAt
      }]);
    }
    if (path.endsWith("/student_attempts")) {
      if (parsed.searchParams.get("select") === "id") {
        progressionQuery = parsed.searchParams;
        return jsonResponse([]);
      }
      progressQuery = parsed.searchParams;
      return jsonResponse([]);
    }
    throw new Error(`Unexpected Supabase request: ${options.method || "GET"} ${url}`);
  };

  const resetResponse = makeResponse({});
  await progressHandler(signedStudentRequest("POST", { action: "reset" }), resetResponse);
  assert.equal(resetResponse.statusCode, 200);
  assert.equal(resetResponse.body.reset, true);
  assert.ok(Number.isFinite(Date.parse(resetAt)));

  const progressResponse = makeResponse({});
  await progressHandler(signedStudentRequest("GET"), progressResponse);
  assert.equal(progressResponse.statusCode, 200);
  assert.equal(progressQuery.get("started_at"), `gte.${resetAt}`);
  assert.deepEqual(progressResponse.body.completedLevels, []);

  const startResponse = makeResponse({});
  await progressHandler(signedStudentRequest("POST", {
    action: "start",
    level: 5,
    leaderboardConsent: true,
    questionIndices: Array.from({ length: 30 }, (_, index) => index)
  }), startResponse);
  assert.equal(startResponse.statusCode, 403);
  assert.equal(progressionQuery.get("started_at"), `gte.${resetAt}`);
});

test("server records correct answers submitted after 60 seconds as timeouts", async () => {
  configureEnvironment();
  let savedAnswer;
  global.fetch = async (url, options = {}) => {
    const parsed = new URL(url);
    const path = parsed.pathname;
    if (path.endsWith("/student_profiles")) return jsonResponse([{
      rollno: "24CS001",
      name: "Student Example",
      password_hash: "hash"
    }]);
    if (path.endsWith("/student_attempts") && !options.method) {
      return jsonResponse([{
        id: 91,
        level: 10,
        status: "in_progress",
        question_count: 30,
        question_indices: Array.from({ length: 30 }, (_, index) => index),
        answer_history: [],
        current_question: 0,
        server_score: 0,
        server_correct_answers: 0,
        lives_remaining: 5,
        question_started_at: new Date(Date.now() - 61_000).toISOString()
      }]);
    }
    if (path.endsWith("/student_attempts") && options.method === "PATCH") {
      savedAnswer = JSON.parse(options.body).answer_history[0].result;
      return jsonResponse([{ id: 91 }]);
    }
    throw new Error(`Unexpected Supabase request: ${options.method || "GET"} ${url}`);
  };

  const response = makeResponse({});
  await progressHandler(signedStudentRequest("POST", {
    action: "answer",
    attemptId: "91",
    questionNumber: 0,
    selectedAnswer: answerKeys[10][0]
  }), response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    correct: false,
    timedOut: true,
    points: 0,
    score: 0,
    correctAnswers: 0,
    lives: 4
  });
  assert.deepEqual(savedAnswer, response.body);
});

test("server-verified completion records only public leaderboard fields", async () => {
  configureEnvironment();
  const state = {
    attempt: {
      id: 71,
      level: 10,
      status: "in_progress",
      question_count: 30,
      question_indices: Array.from({ length: 30 }, (_, index) => index),
      answer_history: [],
      current_question: 0,
      server_score: 0,
      server_correct_answers: 0,
      lives_remaining: 5,
      question_started_at: new Date().toISOString()
    },
    leaderboardRows: []
  };
  global.fetch = async (url, options = {}) => {
    const parsed = new URL(url);
    const path = parsed.pathname;
    if (path.endsWith("/student_profiles")) {
      return jsonResponse([{
        rollno: "24CS001",
        name: "Student Example",
        department: "B.Sc-CS",
        section: "A",
        password_hash: "hash"
      }]);
    }
    if (path.endsWith("/rpc/consume_leaderboard_submission")) return jsonResponse(true);
    if (path.endsWith("/student_attempts") && options.method === "POST") return jsonResponse([{ id: 71 }], 201);
    if (path.endsWith("/student_attempts") && (!options.method || options.method === "GET")) {
      if (parsed.searchParams.get("select") === "level,score,passed") {
        return jsonResponse([{ level: 10, score: state.attempt.score, passed: state.attempt.passed }]);
      }
      return jsonResponse([{ ...state.attempt }]);
    }
    if (path.endsWith("/student_attempts") && options.method === "PATCH") {
      Object.assign(state.attempt, JSON.parse(options.body));
      return jsonResponse([{ id: 71 }]);
    }
    if (path.endsWith("/leaderboard") && options.method === "POST") {
      state.leaderboardRows.push(JSON.parse(options.body));
      return jsonResponse([], 201);
    }
    throw new Error(`Unexpected Supabase request: ${options.method || "GET"} ${url}`);
  };

  const startResponse = makeResponse({});
  await progressHandler(signedStudentRequest("POST", {
    action: "start",
    level: 10,
    leaderboardConsent: true,
    questionIndices: Array.from({ length: 30 }, (_, index) => index)
  }), startResponse);
  assert.equal(startResponse.statusCode, 201);
  assert.equal(startResponse.body.attemptId, "71");

  const answerResponse = makeResponse({});
  await progressHandler(signedStudentRequest("POST", {
    action: "answer",
    attemptId: "71",
    questionNumber: 0,
    selectedAnswer: answerKeys[10][0]
  }), answerResponse);
  assert.equal(answerResponse.statusCode, 200);
  assert.equal(answerResponse.body.correct, true);
  assert.equal(state.attempt.server_correct_answers, 1);

  const retryResponse = makeResponse({});
  await progressHandler(signedStudentRequest("POST", {
    action: "answer",
    attemptId: "71",
    questionNumber: 0,
    selectedAnswer: answerKeys[10][0]
  }), retryResponse);
  assert.equal(retryResponse.statusCode, 200);
  assert.deepEqual(retryResponse.body, answerResponse.body);
  assert.equal(state.attempt.server_correct_answers, 1);

  const finishResponse = makeResponse({});
  await progressHandler(signedStudentRequest("PATCH", { attemptId: "71" }), finishResponse);
  assert.equal(finishResponse.statusCode, 200);
  assert.equal(finishResponse.body.passed, false);
  assert.equal(state.attempt.status, "completed");
  assert.equal(state.leaderboardRows.length, 1);
  assert.deepEqual(Object.keys(state.leaderboardRows[0]).sort(), ["attempt_id", "level", "name", "score"]);
  assert.equal(state.leaderboardRows[0].name, "Student Example");

  const progressResponse = makeResponse({});
  await progressHandler(signedStudentRequest("GET"), progressResponse);
  assert.equal(progressResponse.statusCode, 200);
  assert.deepEqual(progressResponse.body.completedLevels, []);
  assert.equal(progressResponse.body.bestScores[10], state.attempt.score);
});

test("public leaderboard reads omit student identifiers and reject client writes", async () => {
  configureEnvironment();
  global.fetch = async (url) => {
    assert.equal(new URL(url).searchParams.get("select"), "name,score,level");
    return jsonResponse([{ name: "Student Example", score: 28, level: 10 }]);
  };

  const readResponse = makeResponse({});
  await leaderboardHandler({ method: "GET", url: "/api/leaderboard?level=all" }, readResponse);
  assert.equal(readResponse.statusCode, 200);
  assert.deepEqual(Object.keys(readResponse.body.entries[0]).sort(), ["level", "name", "score"]);

  const writeResponse = makeResponse({});
  await leaderboardHandler({ method: "POST", url: "/api/leaderboard" }, writeResponse);
  assert.equal(writeResponse.statusCode, 405);
});
