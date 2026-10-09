# VINSINFO Coding Quest

A browser-based placement practice game built with HTML, CSS, and JavaScript.

## Folder structure

```text
vinsinfo-coding-quest/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── levels/
│       ├── level1.js
│       ├── level2.js
│       ├── level3.js
│       ├── level4.js
│       ├── level5.js
│       ├── level6.js
│       ├── level7.js
│       ├── level8.js
│       ├── level9.js
│       └── level10.js
└── assets/
    └── README.md
```

## Run the project

1. Extract this folder.
2. Open the folder in VS Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.
4. Select an unlocked level and click **Start Level**.

## Add or edit questions

Each level has its own file under `js/levels/`. Follow this format:

```javascript
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[1] = {
  id: 1,
  title: "Programming Basics",
  icon: "💻",
  description: "Variables, operators, conditions and loops.",
  topics: ["Variables", "Operators"],
  questions: [
    {
      question: "Example question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: 1,
      hint: "A short hint.",
      explanation: "Why option B is correct."
    }
  ]
};
```

`answer` is the zero-based index of the correct option: 0 means A, 1 means B, 2 means C, and 3 means D. Each level has a question bank; a game randomly selects up to 30 questions from that bank for each run.

## Current limitations

- XP, streak, unlocked levels, and completed levels are saved in this browser using local storage. Progress is specific to the browser and device.
- This is a front-end prototype. Authentication, a database, teacher/admin tools, and an online leaderboard can be added later with Spring Boot and PostgreSQL.
- The question bank contains 350 practice questions across 10 levels. Each level randomly presents 30 questions per game from its 35-question bank. These are placement-round practice questions, not a verified or official list of VINSINFO questions.
