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
    "After {sequence_number} no's,\nI'm still here.\nThat's commitment. 💪",
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
    "Denial: level expert.\nBut Yes wins. 🏆"
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
    "Too slow! ⚡"
]

function getNoMessage(attemptNum) {
    const oneBased = Math.max(1, attemptNum)
    let msg

    if (oneBased <= noMessages.length - 1) {
        // Show sequential messages up to second-to-last
        msg = noMessages[oneBased - 1]
    } else if (oneBased === noMessages.length) {
        // At the last index: only show "buddy" warning if runaway not yet enabled
        if (!runawayEnabled) {
            msg = noMessages[noMessages.length - 1]
        } else {
            // If runaway already enabled, show random message instead
            msg = noMessagesRandom[Math.floor(Math.random() * noMessagesRandom.length)]
        }
    } else {
        // After all sequential messages, show random
        msg = noMessagesRandom[Math.floor(Math.random() * noMessagesRandom.length)]
    }

    // Mix in random messages after attempt 7
    if (oneBased >= 7 && oneBased < MAX_NO_ATTEMPTS && Math.random() < 0.35) {
        msg = noMessagesRandom[Math.floor(Math.random() * noMessagesRandom.length)]
    }

    return msg.replace(/\{sequence_number\}/g, String(oneBased))
}

function getRandomNoMessage() {
    const pool = [...noMessages, ...noMessagesRandom]
    const msg = pool[Math.floor(Math.random() * pool.length)]
    return msg.replace(/\{sequence_number\}/g, String(noAttemptCount))
}

function getChaseMessage() {
    const msg = noMessagesChase[Math.floor(Math.random() * noMessagesChase.length)]
    return msg
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
    noBtn.textContent = getNoMessage(noAttemptCount)
}

function handleNoClick() {
    if (noButtonGone) return
    noClickCount++
    noAttemptCount++
    updateNoButtonText()

    // Grow Yes button on each No, but cap so it stays usable and doesn’t overflow
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

    if (noAttemptCount >= MAX_NO_ATTEMPTS) {
        scheduleStickFigureTakeaway()
        return
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    if (!noBtn) return
    runawayListenersActive = true
    // Slower, smoother glide when the No button runs away from hover/touch
    noBtn.style.transition = 'left 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function disableRunaway() {
    if (!noBtn || !runawayListenersActive) return
    runawayListenersActive = false
    noBtn.style.transition = 'none'
    noBtn.removeEventListener('mouseover', runAway)
    noBtn.removeEventListener('touchstart', runAway)
}

function runAway() {
    if (noButtonGone || !runawayListenersActive) return

    noAttemptCount++
    // Don't update text on hover - text only changes on actual clicks

    if (noAttemptCount >= MAX_NO_ATTEMPTS) {
        scheduleStickFigureTakeaway()
    }

    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin
    const yesRect = yesBtn.getBoundingClientRect()
    const pad = 20
    const avoidLeft = yesRect.left - pad
    const avoidRight = yesRect.right + pad
    const avoidTop = yesRect.top - pad
    const avoidBottom = yesRect.bottom + pad

    // If chase is active, get buddy position to avoid
    let buddyLeft = -1000, buddyRight = -1000, buddyTop = -1000, buddyBottom = -1000
    const BUDDY_AVOID_RADIUS = 200  // Stay at least this far from buddy

    if (chaseActive && takerPosition) {
        buddyLeft = takerPosition.x - BUDDY_AVOID_RADIUS
        buddyRight = takerPosition.x + 50 + BUDDY_AVOID_RADIUS
        buddyTop = takerPosition.y - BUDDY_AVOID_RADIUS
        buddyBottom = takerPosition.y + 100 + BUDDY_AVOID_RADIUS
    }

    let randomX = margin / 2
    let randomY = maxY
    let found = false

    for (let tries = 0; tries < 25; tries++) {
        const x = margin / 2 + Math.random() * (maxX - margin / 2)
        const y = margin / 2 + Math.random() * (maxY - margin / 2)
        const noRight = x + btnW
        const noBottom = y + btnH

        // Check if overlaps with Yes button
        const overlapsYes = (x < avoidRight && noRight > avoidLeft) &&
                           (y < avoidBottom && noBottom > avoidTop)

        // Check if too close to buddy
        const nearBuddy = chaseActive && takerPosition &&
                         (x < buddyRight && noRight > buddyLeft) &&
                         (y < buddyBottom && noBottom > buddyTop)

        if (!overlapsYes && !nearBuddy) {
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
            randomX = buddyCenterX > window.innerWidth / 2 ? margin : maxX - margin
            randomY = buddyCenterY > window.innerHeight / 2 ? margin : maxY - margin
        } else {
            randomX = margin / 2 + Math.random() * (maxX - margin / 2)
            randomY = margin / 2 + Math.random() * (maxY - margin / 2)
        }
    }

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '40'
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
    if (noBtn.dataset.originalText) noBtn.textContent = noBtn.dataset.originalText
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
    taker.style.left = START_LEFT + 'px'
    taker.style.top = (rect.top + rect.height / 2 - TAKER_H / 2) + 'px'
    taker.style.transform = 'none'
    document.getElementById('vday-app').appendChild(taker)

    let takerX = START_LEFT
    let takerY = rect.top + rect.height / 2 - TAKER_H / 2
    chaseActive = true
    takerPosition = { x: takerX, y: takerY }

    const messageInterval = setInterval(() => {
        if (noButtonGone || !noBtn) {
            clearInterval(messageInterval)
            return
        }
        noBtn.textContent = getChaseMessage()
    }, 1500)

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

        if (dist < LOCK_RADIUS) {
            disableRunaway()
        }
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
