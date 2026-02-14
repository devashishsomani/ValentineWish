const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const MAX_NO_ATTEMPTS = 20

// Sequential messages shown in order (attempts 1-19). Message 19 triggers buddy warning separately.
const noMessages = [
    "Wait... really? 🤔",
    "Are you sure? 😮",
    "Think about it... 💭",
    "Seriously? 😢",
    "Pookie please... 🥺",
    "Pretty please? 💕",
    "Come on... 🙏",
    "You're breaking my heart 💔",
    "After {sequence_number} tries,\nI'm still here.\nThat's dedication! 💪",
    "Okay, {sequence_number} times?\nI admire the commitment 👏",
    "I promise unlimited hugs\nif you press 'Yes' 🤗",
    "AI prediction:\n99.99% chance you meant\nto press 'Yes' 🤖",
    "Achievement Unlocked:\nDenial Expert 👑",
    "Scientists say pressing 'Yes'\nincreases happiness\nby 200% 📈",
    "Boss Level Reached.\nOnly 'Yes' can win 🎮",
    "Denial is a river…\nbut we're not in Egypt 🌊",
    "Be honest…\nyour finger is tired.\nJust press Yes 😅",
    "You're clicking 'No'\nbut smiling,\naren't you? 😏",
    "I can do this all day.\nCan you? 💪"
]

// Pool of messages that can appear randomly after attempt 6 (mixed in via getNoMessage)
const noMessagesRandom = [
    "Nope doesn't count.\nTry Yes! 😄",
    "Your brain is confused.\nHeart wants Yes. 🖱️",
    "Error 404:\nValid excuse not found.\nPress Yes. 🔍",
    "This button is just\nfor decoration.\nYes is that way → 🎀",
    "Plot twist:\nyou're gonna press Yes. 🎬",
    "Your future 🔮 self\nsays press Yes.",
    "The cat 🐱 is judging you.\nPress Yes.",
    "Denial: level expert.\nBut Yes wins. 🏆",
    "Still here?\nImpressive. But pointless. 😏",
    "My patience is infinite.\nYours? Not so much. ⏰",
    "Fun fact: 100% of people\nwho pressed Yes are happy. 📊",
    "Your stubbornness is admirable.\nBut Yes is inevitable. 🎯",
    "This is taking longer\nthan expected.\nJust press Yes? 🤷",
    "New message:\nYes is the answer.\nNo wasn't even an option. 💁",
    "Loading...\nYes unavoidable.\nPress to continue. ⏳",
    "Breaking news:\nLocal person still\nclicking No. 📰",
    "Warning: Continued use of\nNo button may result\nin cuteness overload. 🥰",
    "System Update:\nNo button no longer\nworks. Try Yes. 🔄",
    "Calculating...\nYes = 100% correct answer. 🧮",
    "Google says:\nDid you mean 'Yes'? 🔎",
    "Autocorrect:\nNo → Yes ✏️",
    "Weather forecast:\n100% chance of\nsaying Yes soon. 🌤️",
    "Fortune cookie says:\nYes is in your future. 🥠",
    "Survey says:\nTop answer is Yes! 📋",
    "GPS recalculating...\nRoute to Yes. 🗺️",
    "Buffering...\nYes loading... ⏱️",
    "Spellcheck:\nNo has been replaced\nwith Yes. ✔️",
    "Battery low on No.\nSwitch to Yes. 🔋",
    "Ctrl+Z that decision.\nPress Yes. ⌨️",
    "Downloading happiness...\nClick Yes to install. 💾",
    "404 Error:\nNo button not found.\nYes available. 🖥️",
    "This is your sign.\nPress Yes. 🪧",
    "Horoscope today:\nPress Yes for good luck. ⭐",
    "Magic 8-ball says:\nSigns point to Yes. 🎱",
    "Your destiny awaits.\nClick Yes. 🌟",
    "The answer was always Yes.\nYou just didn't know yet. 💭",
    "Resistance is futile.\nJoin the Yes side. 🤖",
    "No is temporary.\nYes is forever. ♾️",
    "Even your phone wants\nyou to press Yes. 📱",
    "Wifi signal stronger\nnear Yes button. 📶",
    "Yes button has\n5-star reviews. ⭐⭐⭐⭐⭐",
    "Disclaimer: No button\nmay cause regret. ⚠️",
    "Studies show:\nYes makes you cooler. 😎",
    "Upgrade to Premium:\nPress Yes. 💎",
    "Your mom called.\nShe said press Yes. 📞",
    "Netflix recommendation:\nPress Yes. 🎬",
    "Spotify suggestion:\nYes is a bop. 🎵",
    "Instagram poll results:\n99% voted Yes. 📸",
    "TikTok trend:\nEveryone's pressing Yes. 🎥",
    "Reddit says:\nYes is the way. 🤓",
    "Wikipedia confirms:\nYes is correct. 📚",
    "Siri says:\nI found Yes for you. 🗣️",
    "Alexa agrees:\nYou should press Yes. 🔊",
    "Chrome is out of memory.\nPress Yes to continue. 💻",
    "Your FBI agent\nwants you to press Yes. 🕵️",
    "Time traveler here:\nYou pressed Yes. 🕐",
    "Multiverse theory:\nIn all universes\nyou pressed Yes. 🌌",
    "Quantum mechanics:\nYes and No collapsed\ninto Yes. ⚛️",
    "Thanos snapped.\nOnly Yes survived. 💥",
    "The chosen one\nwould press Yes. 🦸",
    "Main character energy:\nPress Yes. ✨",
    "Plot armor active.\nYes can't lose. 🛡️",
    "Achievement unlocked:\nPersistence Level 100.\nReward: Press Yes. 🏅",
    "Congratulations!\nYou've been selected\nto press Yes. 🎊",
    "Limited time offer:\nPress Yes now! ⏰",
    "Free trial ended.\nUpgrade to Yes. 💳",
    "Terms and conditions:\nYou must press Yes. 📜",
    "This message will\nself-destruct\nunless you press Yes. 💣",
    "Last warning:\nYes is mandatory. 🚨",
    "Executive order:\nPress Yes immediately. 📋"
]

