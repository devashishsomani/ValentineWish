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

// Messages: some use {sequence_number} for current attempt count. Some fixed, some for specific ranges.
const noMessages = [
    "No",
    "Are you sure? 🤔",
    "Really? 😢",
    "Pookie please... 🥺",
    "If you say no,\nI'll be really sad...",
    "Please??? 💔",
    "After {sequence_number} no's,\nI'm still here.\nThat's commitment. 💪",
    "You tried {sequence_number} times…\nI admire the dedication. 👏",
    "I promise unlimited hugs\nif you press 'Yes' 🤗",
    "AI prediction:\n99.99% chance you meant\nto press 'Yes'. 🤖",
    "Achievement Unlocked:\nDenial Queen 👑",
    "Scientists say pressing 'Yes'\nincreases happiness\nby 200%. 📈",
    "Boss Level Reached.\nOnly 'Yes' can defeat me. 🎮",
    "Denial is a river…\nbut we're not in Egypt. 🌊",
    "Be honest…\nyour finger is tired.\nJust press Yes. 😅",
    "You're clicking 'No'\nbut smiling, aren't you? 😏",
    "I can do this all day.\nCan you? 💪",
    "At this point,\nit's destiny. ✨",
    "The universe is begging\nyou to press Yes. 🌌",
    "One more 'No' and\nI'm sending the little buddy. 😊"
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
    "Warning: Continued use of\nNo button may result\nin cuteness overload. 🥰"
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
    "The buddy never\ngives up! 🦸"
]

function getRandomMessageWithVariety(pool) {
    // Pick a random message that's not in the last 4 messages shown (increased gap)
    const availableMessages = pool.filter(m => !lastMessages.includes(m))

    // If we've shown too many messages and filtered them all, reset history
    if (availableMessages.length === 0) {
        lastMessages = []
        return pool[Math.floor(Math.random() * pool.length)]
    }

    const selected = availableMessages[Math.floor(Math.random() * availableMessages.length)]

    // Track last 4 messages to avoid repetition (increased from 3)
    lastMessages.push(selected)
    if (lastMessages.length > 4) {
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
            if (lastMessages.length > 4) {
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
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
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

    // Only trigger buddy chase once when reaching MAX_NO_ATTEMPTS
    // Don't return - allow continued interaction during chase
    if (noAttemptCount >= MAX_NO_ATTEMPTS && !chaseActive && !pendingStickFigure) {
        scheduleStickFigureTakeaway()
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

    // Consider cursor "moved" if it moved more than 5 pixels
    if (deltaX > 5 || deltaY > 5) {
        cursorMoved = true
        lastCursorX = e.clientX
        lastCursorY = e.clientY
    }
}

function handleMouseEnterRunaway(e) {
    // Only trigger runAway if cursor actually moved to the button
    // If cursorMoved is false, it means button moved under stationary cursor
    if (!cursorMoved) return

    runAway()

    // Reset cursor moved flag after triggering
    cursorMoved = false
}

function enableRunaway() {
    if (!noBtn) return
    // Slower, smoother glide when the No button runs away from hover/touch
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

    // Prevent rapid consecutive triggers - require at least 300ms between runAway calls
    // During chase, require even more time (600ms) to prevent message spam
    const now = Date.now()
    const minInterval = chaseActive ? 600 : 300
    if (now - lastRunAwayTime < minInterval) return
    lastRunAwayTime = now

    noAttemptCount++
    // Update text on hover/touch - change message when button runs away
    updateNoButtonText()

    // Only trigger buddy chase once when reaching MAX_NO_ATTEMPTS
    // After that, keep the chase running - don't call scheduleStickFigureTakeaway again
    if (noAttemptCount >= MAX_NO_ATTEMPTS && !chaseActive && !pendingStickFigure) {
        scheduleStickFigureTakeaway()
    }

    // Set flag to prevent immediate retrigger if button lands under cursor/finger
    // During chase, use longer cooldown to prevent rapid re-triggering
    justMoved = true
    const cooldown = chaseActive ? 1500 : 800
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
    // Require significant movement distance, especially during chase
    const MIN_MOVE_DISTANCE = chaseActive
      ? (isMobile ? 200 : 300)  // Move even farther during chase
      : (isMobile ? 150 : 200)

    const yesRect = yesBtn.getBoundingClientRect()
    const pad = isMobile ? 15 : 20
    const avoidLeft = yesRect.left - pad
    const avoidRight = yesRect.right + pad
    const avoidTop = yesRect.top - pad
    const avoidBottom = yesRect.bottom + pad

    // If chase is active, get buddy position to avoid
    // Use smaller radius on mobile so button doesn't get trapped
    let buddyLeft = -1000, buddyRight = -1000, buddyTop = -1000, buddyBottom = -1000
    const BUDDY_AVOID_RADIUS = isMobile ? 120 : 200

    if (chaseActive && takerPosition) {
        buddyLeft = takerPosition.x - BUDDY_AVOID_RADIUS
        buddyRight = takerPosition.x + 50 + BUDDY_AVOID_RADIUS
        buddyTop = takerPosition.y - BUDDY_AVOID_RADIUS
        buddyBottom = takerPosition.y + 100 + BUDDY_AVOID_RADIUS
    }

    let randomX = minX
    let randomY = maxY
    let found = false

    // Try many times to find a good position that's far enough
    for (let tries = 0; tries < 50; tries++) {
        const x = minX + Math.random() * (maxX - minX)
        const y = minY + Math.random() * (maxY - minY)
        const noRight = x + btnW
        const noBottom = y + btnH

        // Calculate distance from current position
        const distanceFromCurrent = Math.sqrt(
            Math.pow(x - currentX, 2) + Math.pow(y - currentY, 2)
        )

        // Check if overlaps with Yes button
        const overlapsYes = (x < avoidRight && noRight > avoidLeft) &&
                           (y < avoidBottom && noBottom > avoidTop)

        // Check if too close to buddy
        const nearBuddy = chaseActive && takerPosition &&
                         (x < buddyRight && noRight > buddyLeft) &&
                         (y < buddyBottom && noBottom > buddyTop)

        // Ensure button moves far enough away from current position
        const farEnough = distanceFromCurrent >= MIN_MOVE_DISTANCE

        if (!overlapsYes && !nearBuddy && farEnough) {
            randomX = x
            randomY = y
            found = true
            break
        }
    }

    if (!found) {
        // Fallback: move to opposite side of screen from buddy
        if (chaseActive && takerPosition) {
            const buddyCenterX = takerPosition.x + 25
            const buddyCenterY = takerPosition.y + 50
            randomX = buddyCenterX > window.innerWidth / 2 ? minX : Math.max(minX, maxX - margin)
            randomY = buddyCenterY > window.innerHeight / 2 ? minY : Math.max(minY, maxY - margin)
        } else {
            randomX = minX + Math.random() * (maxX - minX)
            randomY = minY + Math.random() * (maxY - minY)
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
    noBtn.classList.remove('no-btn-last-chance')

    // Reset all interaction flags to prevent auto-message changes at start of chase
    cursorMoved = false
    justMoved = true
    justClicked = false
    lastRunAwayTime = Date.now() // Prevent immediate runAway via time throttling
    // Set cooldown to prevent immediate runAway calls when buddy starts
    setTimeout(() => { justMoved = false }, 1000)

    // Set initial chase message (only this one change should happen)
    noBtn.textContent = getChaseMessage()
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
    chaseActive = true
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
