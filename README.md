# ValentineWish 💕

A Valentine's Day web experience: intro, story timeline, and a “Will you be my Valentine?” card with a Yes/No choice. Say No enough times and **Peep** (the character from the door game) chases the No button, grabs it, and runs off with it.

**Live:** [Valentine card](https://devashishsomani.github.io/ValentineWish/) · [Create your link (customize)](https://devashishsomani.github.io/ValentineWish/customize.html)

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:7777` with live reload for HTML, CSS, and JS. On Windows use `npm start` (or adjust the script for your browser).

## What’s in the app

- **Intro** — Play button to start; optional name/greeting.
- **Story** — Short timeline (e-card jokes, “something special”, “you’re a big deal”).
- **Card** — Photo, title “Happy Valentine’s Day Gorgeous 💕”, and a message/poem (default: Hindi poem; main line: *“Happiness is a drug and I want to be your dealer.”*).
- **Yes / No** — Yes leads to `yes.html`. No leads to teasing messages and, eventually, runaway mode and the **Peep** chase.

## No button & Peep chase

- Early No’s show a sequence of messages (e.g. “Are you sure?”, “Pookie please…”, “One more 'No' and I'm sending the little buddy.”).
- After **5** No attempts, **runaway mode** turns on: the No button can be moved by hover/touch; it’s harder to click.
- After one more No (or hover) in runaway mode, the **Peep** is triggered (the bouncy character from [ncase/door](https://github.com/ncase/door)): it chases the No button with a bounce animation, “grabs” it with a squash/stretch, then runs off the screen with it; the No button disappears.
- While the Peep is chasing, the No button text cycles every 1.5s through a large pool of random messages (from `noMessages` and `noMessagesRandom` in `script/vday.js`).

## Customize

- **[customize.html](https://devashishsomani.github.io/ValentineWish/customize.html)** — Set name, greeting, card title, photo URL, and wish/poem. Options are saved to **`customize.json`** and applied when the main app loads (see `script/main.js`).

## Project layout

| Path | Purpose |
|------|--------|
| `index.html` | Main app: intro, story, card, Yes/No. Contains default poem and main quote. |
| `yes.html` | Page shown when the user clicks Yes. |
| `customize.html` | Customization form; writes `customize.json`. |
| `customize.json` | Saved customization (name, greeting, wish text, etc.). |
| `script/main.js` | App flow, timeline, applying customize data, Yes/No click handling. |
| `script/vday.js` | No-button logic: runaway mode, Peep chase/grab/runaway, messages. |
| `script/music.js` | Background music control. |
| `style/style.css` | Main styles. |
| `style/vday.css` | Valentine-specific styles (Peep bounce/grab keyframes, run-off). |
| `img/peep.png` | Peep character sprite (from [ncase/door](https://github.com/ncase/door), public domain). |

## Tech

- Plain HTML/CSS/JS; no framework.
- Dev server: **browser-sync** (see `package.json` scripts).
- Original repo: [happy-birthday](https://github.com/faahim/happy-birthday); modified for Valentine’s Day. Chase character (Peep) from [ncase/door](https://github.com/ncase/door).
