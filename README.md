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
4. New students select **Create an account** and enter their name, roll number, department, section, and password. Registration signs them in automatically. Returning students sign in with their roll number and password. Confirm the displayed details, accept the public leaderboard notice, then start at Level 1.

Student login and server-verified progress require the deployed API and Supabase configuration below. Opening `index.html` directly from disk only displays the front end; it cannot authenticate or save shared progress.

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
      hint: "A short hint.",
      explanation: "Why option B is correct."
    }
  ]
};
```

The correct option text is stored separately in the server-only `api/_lib/answer-key.json`; do not put correct-answer markers in public level scripts. Keep each answer-key array aligned with its level's `questions` array whenever questions are added, removed, or reordered. Grading compares the selected option text rather than its position, so reordering answer choices does not change which answer is accepted. A game uses a stable seeded selection from each level's 35-question bank so the same student sees a consistent question set for that level across attempts.

## Current limitations

- Students can create accounts from the game page with their name, roll number, department, section, and a password of at least 12 characters. Successful registration signs the student in automatically. Roll numbers must be unique but are not independently verified, so they should not be treated as proof of student identity. Passwords are stored as scrypt hashes. Admin enrollment remains available for correcting profiles or resetting passwords.
- The learning order is Level 1: Pseudocode Practice (bank ID 10), Level 2: Flowchart Master (bank ID 5), then Programming Basics, Logic Master, Array Hunter, Output Detective, Debugging Zone, DSA Battle, VINSINFO Mock Round, and Final Boss. Existing database bank IDs remain unchanged; displayed level numbers follow this order.
- Students begin at Level 1. The server verifies answers, scores, pass status, and level access. The client still chooses the question order, so this does not prevent a determined player from inspecting the public question bank or manipulating question selection.
- A student must explicitly consent before starting. Student name, score, and level are public; roll number, department, and section are excluded from the public leaderboard and available only in the admin dashboard.
- XP and streak are browser-only display stats. Verified attempts, scores, and passed levels are stored centrally and shown in the admin dashboard.
- **Reset Progress** requires a signed-in student and resets server-verified level unlocks for a fresh Level 1 start. It preserves historical attempts in the admin dashboard and leaves public leaderboard scores unchanged.
- The 60-second question deadline is enforced by server timestamps. Answers received after the deadline are recorded as timeouts and do not earn points.
- The game has 350 practice questions across 10 levels, with 35 questions in each level. Each run presents 30 questions selected from the bank using a stable seed for that student and level, so repeated attempts remain fair and consistent. These are placement-round practice questions, not a verified or official list of VINSINFO questions.

## Configure the shared Vercel leaderboard

The Vercel functions store leaderboard entries, student profiles, and level attempts in Supabase. The Supabase service-role key and admin credentials are used only on the server and must never be added to browser JavaScript or committed to the repository.

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/leaderboard.sql`](./supabase/leaderboard.sql). Run this migration again after deploying this update to add the server-side progress-reset timestamp; rerunning it does not delete existing attempts or leaderboard scores.
3. In the Vercel project settings, add these environment variables for the deployment environments you use:
   - `SUPABASE_URL`: the project URL from Supabase API settings.
   - `SUPABASE_SERVICE_ROLE_KEY`: the service-role key from Supabase API keys.
   - `ADMIN_USERNAME`: the username to use at `/admin.html`.
   - `ADMIN_PASSWORD`: a strong, unique admin password of at least 12 characters.
   - `ADMIN_SESSION_SECRET`: a random secret of at least 32 characters, used to sign secure admin sessions.
     Generate one with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`.
   - `STUDENT_SESSION_SECRET`: a separate random secret of at least 32 characters, used to sign student sessions. Generate one with the same Node command; do not reuse `ADMIN_SESSION_SECRET`.
4. Redeploy the Vercel project so the functions receive the environment variables.
5. Open the deployed student page and select **Create an account**. Students fill in their own details, create a password of at least 12 characters, and are signed in automatically after registration. A roll number can only be registered once.
6. Students can later sign in with their roll number and password, review and accept the public leaderboard consent, and start Level 1. Visit `/admin.html` to view progress and use **Enroll student** to correct profiles or reset passwords. Use **View Leaderboard** to see public scores; roll number, department, and section remain admin-only.

The server calculates score and pass status from answer submissions, and each completed run is inserted into the leaderboard idempotently. Submission throttling uses a keyed hash of the request IP, not the raw address. Keep the Supabase service-role key, admin credentials, and session secrets private. Changing either session secret signs out all existing sessions using that secret.
