// Parse ?v= config id and load from localStorage; apply to DOM and set window.__valentineConfigId
const loadConfigFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("v");
  if (!id) return;
  const key = "valentine_config_" + id;
  let config;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      document.getElementById("config-missing-overlay").style.display = "flex";
      return "missing";
    }
    config = JSON.parse(raw);
  } catch (e) {
    document.getElementById("config-missing-overlay").style.display = "flex";
    return "missing";
  }
  window.__valentineConfigId = id;
  if (config.name) {
    const nameEl = document.getElementById("name");
    if (nameEl) nameEl.innerText = config.name.endsWith("!") ? config.name : config.name + "!";
  }
  const openingEl = document.getElementById("greetingText");
  if (openingEl && config.openingLine) openingEl.innerText = config.openingLine;
  if (config.greetingText) {
    const el = document.getElementById("chaosLine");
    if (el) el.innerHTML = config.greetingText.replace(/\n/g, "<br>");
  }
  if (config.wishText) document.getElementById("wishText").innerHTML = config.wishText.replace(/\n/g, "<br>");
  if (config.photoDataUrl) document.getElementById("imagePath").setAttribute("src", config.photoDataUrl);
  else if (config.imagePath) document.getElementById("imagePath").setAttribute("src", config.imagePath);
  const vdayGif = document.querySelector("#vday-app #cat-gif");
  if (vdayGif && config.gifVdayDataUrl) vdayGif.setAttribute("src", config.gifVdayDataUrl);
  const yesGif = document.getElementById("yes-gif");
  if (yesGif && config.gifYesDataUrl) yesGif.setAttribute("src", config.gifYesDataUrl);
  const appAudioSource = document.querySelector("#bg-music source");
  if (appAudioSource && config.songDataUrl) {
    appAudioSource.setAttribute("src", config.songDataUrl);
    if (config.songDataUrl.startsWith("data:audio/")) {
      const m = config.songDataUrl.match(/data:audio\/([^;]+)/);
      appAudioSource.setAttribute("type", m ? "audio/" + m[1] : "audio/mpeg");
    }
  }
  return "applied";
};

// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  // Use spread so emojis (e.g. 💕) stay intact when splitting for animation; keep <br> as one token
  let chatHtml = textBoxChars.innerHTML;
  const brPlaceholder = "\u200B";
  chatHtml = chatHtml.replace(/<br\s*\/?>/gi, brPlaceholder);
  const chatChars = [...chatHtml];
  textBoxChars.innerHTML = chatChars
    .map((c) => (c === brPlaceholder ? "<br>" : `<span>${c}</span>`))
    .join("");

  const hbdChars = [...hbd.innerHTML];
  hbd.innerHTML = hbdChars
    .map((c) => (c === " " ? '<span class="wish-hbd-space"> </span>' : `<span>${c}</span>`))
    .join("");

  const wishTextEl = document.getElementById("wishText");
  const savedWishHtml = wishTextEl ? wishTextEl.innerHTML : "";
  if (wishTextEl) wishTextEl.innerHTML = "";

  const runTypewriter = (el, html, msPerChar) => {
    if (!el || !html) return;
    let i = 0;
    let current = "";
    const tick = () => {
      if (i >= html.length) return;
      if (html.substring(i, i + 4) === "<br>") {
        current += "<br>";
        i += 4;
      } else if (html.substring(i, i + 5) === "<br/>") {
        current += "<br>";
        i += 5;
      } else {
        current += html[i];
        i += 1;
      }
      el.innerHTML = current;
      setTimeout(tick, msPerChar);
    };
    tick();
  };

  const runLineByLine = (el, html, msPerLine) => {
    if (!el || !html) return;
    const lines = html.split(/<br\s*\/?>/i);
    let index = 0;
    const showNext = () => {
      if (index >= lines.length) return;
      el.innerHTML = (el.innerHTML ? el.innerHTML + "<br>" : "") + lines[index];
      index += 1;
      setTimeout(showNext, msPerLine);
    };
    showNext();
  };

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg",
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg",
  };

  const tl = new TimelineMax();

  tl.to(".container", 0.1, {
    visibility: "visible",
  })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10,
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10,
    })
    .to(".container > .one", 0, { opacity: 1 }, "+=0")
    .to(".one", 1.1, {
      opacity: 0,
      y: 10,
    }, "+=3")
    .to(
      ".two",
      1.1,
      {
        opacity: 0,
        y: 10,
      },
      "-=0.8"
    )
    .to(".two-b", 1.1, {
      opacity: 1,
      y: 0,
    })
    .to(
      ".two-b",
      1.1,
      {
        opacity: 0,
        y: 10,
      },
      "+=4"
    )
    .from(".three", 1.1, {
      opacity: 0,
      y: 10,
    })
    .to(
      ".three",
      1.1,
      {
        opacity: 0,
        y: 10,
      },
      "+=4"
    )
    .from(".four", 0.3, { opacity: 0 })
    .from(".four .chatbox-caption", 0.5, { opacity: 0, y: 8 })
    .from(".four .text-box", 0.5, { opacity: 0, y: 6 })
    .staggerTo(
      ".hbd-chatbox span",
      0.6,
      {
        visibility: "visible",
      },
      0.06
    )
    .from(".four .chatbox-footer", 0.4, { opacity: 0, y: 5 })
    .from(".fake-btn", 0.4, {
      scale: 0.2,
      opacity: 0,
    })
    .to(".fake-btn", 0.15, {
      backgroundColor: "rgb(127, 206, 248)",
    })
    .to(
      ".four",
      0.8,
      {
        scale: 0.2,
        opacity: 0,
        y: -150,
      },
      "+=2.5"
    )
    .from(".idea-1", 0.9, ideaTextTrans)
    .to(".idea-1", 0.9, ideaTextTransLeave, "+=2.2")
    .from(".idea-2", 0.9, ideaTextTrans)
    .to(".idea-2", 0.9, ideaTextTransLeave, "+=2.2")
    .from(".idea-3", 0.9, ideaTextTrans)
    .to(".idea-3 strong", 0.6, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff",
    })
    .to(".idea-3", 0.9, ideaTextTransLeave, "+=2.2")
    .from(".idea-4", 0.9, ideaTextTrans)
    .to(".idea-4", 0.9, ideaTextTransLeave, "+=2.2")
    .from(
      ".idea-5",
      0.9,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0,
      },
      "+=0.6"
    )
    .to(
      ".idea-5 span",
      0.9,
      {
        rotation: 90,
        x: 8,
      },
      "+=0.5"
    )
    .to(
      ".idea-5",
      0.9,
      {
        scale: 0.2,
        opacity: 0,
      },
      "+=2.8"
    )
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut,
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut,
      },
      0.2,
      "+=1"
    )
    .from(
      ".girl-dp",
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45,
      },
      "+=0.6"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0,
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5),
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150,
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#c41e5a",
        ease: Expo.easeOut,
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.4,
      {
        opacity: 0,
        y: 8,
      },
      "party"
    )
    .add(
      function () {
        runLineByLine(wishTextEl, savedWishHtml, 700);
      },
      [],
      "+=0.2"
    )
    .staggerFromTo(
      ".baloons img",
      2.5,
      {
        opacity: 0.9,
        y: 1400,
      },
      {
        opacity: 1,
        y: -1000,
      },
      0.2
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4,
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1",
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to({}, 3.5, {}); // delay before switching to v-day so .nine message is read

  // When ValentineWish animation ends, show v-day (stop backdrop video — v-day has its own background)
  tl.eventCallback("onComplete", () => {
    const backdrop = document.getElementById("valentine-backdrop");
    if (backdrop) backdrop.pause();
    document.getElementById("valentine-wish-app").style.display = "none";
    const vdayApp = document.getElementById("vday-app");
    vdayApp.style.display = "block";
    // Load v-day script so it runs now (music, button handlers, etc.)
    if (!window.vdayScriptLoaded) {
      const script = document.createElement("script");
      script.src = "script/vday.js";
      script.onload = () => { window.vdayScriptLoaded = true; };
      document.body.appendChild(script);
    }
  });
  return tl;
};

