let musicPlaying = false

window.addEventListener('load', () => {
    launchConfetti()

    // Apply config from ?v= (same id as index.html) for custom song and gif
    const params = new URLSearchParams(window.location.search)
    const id = params.get('v')
    if (id) {
        try {
            const raw = localStorage.getItem('valentine_config_' + id)
            if (raw) {
                const config = JSON.parse(raw)
                const music = document.getElementById('bg-music')
                if (music && config.songDataUrl) {
                    const src = document.querySelector('#bg-music source')
                    if (src) {
                        src.setAttribute('src', config.songDataUrl)
                        if (config.songDataUrl.startsWith('data:audio/')) {
                            const m = config.songDataUrl.match(/data:audio\/([^;]+)/)
                            src.setAttribute('type', m ? 'audio/' + m[1] : 'audio/mpeg')
                        }
                    }
                }
                const catGif = document.getElementById('cat-gif')
                if (catGif && config.gifYesDataUrl) catGif.setAttribute('src', config.gifYesDataUrl)
            }
        } catch (e) {}
    }

    const music = document.getElementById('bg-music')
    if (music) {
        music.volume = 0.3
        music.play().catch(() => {})
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
})

function launchConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00']
    const duration = 6000
    const end = Date.now() + duration

    if (typeof confetti !== 'function') return

    confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors
    })

    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval)
            return
        }

        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors
        })

        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors
        })
    }, 300)
}

function toggleMusic() {
    const music = document.getElementById('bg-music')
    if (!music) return
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}
