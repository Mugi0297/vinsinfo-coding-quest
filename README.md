# VINSINFO Coding Quest

A browser-based placement practice game built with HTML, CSS, and JavaScript.

## Folder structure

```text
vinsinfo-coding-quest/
├── index.html
├── README.md
├── api/
│   └── leaderboard.js
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
├── assets/
│   └── README.md
└── supabase/
    └── leaderboard.sql
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
- The shared leaderboard requires the Supabase setup below. Player progress remains local to each browser.
- Leaderboard nicknames and scores are public. Players should use nicknames and not enter personal information.
- Leaderboard submissions are limited to 10 per IP address per 10-minute window and checked for valid score and level ranges. Runs are still submitted by the browser without accounts or server-side gameplay verification, so the public leaderboard is not cheat-proof.
- The question bank contains 350 practice questions across 10 levels. Each level randomly presents 30 questions per game from its 35-question bank. These are placement-round practice questions, not a verified or official list of VINSINFO questions.

## Configure the shared Vercel leaderboard

The Vercel function at `api/leaderboard.js` reads and writes leaderboard rows through Supabase. The Supabase service-role key is only used on the server and must never be added to browser JavaScript or committed to the repository.

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/leaderboard.sql`](./supabase/leaderboard.sql). If you already created the leaderboard table using an earlier version of this file, run the full updated SQL again; its `if not exists` and `create or replace` statements add the rate-limit table and function without deleting existing scores.
3. In the Vercel project settings, add these environment variables for the deployment environments you use:
   - `SUPABASE_URL`: the project URL from Supabase API settings.
   - `SUPABASE_SERVICE_ROLE_KEY`: the service-role key from Supabase API keys.
4. Redeploy the Vercel project so the function receives the environment variables.
5. Open **View Leaderboard** on the deployed site and choose **All levels** or a specific level. Completed runs will be submitted to the shared table and ranked among scores for that level.

The API limits scores to 0–1020 and levels to 1–10, and the database enforces the same bounds. Submission throttling uses a keyed hash of the request IP, not the raw address. Since this game currently has no sign-in or server-side answer validation, a determined visitor can still forge a score within those limits. Keep the Supabase service-role key private.
