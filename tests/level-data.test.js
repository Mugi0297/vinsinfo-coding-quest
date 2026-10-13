const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const answerKeys = require("../api/_lib/answer-key.json");

const levelsDirectory = path.join(__dirname, "..", "js", "levels");
const levelFiles = fs.readdirSync(levelsDirectory)
  .filter(file => /^level\d+\.js$/.test(file))
  .sort((first, second) => first.localeCompare(second, undefined, { numeric: true }));
const levelContext = { window: { QUEST_LEVELS: {} } };

levelFiles.forEach(file => {
  const source = fs.readFileSync(path.join(levelsDirectory, file), "utf8");
  vm.runInNewContext(source, levelContext, { filename: file });
});
vm.runInNewContext(
  fs.readFileSync(path.join(levelsDirectory, "extra-questions.js"), "utf8"),
  levelContext,
  { filename: "extra-questions.js" }
);

const levels = levelContext.window.QUEST_LEVELS;

test("all ten levels contain 35 questions and matching answer keys", () => {
  assert.equal(Object.keys(levels).length, 10);

  Object.entries(levels).forEach(([levelId, level]) => {
    assert.equal(level.questions.length, 35, `${level.title} question count`);
    assert.equal(answerKeys[levelId]?.length, level.questions.length, `${level.title} answer-key length`);
  });
});

test("each question has four distinct options and a valid server answer", () => {
  Object.entries(levels).forEach(([levelId, level]) => {
    level.questions.forEach((question, questionIndex) => {
      const label = `${level.title} question ${questionIndex + 1}`;
      assert.equal(typeof question.question, "string", `${label} prompt`);
      assert.ok(question.question.trim(), `${label} prompt is not empty`);
      assert.equal(typeof question.hint, "string", `${label} hint`);
      assert.ok(question.hint.trim(), `${label} hint is not empty`);
      assert.equal(typeof question.explanation, "string", `${label} explanation`);
      assert.ok(question.explanation.trim(), `${label} explanation is not empty`);
      assert.equal(question.options.length, 4, `${label} option count`);
      assert.ok(question.options.every(option => typeof option === "string" && option.trim()), `${label} options`);
      assert.equal(new Set(question.options).size, question.options.length, `${label} duplicate options`);

      const answerIndex = answerKeys[levelId][questionIndex];
      assert.ok(Number.isInteger(answerIndex), `${label} answer index is an integer`);
      assert.ok(answerIndex >= 0 && answerIndex < question.options.length, `${label} answer index is in range`);
    });
  });
});