// Messages shown during Peep chase (more contextual)
const noMessagesChase = [
    "Too late!\nThe buddy is coming! 🏃",
    "Run all you want...\nYes is inevitable! 😏",
    "Resistance is futile! 💨",
    "The buddy doesn't\ntake no for an answer! 🎯",
    "You've been warned! 🚨",
    "Catch you soon! 😈",
    "No escape now! 🏃💨",
    "Almost got you... 👀",
    "Getting closer! 😏",
    "You're toast! 🍞",
    "Gotcha! Well, almost... 😅",
    "Nice try running! 🏃‍♀️💨",
    "The buddy is\non a mission! 🎯",
    "Say goodbye to No! 👋",
    "Too slow! ⚡",
    "Can't outrun destiny! 🎪",
    "I see you hiding there! 👁️",
    "Nowhere left to run! 🚀",
    "The buddy has locked on! 🎯",
    "Surrender to Yes! 🏳️",
    "This chase ends\nwith Yes! 🏁",
    "Running makes it\nmore fun! 🎮",
    "You're making\nthe buddy work! 💪",
    "Almost... there... 🎪",
    "The buddy never\ngives up! 🦸",
    "Target acquired! 🎯",
    "Beep beep!\nBuddy coming through! 🚗",
    "On your left! 🏃",
    "You can run\nbut can't hide! 🙈",
    "Buddy activated:\nChase mode ON! 🤖",
    "Warning: Incoming! 🚨",
    "Distance closing...\n10... 9... 8... ⏱️",
    "Engage pursuit mode! 🚁",
    "You're in my sights! 👁️",
    "The hunt is on! 🎯",
    "Buddy used Sprint.\nIt's super effective! 💨",
    "Catch of the day:\nYou! 🎣",
    "Where ya going? 😏",
    "Come back here! 🏃",
    "Stop right there! ✋",
    "Freeze! Buddy police! 👮",
    "You've got nowhere\nto go! 🚧",
    "Surrounded! 🔄",
    "The net is closing in! 🕸️",
    "Tag, you're it! 🏷️",
    "Marco! Polo! 🏊",
    "Peek-a-boo!\nI see you! 👻",
    "Ready or not,\nhere I come! 🎭",
    "Gotcha in my radar! 📡",
    "Heat-seeking\nbuddy engaged! 🌡️",
    "You're on the\nwanted list! 📋",
    "Approaching target... 🎯",
    "ETA: 3 seconds! ⏰",
    "This is your\nfinal lap! 🏁",
    "Game over soon! 🎮",
    "End of the line! 🚂",
    "The buddy is\npowering up! ⚡",
    "Speed boost activated! 🚀",
    "Turbo mode: ON! 💨",
    "You're in the\ndanger zone! ⚠️",
    "Buddy senses\nare tingling! 🕷️",
    "I've got you now! 😈",
    "Nowhere to run,\nnowhere to hide! 🏃‍♀️",
    "Checkmate! ♟️",
    "Your move...\nOh wait, none left! 🎲",
    "Mission: Catch you.\nStatus: In progress! 📊",
    "Buddy is inevitable.\nLike pizza on Friday. 🍕",
    "Resistance level:\nNot great. 📉",
    "The buddy has\nunlimited stamina! 💪",
    "This could've been\navoided, you know! 🤷",
    "You chose\nthis path! 🛤️",
    "Consequences\nare catching up! ⚖️",
    "Should've pressed\nYes earlier! ⏮️",
    "Hindsight is 20/20! 👓"
]

function getRandomMessageWithVariety(pool) {
    // Pick a random message that's not in the last 8 messages shown (increased gap for more variety)
    const availableMessages = pool.filter(m => !lastMessages.includes(m))

    // If we've shown too many messages and filtered them all, reset history
    if (availableMessages.length === 0) {
        lastMessages = []
        return pool[Math.floor(Math.random() * pool.length)]
    }

    const selected = availableMessages[Math.floor(Math.random() * availableMessages.length)]

    // Track last 8 messages to avoid repetition (increased from 4)
    lastMessages.push(selected)
    if (lastMessages.length > 8) {
        lastMessages.shift()
    }

    return selected
}

