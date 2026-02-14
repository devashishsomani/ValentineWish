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
    "If you say no, I'll be really sad...",
    "Please??? 💔",
    "After {sequence_number} no's, I'm still here. That's commitment. 💪",
    "You tried {sequence_number} times… I admire the dedication. 👏",
    "I promise unlimited hugs if you press 'Yes' 🤗",
    "AI prediction: 99.99% chance you meant to press 'Yes'. 🤖",
    "Achievement Unlocked: Denial Queen 👑",
    "Scientists say pressing 'Yes' increases happiness by 200%. 📈",
    "Boss Level Reached. Only 'Yes' can defeat me. 🎮",
    "Denial is a river… but we're not in Egypt. 🌊",
    "Be honest… your finger is tired. Just press Yes. 😅",
    "You're clicking 'No' but smiling, aren't you? 😏",
    "After {sequence_number} no's, I'm still here. That's commitment. 💪",
    "At this point, it's destiny. ✨",
    "The universe is begging you to press Yes. 🌌",
    "One more 'No' and I'm sending the little buddy. 😊"
]

// Pool of messages that can appear randomly after attempt 6 (mixed in via getNoMessage)
const noMessagesRandom = [
    "Nope doesn't count. Try Yes! 😄",
    "Your brain is confused. Heart wants Yes. 🖱️",
    "Error 404: Valid excuse not found. Press Yes. 🔍",
    "This button is just for decoration. Yes is that way → 🎀",
    "Plot twist: you're gonna press Yes. 🎬",
    "Your future 🔮 self says press Yes.",
    "The cat 🐱 is judging you. Press Yes.",
    "Denial: level expert. But Yes wins. 🏆"
]

function getNoMessage(attemptNum) {
    const oneBased = Math.max(1, attemptNum)
    let msg
    if (oneBased <= noMessages.length) {
        msg = noMessages[oneBased - 1]
    } else {
        msg = noMessages[noMessages.length - 1]
    }
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

function handleYesClick() {
    if (!runawayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    document.getElementById('vday-app').style.display = 'none'
    const yesApp = document.getElementById('yes-app')
    yesApp.style.display = 'block'
    if (window.__valentineConfigId) {
        try {
            const raw = localStorage.getItem('valentine_config_' + window.__valentineConfigId)
            if (raw) {
                const config = JSON.parse(raw)
                const yesGif = document.getElementById('yes-gif')
                if (yesGif && config.gifYesDataUrl) yesGif.setAttribute('src', config.gifYesDataUrl)
            }
        } catch (e) {}
    }
    if (typeof window.launchYesConfetti === 'function') window.launchYesConfetti()
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

    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
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
    noBtn.style.transition = 'left 0.45s ease-out, top 0.45s ease-out'
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
    updateNoButtonText()

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

    let randomX = margin / 2
    let randomY = maxY
    let found = false
    for (let tries = 0; tries < 15; tries++) {
        const x = margin / 2 + Math.random() * (maxX - margin / 2)
        const y = margin / 2 + Math.random() * (maxY - margin / 2)
        const noRight = x + btnW
        const noBottom = y + btnH
        const overlapsX = x < avoidRight && noRight > avoidLeft
        const overlapsY = y < avoidBottom && noBottom > avoidTop
        if (!overlapsX || !overlapsY) {
            randomX = x
            randomY = y
            found = true
            break
        }
    }

    if (found) {
        noBtn.style.position = 'fixed'
        noBtn.style.left = `${randomX}px`
        noBtn.style.top = `${randomY}px`
        noBtn.style.zIndex = '40'
        return
    }

    randomX = margin / 2 + Math.random() * (maxX - margin / 2)
    randomY = margin / 2 + Math.random() * (maxY - margin / 2)
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
    const CHASE_SPEED = 0.005
    const CHASE_SPEED_FAST = 0.018
    const GRAB_DURATION = 500
    const TAKEAWAY_DURATION = 2500
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

    const messageInterval = setInterval(() => {
        if (noButtonGone || !noBtn) {
            clearInterval(messageInterval)
            return
        }
        noBtn.textContent = getRandomNoMessage()
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
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < CATCH_RADIUS) {
            noButtonGone = true
            disableRunaway()
            taker.classList.remove('no-taken-taker-chase')
            taker.classList.add('no-taken-taker-grab')
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
                const container = document.querySelector('#vday-app .vday-container')
                const msg = document.createElement('p')
                msg.className = 'no-taken-msg'
                msg.textContent = "You really thought the 'No' button mattered? 😏"
                container.appendChild(msg)
                return
            }
            requestAnimationFrame(animateTakeaway)
        }
        requestAnimationFrame(animateTakeaway)
    }

    requestAnimationFrame(chase)
}