// Import the data to customize and insert them into page (used when no ?v= config)
const fetchData = () => {
  return fetch("customize.json")
    .then((data) => data.json())
    .then((data) => {
      Object.keys(data).map((customData) => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .getElementById(customData)
              .setAttribute("src", data[customData]);
          } else if (customData === "openingLine" && document.getElementById("greetingText")) {
            document.getElementById("greetingText").innerText = data[customData] || "";
          } else if (customData === "greetingText" && document.getElementById("chaosLine")) {
            document.getElementById("chaosLine").innerHTML = (data[customData] || "").replace(/\n/g, "<br>");
          } else if (customData === "wishText" && document.getElementById("wishText")) {
            const el = document.getElementById("wishText");
            el.innerHTML = (data[customData] || "").replace(/\n/g, "<br>");
          } else if (document.getElementById(customData)) {
            document.getElementById(customData).innerText = data[customData];
          }
        }
      });
    })
    .catch(() => {});
};

// Run: if ?v= and config missing, we already showed overlay; otherwise load config or fetch JSON, then run animation
const resolveFetch = () => {
  const urlConfig = loadConfigFromUrl();
  if (urlConfig === "missing") return Promise.resolve();
  if (urlConfig === "applied") return Promise.resolve();
  return fetchData();
};

// Confetti when Yes section is shown (same-page flow; music keeps playing)
window.launchYesConfetti = () => {
  if (typeof confetti !== "function") return;
  const colors = ["#ff69b4", "#ff1493", "#ff85a2", "#ffb3c1", "#ff0000", "#ff6347", "#fff", "#ffdf00"];
  const duration = 6000;
  const end = Date.now() + duration;
  confetti({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.3 }, colors });
  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }
    confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
    confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
  }, 300);
};

const bindIntroButton = () => {
  const overlay = document.getElementById("intro-overlay");
  const btn = document.getElementById("intro-play-btn");
  if (!overlay || !btn) return;
  btn.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      overlay.classList.add("hidden");
      if (window.startValentineMusic) window.startValentineMusic();
      const tl = animationTimeline();
      tl.play();
    },
    { once: true, capture: false }
  );
};

resolveFetch().then(() => {
  if (document.getElementById("config-missing-overlay").style.display === "flex") return;
  bindIntroButton();
});