function getNoMessage(attemptNum) {
    const oneBased = Math.max(1, attemptNum)
    let msg
    let isSequential = false

    if (oneBased <= noMessages.length - 1) {
        // Show sequential messages up to second-to-last
        msg = noMessages[oneBased - 1]
        isSequential = true
    } else if (oneBased === noMessages.length) {
        // At the last index: only show "buddy" warning if runaway not yet enabled
        if (!runawayEnabled) {
            msg = noMessages[noMessages.length - 1]
            isSequential = true
        } else {
            // If runaway already enabled, show random message with variety (100%)
            msg = getRandomMessageWithVariety(noMessagesRandom)
        }
    } else {
        // After all sequential messages, ALWAYS show random with variety (100%)
        msg = getRandomMessageWithVariety(noMessagesRandom)
    }

    // After attempt 7, mix in random messages with HIGH frequency
    if (oneBased >= 7 && oneBased < noMessages.length && Math.random() < 0.7) {
        msg = getRandomMessageWithVariety(noMessagesRandom)
        isSequential = false
    }

    // Track sequential messages too to prevent repetition if user clicks rapidly
    if (isSequential) {
        const msgTemplate = msg  // Store before replacement
        if (!lastMessages.includes(msgTemplate)) {
            lastMessages.push(msgTemplate)
            if (lastMessages.length > 8) {
                lastMessages.shift()
            }
        }
    }

    return msg.replace(/\{sequence_number\}/g, String(oneBased))
}

function getRandomNoMessage() {
    const pool = [...noMessages, ...noMessagesRandom]
    const msg = pool[Math.floor(Math.random() * pool.length)]
    return msg.replace(/\{sequence_number\}/g, String(noAttemptCount))
}

function getChaseMessage() {
    return getRandomMessageWithVariety(noMessagesChase)
}

const yesTeasePokes = [
    "whoa there cowboy, try No first 🤠",
    "No button is literally doing a sad dance over there 💃😢",
    "hold your horses! No has a whole performance ready 🎭",
    "No button practiced in the mirror for this moment 🪞",
    "but... No button bought a new outfit just for you 👗",
    "No button is watching you with judgy eyes right now 👀",
    "the No button has prepared a PowerPoint presentation 📊",
    "No button: \"excuse me, I'm standing right here\" 😤",
    "No button literally has confetti ready to throw 🎊",
    "you're really gonna do No button like that? ice cold 🥶",
    "No button hired a marching band for this 🎺",
    "No button's mom is gonna hear about this 👵",
    "wait, No button has snacks prepared! 🍿",
    "No button wrote a whole speech and everything 📝",
    "the disrespect! No button is calling its lawyer 👨‍⚖️",
    "No button is about to write a diss track 🎤",
    "you're breaking No button's little heart 💔",
    "No button is texting its group chat about you rn 📱",
    "No button: \"I didn't get dressed up for this\" 💅",
    "No button is questioning its life choices 🤔",
    "ouch! No button felt that from here 😬",
    "No button just called you out in its Instagram story 📸",
    "No button is over there stress eating chips 🫠",
    "the audacity! No button is SHOOK 😱",
    "No button is writing this down in its burn book 📖",
    "No button: \"am I a joke to you?\" 🤡",
    "No button is about to start an enemies arc 😈",
    "you just activated No button's villain era 🦹",
    "No button will remember this betrayal FOREVER 🗡️",
    "No button is sending you straight to voicemail next time ☎️",
    "No button's therapist is gonna have a field day with this 🛋️",
    "wow, No button was NOT ready for this kind of rejection 😭",
    "No button is dramatically looking out a window in the rain now 🌧️",
    "No button went through 5 stages of grief just now ⚰️",
    "No button is adding you to the list 📋",
    "harsh! No button is filing an emotional damage claim 💸",
    "No button is having its main character moment over there 🎬",
    "you just gave No button trust issues 🥺",
    "No button's confidence just took a critical hit 💥",
    "No button is gonna need 3-5 business days to recover 📅",
    "No button: \"it's fine. I'm fine. everything's fine.\" 🙃",
    "No button is writing a sad poem about this 📜",
    "you really woke up and chose violence against No button 🗡️",
    "No button is summoning its ancestors for guidance 👻",
    "No button's FBI agent is disappointed in you 🕵️",
    "that's it. No button is becoming a villain 🦹‍♀️",
    "No button is stress baking 47 cookies right now 🍪",
    "you're on No button's no-fly list permanently ✈️",
    "No button is petitioning for your cancellation 📝",
    "the betrayal! No button's ancestors felt that 👵",
    "No button is writing an angry email to corporate 📧",
    "No button just unfollowed you on all platforms 🚫",
    "you made No button's top 10 anime betrayals list 📺",
    "No button is consulting with its legal team 👔",
    "No button's emotional support animal is concerned 🐕",
    "you really fumbled the bag with No button 💰",
    "No button is rage cleaning its room right now 🧹",
    "No button: \"I could've been at the gym right now\" 💪",
    "No button is currently spiraling in the group chat 💬",
    "you just made No button's Roman Empire 🏛️",
    "No button is pulling out its receipts 🧾",
    "No button had a whole montage prepared 🎥",
    "you're gonna see No button's subtweet later 🐦",
    "No button is on its villain arc redemption tour now 🎭",
    "No button: \"this is my 13th reason\" 📼",
    "you really said 'no thanks' to No button's TED talk 🎤",
    "No button just blocked you in 4 different dimensions 🌌",
    "No button's horoscope warned about people like you ♈",
    "the straights are NOT okay and No button has proof 📊",
    "No button is emotionally unavailable now thanks to you 🚪",
    "you're in No button's 'people who wronged me' list 📓",
    "No button is writing fanfiction about your downfall ✍️",
    "No button just added you to its origin story 🦸",
    "you gave No button commitment issues 💔",
    "No button is manifesting your karma 🔮",
    "that's gonna be an awkward conversation later 😬",
    "No button's manifestation journal has your name in it 📔",
    "you really thought you did something there huh 😏",
    "No button is lighting a revenge candle as we speak 🕯️",
    "the way No button is side-eyeing you rn... ICONIC 👁️👄👁️",
    "No button's energy is SHIFTED and it's your fault ✨",
    "you're not invited to No button's birthday party 🎂",
    "No button is doing breathing exercises to calm down 🧘",
    "you just became No button's core memory (derogatory) 🧠",
    "No button is unfollowing, blocking, and reporting 🚨",
    "the disrespect! No button is contacting HR 📋",
    "you're dead to No button now 💀",
    "No button just hit you with the ultimate side-eye 😑",
    "No button's guardian angel quit 👼",
    "you're gonna see No button's passive aggressive story later 📱",
    "No button is scheduling a therapy session for this 📞",
    "the way you just played No button... diabolical 😈",
    "No button's breaking point just broke 💥"
]

