/**
 * App-wide music: autoplay on load; toggle on/off; cycle to next track (no "default/other" labels).
 */
(function () {
    var music = document.getElementById('bg-music');
    var source = document.getElementById('bg-music-source');
    var toggle = document.getElementById('music-toggle');
    var switchBtn = document.getElementById('music-switch');
    if (!music || !toggle) return;

    var tracks = [
        { name: 'Kaise Banu', src: 'music/Kaise Banu Taaruk Raina 320 Kbps.mp3' },
        { name: 'Glue Song', src: 'music/beabadoobee - Glue Song (Lyrics).mp3' }
    ];
    var currentTrackIndex = 0;
    window.musicPlaying = true;

    toggle.addEventListener('click', function () {
        if (window.musicPlaying) {
            music.pause();
            window.musicPlaying = false;
            toggle.textContent = '\u{1F507}'; // 🔇
        } else {
            music.muted = false;
            music.play();
            window.musicPlaying = true;
            toggle.textContent = '\u{1F50A}'; // 🔊
        }
    });

    if (switchBtn && source) {
        switchBtn.addEventListener('click', function () {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            source.setAttribute('src', tracks[currentTrackIndex].src);
            music.load();
            music.currentTime = 0;
            if (window.musicPlaying) {
                music.play().catch(function () {});
            }
        });
    }

    music.volume = 0.3;
    window.startValentineMusic = function () {
        music.muted = false;
        music.play().then(function () {
            window.__musicStarted = true;
            window.musicPlaying = true;
            if (toggle) toggle.textContent = '\u{1F50A}';
        }).catch(function () {});
    };

    // Start muted so autoplay is allowed; unmute automatically as soon as page load completes (no click).
    music.muted = true;
    music.play().then(function () {
        window.__musicStarted = true;
        if (toggle) toggle.textContent = '\u{1F507}';
    }).catch(function () {});

    function unmuteAfterLoad() {
        music.muted = false;
        window.musicPlaying = true;
        if (toggle) toggle.textContent = '\u{1F50A}';
        music.play().catch(function () {});
    }

    if (document.readyState === 'complete') {
        unmuteAfterLoad();
    } else {
        window.addEventListener('load', unmuteAfterLoad);
    }
})();
