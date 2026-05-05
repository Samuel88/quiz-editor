# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install   # install dependencies
pnpm dev       # dev server at http://localhost:5173
pnpm build     # production build
pnpm preview   # preview production build
```

No test runner or linter is configured.

## Architecture

Single-page React app (Vite). All quiz state lives in `App.jsx` — there is no global store. The component tree is flat:

```
App
├── QuizSelector     # grid of quiz cards, reads from quizzes.js
├── ProgressBar      # shows question counter + countdown timer
├── Question         # renders domanda, optional snippet, answer buttons, feedback
└── Results          # score, per-answer review, localStorage high scores
```

### Adding a quiz

Two steps only:

1. Create `public/questions/<slug>.json` — see `public/questions/questionsGuide.md` for the full schema.
2. Add an entry to the `quizzes` array in `src/quizzes.js`. The quiz appears automatically in the selector.

`quizMap` (exported from `quizzes.js`) is a `id → quiz` lookup used by `App.jsx` to fetch the right file.

### Question JSON schema (key fields)

| Field        | Required | Notes |
|--------------|:--------:|-------|
| `domanda`    | yes | Markdown supported |
| `risposte`   | yes | Array of 3 strings, Markdown supported |
| `corretta`   | yes | 0-based index of the correct answer |
| `spiegazione`| yes | Shown after answering, Markdown supported |
| `snippet`    | no  | Fenced code block shown above answers |
| `tempo`      | no  | Per-question timer in seconds; falls back to `QUESTION_TIMEOUT` (60s) |

### Timer logic

`QUESTION_TIMEOUT = 60` is the global default in `App.jsx`. A `useEffect` on `[currentQuestion, questions]` calls `getQuestionTimeout(question)` — which reads `question.tempo ?? QUESTION_TIMEOUT` — and resets `timeLeft` on every question change. A second `useEffect` on `[timeLeft]` counts down and auto-advances when it reaches 0.

### Markdown rendering

`react-markdown` is used throughout. The `Inline` helper (defined locally in `Question.jsx` and `Results.jsx`) strips wrapping `<p>` tags so inline text renders correctly inside buttons and spans.

### Scores

Stored in `localStorage` under the key `quizScores` as a flat array of `{ score, total, date, percentage }`. The top 5 by percentage are shown in `Results`.