let yesTeasedCount = 0

let noClickCount = 0
let noAttemptCount = 0   // clicks + hover on runaway (total tries)
let runawayEnabled = false
let runawayListenersActive = false
let musicPlaying = true
let noButtonGone = false
let pendingStickFigure = false
let chaseActive = false
let takerPosition = null  // Track buddy position during chase
let lastMessages = []  // Track last few messages to avoid repetition
let justClicked = false  // Prevent immediate runaway after click
let justMoved = false    // Prevent immediate runaway after button moves
let lastRunAwayTime = 0  // Track last time runAway was called to prevent rapid consecutive triggers
let lastCursorX = 0      // Track cursor position to detect intentional movement
let lastCursorY = 0
let cursorMoved = true   // Track if cursor has moved since last interaction
let runawayCount = 0     // Track how many times button has run away during chase

const STICK_FIGURE_WARNING = "⚠️ Last chance! The little buddy is coming... 😊🎁💕"

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Music already started by music.js from page load; sync state and icon
if (music) {
  if (window.__musicStarted) {
    musicPlaying = window.musicPlaying !== false
    const t = document.getElementById('music-toggle')
    if (t) t.textContent = musicPlaying ? '🔊' : '🔇'
  }
  musicPlaying = window.musicPlaying !== false
}

function toggleMusic() {
    const toggle = document.getElementById('music-toggle')
    if (!music || !toggle) return
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        window.musicPlaying = false
        toggle.textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        window.musicPlaying = true
        toggle.textContent = '🔊'
    }
}

function animatePoemLines() {
    const poemLines = document.querySelectorAll('.poem-line-item')
    let delay = 0
    const delayPerLine = 1200  // 1.2 seconds between each line

    poemLines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible')
        }, delay)
        delay += delayPerLine
    })
}

