# ValentineWish 💕

A romantic Valentine's Day web experience featuring a beautiful video backdrop, animated story timeline, photo card, and an interactive "Will you be my Valentine?" question. The app is fully responsive and works seamlessly across all devices.

**Live:** [Valentine card](https://devashishsomani.github.io/ValentineWish/) · [Create your custom link](https://devashishsomani.github.io/ValentineWish/customize.html)

## ✨ Features

- **🎬 Video Backdrop** — Beautiful pastel pink animated background that plays throughout the story
- **📱 Fully Responsive** — Optimized for desktop, tablets, and mobile devices (portrait & landscape)
- **🎭 Interactive Story** — Animated timeline with messages, jokes, and romantic moments
- **🎨 Customization** — Personalize names, messages, photos, songs, and GIFs via a simple form
- **🎵 Background Music** — Default romantic song with option to upload your own
- **💚 Yes/No Game** — Interactive buttons with playful responses; No button grows harder to click
- **🏃 Peep Chase** — After multiple "No" clicks, Peep (from ncase/door) chases and steals the No button!

## 🚀 Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:7777` with live reload for HTML, CSS, and JS.

**Alternative:** Use Python's built-in server:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000/index.html`

## 📱 Responsive Design

The app features advanced responsive design:
- **Fluid Typography** — Uses `clamp()` for text that scales smoothly across all screen sizes
- **Adaptive Layouts** — Content repositions automatically for optimal viewing
- **Touch-Friendly** — Minimum 44px touch targets for buttons (Apple/Google guidelines)
- **Safe Areas** — Supports iPhone notches and home indicators with `env(safe-area-inset-*)`
- **Orientation Support** — Optimized layouts for both portrait and landscape modes
- **Viewport Units** — Uses `vmin`, `vw`, `vh`, `dvh` for dynamic scaling

### Media Query Breakpoints:
- Desktop: ≤1200px
- Tablet: ≤768px
- Mobile: ≤500px
- Small phones: ≤380px, ≤360px
- Landscape: max-height 500px

## 🎯 User Flow

1. **Intro Screen** — "Press the play button" overlay with animated play button
2. **Story Timeline** — Animated messages appear over video backdrop:
   - "Hey baby!" greeting
   - Opening line ("Good Morning! I have got something for you")
   - Story progression with jokes about e-cards
   - "Something special" message
   - "You're a big deal" moment
3. **Photo Card** — Image with title "Happy Valentine's Day Gorgeous 💕" and poem
4. **Yes/No Question** — "Will you be my Valentine?" with two buttons:
   - **Yes** → Celebration page with confetti and romantic message
   - **No** → Teasing messages, runaway button, then Peep chase

## 🔘 No Button Behavior

- **Early clicks (1-5):** Show teasing messages ("Are you sure?", "Pookie please…", etc.)
- **After 5 clicks:** **Runaway mode** activates — button moves on hover/touch
- **After 6+ clicks:** **Peep chase** — The bouncy character chases, grabs, and runs off with the No button
- **During chase:** Button text cycles through random funny messages every 1.5s

## 🎨 Customize Your Card

Visit **[customize.html](https://devashishsomani.github.io/ValentineWish/customize.html)** to create a personalized link:

### Required:
- **Name** — Shown as "Hey [name]!"

### Optional:
- **Opening Line** — Custom greeting below the name
- **Chaos/Greeting Text** — Story message with emojis
- **Photo** — Appears on the card (auto-compressed for localStorage)
- **Wish/Poem** — Custom message (defaults to Hindi poem)
- **Background Song** — Upload MP3 or other audio file
- **GIFs** — Custom GIFs for the Yes/No page and celebration page

### How It Works:
1. Fill in the form with your customizations
2. Click "Generate my link"
3. Get a unique URL with ID (e.g., `index.html?v=abc123xyz`)
4. Share the link — customizations work across devices!

### 🌐 Cross-Device Support:
- **With Node Server (node server.js):** ✅ Works on ALL devices
  - Configurations saved to `.valentine-configs/` directory
  - Accessed via API endpoints for true cross-device sharing
  - Fully responsive design adapts to any screen size
- **Static Hosting (GitHub Pages, etc.):** ⚠️ Same browser only
  - Uses localStorage (browser-specific)
  - Recipients on other devices see default experience with fallback message

## 📁 Project Structure

| Path | Purpose |
|------|---------|
| `index.html` | Main app with intro, story, card, and Yes/No question |
| `customize.html` | Customization form for creating personalized links |
| `customize.json` | Default customization values (fallback) |
| `server.js` | Node.js server with API for cross-device custom links |
| `script/main.js` | App flow, GSAP timeline animations, config loader (with API support) |
| `script/vday.js` | Yes/No button logic, runaway mode, Peep chase animation |
| `script/music.js` | Background music controls with play/pause/switch |
| `style/style.css` | Main styles with responsive design (story sections) |
| `style/vday.css` | Valentine-specific styles (buttons, Peep animations) |
| `backdrop/pastel_pink.mp4` | Video backdrop (pastel pink animation) |
| `img/peep.png` | Peep character sprite (from ncase/door, public domain) |
| `img/vector.jpg` | Default profile image |
| `music/` | Background music files (MP3) |
| `.valentine-configs/` | Saved custom configurations (generated, not in git) |

## 🛠 Tech Stack

- **Plain HTML/CSS/JS** — No frameworks, pure vanilla JavaScript
- **GSAP (GreenSock)** — Timeline animations for story sequence
- **Babel Standalone** — For JSX-like syntax in browser
- **Canvas Confetti** — Celebration confetti on Yes page
- **Browser-Sync** — Development server with live reload

## 🎬 Video Backdrop

The video backdrop (`backdrop/pastel_pink.mp4`) creates an immersive experience:
- Positioned with `z-index: 0` behind all content
- `position: fixed` for full viewport coverage
- `object-fit: cover` maintains aspect ratio
- Autoplays, muted, and loops continuously
- Pauses when transitioning to Yes/No section

## 📝 Default Content

### Default Poem (Hindi):
```
तू है तो लगता है कि है कोई जो मुझे चाह सकेगा,
हाँ, मैं हूँ थोड़ा पागल, हूँ थोड़ा नासमझ,
तेरे होने से है कोई जो मुझे मना सकेगा।

तेरी आदतों में मेरी कितनी शरारतों ने घर पाया है,
वरना तो ये दिल तो बस भटकता आया है।

सपनों का है एक घर मेरा, उजली सी छत वाला,
सब कहते हैं — घर ऐसा सपनों में ही होता है।

तेरे होने से ही वो घर आशियाना सा लगेगा,
तेरे साथ ही हर लम्हा सुहाना सा रहेगा।

तू है तो लगता है कि है कोई जो मुझे चाह सकेगा,
मैं हूँ प्यार के लायक बहुत —
ये कोई मुझे बता सकेगा।
```

### Main Quote (Yes page):
> "Happiness is a drug and I want to be your dealer."

## 📜 Credits

- **Original Birthday Card:** [faahim/happy-birthday](https://github.com/faahim/happy-birthday)
- **Peep Character:** [ncase/door](https://github.com/ncase/door) (public domain)
- **Developed by:** Devashish Somani

## 📄 License

Open source. Feel free to fork, customize, and share!

---

Made with ❤️ by Devashish Somani © 2026
