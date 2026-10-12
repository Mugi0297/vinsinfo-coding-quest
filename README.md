# VINSINFO Coding Quest

A browser-based placement practice game built with HTML, CSS, and JavaScript.

## Folder structure

```text
vinsinfo-coding-quest/
├── index.html
├── admin.html
├── README.md
├── api/
│   ├── leaderboard.js
│   ├── student-progress.js
│   └── admin/
│       ├── auth.js
│       └── dashboard.js
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── app.js
│   ├── admin.js
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

- XP and streak are saved in this browser. Student profiles and level attempts are stored centrally in Supabase and available to the admin dashboard.
- Starting a run requires valid student details and a working progress API. Students begin at Level 1; the server checks for a passing attempt at the previous level before allowing the next level.
- Student names, roll numbers, departments, sections, and scores are public on the shared leaderboard. Students must enter these details before starting a run.
- Leaderboard submissions are limited to 10 per IP address per 10-minute window and checked for valid score and level ranges. Runs are still submitted by the browser without accounts or server-side gameplay verification, so the public leaderboard is not cheat-proof.
- The question bank contains 350 practice questions across 10 levels. Each level randomly presents 30 questions per game from its 35-question bank. These are placement-round practice questions, not a verified or official list of VINSINFO questions.

## Configure the shared Vercel leaderboard

The Vercel functions store leaderboard entries, student profiles, and level attempts in Supabase. The Supabase service-role key and admin credentials are used only on the server and must never be added to browser JavaScript or committed to the repository.

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/leaderboard.sql`](./supabase/leaderboard.sql). Running it again adds the progress tables and columns without deleting existing leaderboard scores. Progress tracking starts for runs launched after deployment.
3. In the Vercel project settings, add these environment variables for the deployment environments you use:
   - `SUPABASE_URL`: the project URL from Supabase API settings.
   - `SUPABASE_SERVICE_ROLE_KEY`: the service-role key from Supabase API keys.
   - `ADMIN_USERNAME`: the username to use at `/admin.html`.
   - `ADMIN_PASSWORD`: a strong, unique admin password of at least 12 characters.
   - `ADMIN_SESSION_SECRET`: a random secret of at least 32 characters, used to sign secure admin sessions.
     Generate one with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`.
4. Redeploy the Vercel project so the functions receive the environment variables.
5. Open **View Leaderboard** on the deployed site and choose **All levels** or a specific level. Visit `/admin.html` to sign in and view student progress, score cards, the leaderboard, and charts.

The API limits scores to 0–1020 and levels to 1–10, and the database enforces the same bounds. Submission throttling uses a keyed hash of the request IP, not the raw address. Student progress records rely on client-reported game results and are not tamper-proof. Keep the Supabase service-role key and admin credentials private. Opening `index.html` directly from disk will not provide server-side student tracking; deploy the project with its API functions.