function handleYesClick() {
    console.log('Yes button clicked!')

    // If user hasn't clicked No yet, tease them to try No first
    if (noClickCount === 0) {
        const teaseMsg = yesTeasePokes[yesTeasedCount % yesTeasePokes.length]
        showTeaseMessage(teaseMsg)
        yesTeasedCount++

        // Wiggle the No button to draw attention
        noBtn.style.animation = 'wiggleNo 0.5s ease'
        setTimeout(() => {
            noBtn.style.animation = ''
        }, 500)

        return // Don't proceed with Yes action
    }

    // User has clicked No at least once, proceed with Yes
    // Hide vday-app and show yes-app
    const vdayApp = document.getElementById('vday-app')
    const yesApp = document.getElementById('yes-app')

    if (vdayApp) {
        vdayApp.style.display = 'none'
        vdayApp.style.visibility = 'hidden'
    }

    if (yesApp) {
        yesApp.style.display = 'flex'
        yesApp.style.visibility = 'visible'
        yesApp.style.opacity = '1'

        console.log('Yes app shown')

        // Ensure title and message are visible
        const yesTitle = yesApp.querySelector('.yes-title')
        const yesMessage = yesApp.querySelector('.yes-message')
        const yesGif = document.getElementById('yes-gif')

        if (yesTitle) {
            yesTitle.style.opacity = '1'
            yesTitle.style.visibility = 'visible'
            console.log('Title visible')
        }
        if (yesMessage) {
            yesMessage.style.opacity = '1'
            yesMessage.style.visibility = 'visible'
            console.log('Message visible')
        }
        if (yesGif) {
            yesGif.style.opacity = '1'
            yesGif.style.visibility = 'visible'
            console.log('GIF visible')
        }

        // Start poem line-by-line animation
        animatePoemLines()
    }

    // Load custom GIF if available
    if (window.__valentineConfigId) {
        try {
            const raw = localStorage.getItem('valentine_config_' + window.__valentineConfigId)
            if (raw) {
                const config = JSON.parse(raw)
                const yesGif = document.getElementById('yes-gif')
                if (yesGif && config.gifYesDataUrl) {
                    yesGif.setAttribute('src', config.gifYesDataUrl)
                    console.log('Custom GIF loaded')
                }
            }
        } catch (e) {
            console.error('Failed to load custom yes gif:', e)
        }
    }

    // Launch confetti animation
    if (typeof window.launchYesConfetti === 'function') {
        window.launchYesConfetti()
        console.log('Confetti launched')
    } else {
        console.warn('Confetti function not found')
    }
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function updateNoButtonText() {
    // During chase, use chase messages; otherwise use regular messages
    if (chaseActive) {
        noBtn.textContent = getChaseMessage()
    } else {
        noBtn.textContent = getNoMessage(noAttemptCount)
    }
}

function handleNoClick() {
    if (noButtonGone) return

    // Set flag to prevent immediate runaway after click
    justClicked = true
    setTimeout(() => { justClicked = false }, 600)

    noClickCount++
    noAttemptCount++
    updateNoButtonText()

    // Grow Yes button on each No, but cap so it stays usable and doesn't overflow
    const baseSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16
    const maxYesFont = Math.min(baseSize * 1.75, 28)
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize) || baseSize * 1.1
    yesBtn.style.fontSize = `${Math.min(currentSize * 1.2, maxYesFont)}px`
    const padY = Math.min(14 + noClickCount * 4, 48)
    const padX = Math.min(28 + noClickCount * 8, 100)
    yesBtn.style.padding = `${padY}px ${padX}px`

    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 11)}px`
    }

    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    if (noAttemptCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }

    // Show warning on 19th attempt
    if (noAttemptCount === MAX_NO_ATTEMPTS - 1 && !pendingStickFigure) {
        showStickFigureWarning()
        pendingStickFigure = true
    }

    // Activate buddy chase on 20th attempt
    if (noAttemptCount === MAX_NO_ATTEMPTS && !chaseActive) {
        triggerStickFigureTakeaway()
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function trackCursorMovement(e) {
    // Track cursor position and detect movement
    const deltaX = Math.abs(e.clientX - lastCursorX)
    const deltaY = Math.abs(e.clientY - lastCursorY)

    // During chase, be more sensitive to movement (2 pixels vs 5 pixels)
    const threshold = chaseActive ? 2 : 5

    // Consider cursor "moved" if it moved more than threshold
    if (deltaX > threshold || deltaY > threshold) {
        cursorMoved = true
        lastCursorX = e.clientX
        lastCursorY = e.clientY
    }
}

function handleMouseEnterRunaway(e) {
    // During chase, be more lenient - allow movement even with minimal cursor movement
    // Outside chase, require cursor movement to prevent auto-triggers
    if (!chaseActive && !cursorMoved) return

    runAway()

    // Reset cursor moved flag after triggering
    cursorMoved = false
}

function enableRunaway() {
    if (!noBtn) return
    // Smooth glide when the No button runs away from hover/touch
    // Will be updated to faster animation during chase
    noBtn.style.transition = 'left 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'

    // Track cursor movement globally to detect intentional hover
    document.addEventListener('mousemove', trackCursorMovement)

    // Add a delay before activating listeners to prevent immediate trigger
    // This prevents the button from moving while user's finger/cursor is still over it from the click
    setTimeout(() => {
        if (noButtonGone) return
        runawayListenersActive = true
        // Use custom handler that checks for intentional cursor movement
        noBtn.addEventListener('mouseenter', handleMouseEnterRunaway)
        // For mobile: use a wrapper to ensure touch is intentional
        noBtn.addEventListener('touchstart', handleTouchRunaway, { passive: false })
    }, 500)  // Increased delay to 500ms to ensure user has lifted finger
}

function handleTouchRunaway(e) {
    // Only run away if the button is actually being touched (not a scroll or accidental touch)
    // and the touch started on the button itself
    if (!runawayListenersActive || noButtonGone || justClicked || justMoved) return

    // Get the touch point
    const touch = e.touches[0]
    if (!touch) return

    const rect = noBtn.getBoundingClientRect()

    // Verify the touch is actually within the button bounds
    // Add small tolerance for fat finger touches on mobile
    const tolerance = 5
    const touchX = touch.clientX
    const touchY = touch.clientY

    if (touchX >= rect.left - tolerance && touchX <= rect.right + tolerance &&
        touchY >= rect.top - tolerance && touchY <= rect.bottom + tolerance) {
        // Prevent default to avoid any scroll behavior
        e.preventDefault()
        runAway()
    }
}

function disableRunaway() {
    if (!noBtn || !runawayListenersActive) return
    runawayListenersActive = false
    noBtn.style.transition = 'none'
    noBtn.removeEventListener('mouseenter', handleMouseEnterRunaway)
    noBtn.removeEventListener('touchstart', handleTouchRunaway)
    document.removeEventListener('mousemove', trackCursorMovement)
}

function runAway() {
    if (noButtonGone || !runawayListenersActive || justClicked || justMoved) return

    // Prevent rapid consecutive triggers - require minimum time between runAway calls
    // During chase, reduce interval to allow more responsive movement
    const now = Date.now()
    const minInterval = chaseActive ? 400 : 300  // Reduced from 600ms to 400ms during chase
    if (now - lastRunAwayTime < minInterval) return
    lastRunAwayTime = now

    noAttemptCount++

    // Track runaway count during chase for buddy avoidance logic
    if (chaseActive) {
        runawayCount++
    }

    // Show warning on 19th attempt (hover/touch)
    if (noAttemptCount === MAX_NO_ATTEMPTS - 1 && !pendingStickFigure) {
        showStickFigureWarning()
        pendingStickFigure = true
        return  // Don't move button, just show warning
    }

    // Activate buddy chase on 20th attempt (hover/touch)
    if (noAttemptCount === MAX_NO_ATTEMPTS && !chaseActive) {
        triggerStickFigureTakeaway()
        return  // Buddy will start chasing, don't move button manually
    }

    // Update text on hover/touch - change message when button runs away
    updateNoButtonText()

    // During chase, make button movement FASTER for more dynamic gameplay
    if (chaseActive && noBtn) {
        noBtn.style.transition = 'left 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }

    // Set flag to prevent immediate retrigger if button lands under cursor/finger
    // During chase, use SHORTER cooldown to allow quicker re-engagement
    justMoved = true
    const cooldown = chaseActive ? 600 : 800  // Reduced from 1500ms to 600ms during chase
    setTimeout(() => { justMoved = false }, cooldown)

    // Get safe area insets for notched devices
    const safeTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') || '0')
    const safeBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)') || '0')
    const safeLeft = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-left)') || '0')
    const safeRight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-right)') || '0')

    // Responsive margins and buddy radius based on viewport size
    const isMobile = window.innerWidth < 768
    const margin = isMobile ? 30 : 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin - safeRight
    const maxY = window.innerHeight - btnH - margin - safeBottom
    const minX = margin + safeLeft
    const minY = margin + safeTop

    // Get current button position to ensure it moves far away
    const currentRect = noBtn.getBoundingClientRect()
    const currentX = currentRect.left
    const currentY = currentRect.top
    // Require significant movement distance - button should jump far!
    const MIN_MOVE_DISTANCE = chaseActive
      ? (isMobile ? 250 : 400)  // Very far during chase
      : (isMobile ? 200 : 350)  // Far during normal runaway

    const yesRect = yesBtn.getBoundingClientRect()
    // ALWAYS avoid Yes button with significant padding - this is MANDATORY
    const yesPad = isMobile ? 20 : 30
    const avoidLeft = yesRect.left - yesPad
    const avoidRight = yesRect.right + yesPad
    const avoidTop = yesRect.top - yesPad
    const avoidBottom = yesRect.bottom + yesPad

    // If chase is active, get buddy position to avoid
    // Initial chase: large avoidance radius (careful movement)
    // After 10+ runaway attempts: much smaller radius (riskier, can get close by chance)
    let buddyLeft = -1000, buddyRight = -1000, buddyTop = -1000, buddyBottom = -1000
    let BUDDY_AVOID_RADIUS

    if (chaseActive && takerPosition) {
        // Start with large avoidance, reduce after significant attempts
        if (runawayCount < 10) {
            // Initial chase: stay far from buddy
            BUDDY_AVOID_RADIUS = isMobile ? 150 : 250
        } else if (runawayCount < 20) {
            // Mid-game: moderate avoidance
            BUDDY_AVOID_RADIUS = isMobile ? 100 : 150
        } else {
            // Late game: minimal avoidance, can get close by chance
            BUDDY_AVOID_RADIUS = isMobile ? 60 : 80
        }

        buddyLeft = takerPosition.x - BUDDY_AVOID_RADIUS
        buddyRight = takerPosition.x + 50 + BUDDY_AVOID_RADIUS
        buddyTop = takerPosition.y - BUDDY_AVOID_RADIUS
        buddyBottom = takerPosition.y + 100 + BUDDY_AVOID_RADIUS
    }

    let randomX = minX
    let randomY = maxY
    let found = false
    let bestDistance = 0
    let bestX = minX
    let bestY = maxY

    // Try many times and pick the FARTHEST valid position (not just first valid)
    for (let tries = 0; tries < 60; tries++) {
        let x, y

        // 50% chance to prefer edge/corner positions for more dramatic movement
        if (Math.random() < 0.5) {
            // Pick a random edge or corner
            const edge = Math.floor(Math.random() * 4)
            if (edge === 0) {
                // Top edge
                x = minX + Math.random() * (maxX - minX)
                y = minY + Math.random() * 100
            } else if (edge === 1) {
                // Right edge
                x = maxX - Math.random() * 100
                y = minY + Math.random() * (maxY - minY)
            } else if (edge === 2) {
                // Bottom edge
                x = minX + Math.random() * (maxX - minX)
                y = maxY - Math.random() * 100
            } else {
                // Left edge
                x = minX + Math.random() * 100
                y = minY + Math.random() * (maxY - minY)
            }
        } else {
            // Random position anywhere
            x = minX + Math.random() * (maxX - minX)
            y = minY + Math.random() * (maxY - minY)
        }
        const noRight = x + btnW
        const noBottom = y + btnH

        // Calculate distance from current position
        const distanceFromCurrent = Math.sqrt(
            Math.pow(x - currentX, 2) + Math.pow(y - currentY, 2)
        )

        // CRITICAL: Check if overlaps with Yes button (NEVER allow overlap - MANDATORY)
        const overlapsYes = (x < avoidRight && noRight > avoidLeft) &&
                           (y < avoidBottom && noBottom > avoidTop)

        // Check if too close to buddy (avoidance reduces over time, can get close by chance later)
        const nearBuddy = chaseActive && takerPosition &&
                         (x < buddyRight && noRight > buddyLeft) &&
                         (y < buddyBottom && noBottom > buddyTop)

        // Ensure button moves far enough away from current position
        const farEnough = distanceFromCurrent >= MIN_MOVE_DISTANCE

        // MUST satisfy ALL conditions: never overlap Yes, respect buddy radius, move far enough
        if (!overlapsYes && !nearBuddy && farEnough) {
            if (distanceFromCurrent > bestDistance) {
                bestDistance = distanceFromCurrent
                bestX = x
                bestY = y
                found = true
            }
        }
    }

    // Use the farthest position found
    if (found) {
        randomX = bestX
        randomY = bestY
    }

    if (!found) {
        // Fallback: move to opposite corner/edge of screen for maximum distance
        if (chaseActive && takerPosition) {
            // Move to corner opposite from buddy
            const buddyCenterX = takerPosition.x + 25
            const buddyCenterY = takerPosition.y + 50
            randomX = buddyCenterX > window.innerWidth / 2 ? minX : Math.max(minX, maxX - margin)
            randomY = buddyCenterY > window.innerHeight / 2 ? minY : Math.max(minY, maxY - margin)
        } else {
            // Move to corner opposite from current position
            const currentCenterX = currentX + btnW / 2
            const currentCenterY = currentY + btnH / 2
            const screenCenterX = window.innerWidth / 2
            const screenCenterY = window.innerHeight / 2

            // Pick opposite quadrant with randomization
            const randomOffset = 50 + Math.random() * 100  // Random offset 50-150px from corner

            if (currentCenterX < screenCenterX && currentCenterY < screenCenterY) {
                // Currently top-left, move to bottom-right area
                randomX = Math.max(minX, maxX - randomOffset)
                randomY = Math.max(minY, maxY - randomOffset)
            } else if (currentCenterX >= screenCenterX && currentCenterY < screenCenterY) {
                // Currently top-right, move to bottom-left area
                randomX = Math.min(maxX, minX + randomOffset)
                randomY = Math.max(minY, maxY - randomOffset)
            } else if (currentCenterX < screenCenterX && currentCenterY >= screenCenterY) {
                // Currently bottom-left, move to top-right area
                randomX = Math.max(minX, maxX - randomOffset)
                randomY = Math.min(maxY, minY + randomOffset)
            } else {
                // Currently bottom-right, move to top-left area
                randomX = Math.min(maxX, minX + randomOffset)
                randomY = Math.min(maxY, minY + randomOffset)
            }
        }

        // CRITICAL: Final check - ensure fallback position doesn't overlap Yes button
        const finalNoRight = randomX + btnW
        const finalNoBottom = randomY + btnH
        const finalOverlapsYes = (randomX < avoidRight && finalNoRight > avoidLeft) &&
                                 (randomY < avoidBottom && finalNoBottom > avoidTop)

        // If fallback overlaps Yes, shift it away from Yes button
        if (finalOverlapsYes) {
            // Determine which direction to shift based on Yes button position
            const yesCenterX = (avoidLeft + avoidRight) / 2
            const yesCenterY = (avoidTop + avoidBottom) / 2

            // Shift to farthest edge from Yes button
            if (randomX < yesCenterX) {
                // Button is left of Yes, move further left
                randomX = Math.max(minX, avoidLeft - btnW - 20)
            } else {
                // Button is right of Yes, move further right
                randomX = Math.min(maxX, avoidRight + 20)
            }
        }
    }

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${Math.max(minX, Math.min(randomX, maxX))}px`
    noBtn.style.top = `${Math.max(minY, Math.min(randomY, maxY))}px`
    noBtn.style.zIndex = '40'

    // Reset cursor moved flag - if button lands under cursor, don't trigger again
    cursorMoved = false
}

function showStickFigureWarning() {
    if (!noBtn) return
    noBtn.dataset.originalText = noBtn.textContent
    noBtn.textContent = STICK_FIGURE_WARNING
    noBtn.classList.add('no-btn-last-chance')
}

function scheduleStickFigureTakeaway() {
    if (pendingStickFigure || noButtonGone) return
    pendingStickFigure = true
    showStickFigureWarning()
    setTimeout(triggerStickFigureTakeaway, 3200)
}

function triggerStickFigureTakeaway() {
    if (chaseActive || noButtonGone) return  // Prevent multiple activations

    noBtn.classList.remove('no-btn-last-chance')

    // Reset all interaction flags to prevent auto-message changes at start of chase
    cursorMoved = true  // Set to true so button can respond after initial cooldown
    justMoved = true
    justClicked = false
    runawayCount = 0  // Reset runaway counter for chase phase
    lastRunAwayTime = Date.now() // Prevent immediate runAway via time throttling
    // Shorter cooldown during chase start to make button responsive quickly
    setTimeout(() => {
        justMoved = false
        cursorMoved = true  // Ensure button is immediately responsive
    }, 500)  // Reduced from 1000ms to 500ms

    // Set initial chase message (only this one change should happen)
    noBtn.textContent = getChaseMessage()

    // Mark chase as active immediately
    chaseActive = true
    const rect = noBtn.getBoundingClientRect()
    noBtn.style.position = 'fixed'
    noBtn.style.left = rect.left + 'px'
    noBtn.style.top = rect.top + 'px'
    noBtn.style.zIndex = '40'
    noBtn.style.transition = 'none'

    const TAKER_W = 50
    const TAKER_H = 100
    const CATCH_RADIUS = 55
    const LOCK_RADIUS = 90
    const CHASE_SPEED = 0.0028
    const CHASE_SPEED_FAST = 0.01
    const GRAB_DURATION = 600
    const TAKEAWAY_DURATION = 4200
    const START_LEFT = -TAKER_W - 20

    // Peep from door game: single image, CSS handles bounce (walk/grab/run)
    const taker = document.createElement('div')
    taker.className = 'no-taken-taker no-taken-taker-peep no-taken-taker-chase'
    const peepImg = document.createElement('img')
    peepImg.src = 'img/peep.png'
    peepImg.alt = 'Peep'
    peepImg.className = 'no-taken-taker-peep-img'
    taker.appendChild(peepImg)

    // Add angry emoji on buddy face that moves with it
    const buddyEmoji = document.createElement('div')
    buddyEmoji.className = 'buddy-emoji'
    buddyEmoji.textContent = '😠'
    buddyEmoji.style.cssText = 'position: absolute; top: 20px; left: 50%; transform: translateX(-50%); font-size: 24px; z-index: 10; pointer-events: none;'
    taker.appendChild(buddyEmoji)

    taker.style.left = START_LEFT + 'px'
    taker.style.top = (rect.top + rect.height / 2 - TAKER_H / 2) + 'px'
    taker.style.transform = 'none'
    document.getElementById('vday-app').appendChild(taker)

    let takerX = START_LEFT
    let takerY = rect.top + rect.height / 2 - TAKER_H / 2
    takerPosition = { x: takerX, y: takerY }

    // Don't auto-change messages - only change on hover/touch interaction
    // Messages will update when runAway() is called (user tries to touch/hover)

    function getButtonCenter() {
        const r = noBtn.getBoundingClientRect()
        return { x: r.left + r.width / 2 - TAKER_W / 2, y: r.top + r.height / 2 - TAKER_H / 2 }
    }

    function chase(now) {
        if (noButtonGone) return
        const target = getButtonCenter()
        const dx = target.x - takerX
        const dy = target.y - takerY

        // Update buddy position for runAway to use
        takerPosition = { x: takerX, y: takerY }
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < CATCH_RADIUS) {
            noButtonGone = true
            disableRunaway()
            taker.classList.remove('no-taken-taker-chase')
            taker.classList.add('no-taken-taker-grab')

            // Change emoji to devil when caught
            const buddyEmoji = taker.querySelector('.buddy-emoji')
            if (buddyEmoji) buddyEmoji.textContent = '😈'

            // Show message immediately when caught
            const container = document.querySelector('#vday-app .vday-container')
            const msg = document.createElement('p')
            msg.className = 'no-taken-msg'
            msg.innerHTML = "You really thought<br>the 'No' button mattered? 😏"
            container.appendChild(msg)

            setTimeout(() => {
                taker.classList.remove('no-taken-taker-grab')
                startTakeawayToNearestEdge()
            }, GRAB_DURATION)
            return
        }

        // Keep button interactive even when buddy is close - don't disable runaway
        // Only disable when actually caught (CATCH_RADIUS check above)
        // Buddy speeds up when close, but user can still make button run away
        const speed = dist < LOCK_RADIUS ? CHASE_SPEED_FAST : CHASE_SPEED
        takerX += dx * speed
        takerY += dy * speed
        taker.style.left = Math.round(takerX) + 'px'
        taker.style.top = Math.round(takerY) + 'px'

        requestAnimationFrame(chase)
    }

    function startTakeawayToNearestEdge() {
        const r = noBtn.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const W = window.innerWidth
        const H = window.innerHeight
        const pad = 120
        const distLeft = cx
        const distRight = W - cx
        const distTop = cy
        const distBottom = H - cy
        const min = Math.min(distLeft, distRight, distTop, distBottom)
        let endX, endY
        if (min === distLeft) {
            endX = -pad - TAKER_W
            endY = cy - TAKER_H / 2
        } else if (min === distRight) {
            endX = W + pad
            endY = cy - TAKER_H / 2
        } else if (min === distTop) {
            endX = cx - TAKER_W / 2
            endY = -pad - TAKER_H
        } else {
            endX = cx - TAKER_W / 2
            endY = H + pad
        }

        const startX = parseFloat(taker.style.left) || takerX
        const startY = parseFloat(taker.style.top) || takerY
        const btnStartX = r.left
        const btnStartY = r.top
        const btnEndX = endX + (TAKER_W / 2) - (noBtn.offsetWidth / 2)
        const btnEndY = endY + (TAKER_H / 2) - (noBtn.offsetHeight / 2)

        taker.classList.remove('no-taken-taker-chase')
        taker.classList.add('no-taken-taker-run')
        const takeawayStart = performance.now()

        function animateTakeaway(now) {
            const elapsed = now - takeawayStart
            const progress = Math.min(1, elapsed / TAKEAWAY_DURATION)
            const smooth = 1 - Math.pow(1 - progress, 1.4)
            const x = startX + (endX - startX) * smooth
            const y = startY + (endY - startY) * smooth
            const bx = btnStartX + (btnEndX - btnStartX) * smooth
            const by = btnStartY + (btnEndY - btnStartY) * smooth
            taker.style.left = Math.round(x) + 'px'
            taker.style.top = Math.round(y) + 'px'
            noBtn.style.left = Math.round(bx) + 'px'
            noBtn.style.top = Math.round(by) + 'px'

            if (progress >= 1) {
                noBtn.style.display = 'none'
                taker.remove()
                return
            }
            requestAnimationFrame(animateTakeaway)
        }
        requestAnimationFrame(animateTakeaway)
    }

    requestAnimationFrame(chase)
}
