let audio = new Audio();
let currentSong = null;
let songs = [];

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getSongs() {
    try {
        let response = await fetch("http://127.0.0.1:3000/84.Spotify Clone1/songs/");
        let text = await response.text();
        let div = document.createElement("div");
        div.innerHTML = text;
        let as = div.getElementsByTagName("a");

        let songsList = [];
        for (let i = 0; i < as.length; i++) {
            let element = as[i];
            if (element.href.endsWith(".mp3")) {
                songsList.push(decodeURIComponent(element.href.split("/songs/")[1]));
            }
        }

        return songsList;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic = (track) => {
    if (!track) return;

    let songPath = `http://127.0.0.1:3000/84.Spotify Clone1/songs/` + track;

    if (currentSong === track) {
        if (audio.paused) {
            audio.play().catch(error => console.error("Playback error:", error));
            document.getElementById("play").src = "img/pause.svg";
        } else {
            audio.pause();
            document.getElementById("play").src = "img/play.svg";
        }
        return;
    }
    
    audio.src = songPath;
    audio.preload = "auto";
    audio.load(); 

    audio.play().then(() => {
        document.getElementById("play").src = "img/pause.svg";
    }).catch(error => console.error("Playback error:", error));

    currentSong = track;
    document.querySelector(".songInfo").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function main() {
    songs = await getSongs();
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    songs.forEach(song => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `
            <img class="invert" src="img/music.svg" alt="Image">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Nikk</div>
            </div>
            <div class="playNow">
                <span>Play Now</span>
                <img class="invert play-btn" src="img/play.svg" alt="PlayNow">
            </div>`;

        listItem.addEventListener("click", () => playMusic(song));
        songUL.appendChild(listItem);
    });

    let playButton = document.getElementById("play");
    playButton.addEventListener("click", () => {
        if (audio.paused) {
            audio.play(); 
            playButton.src = "img/pause.svg";
        } else {
            audio.pause();
            playButton.src = "img/play.svg";
        }
    });

    audio.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML =`${secondsToMinutesSeconds(audio.currentTime)} / ${secondsToMinutesSeconds(audio.duration)}`;
        document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        audio.currentTime = (audio.duration * percent) / 100;
    });

    document.getElementById("previous").addEventListener("click", () => {
        let index = songs.indexOf(currentSong);
        if (index > 0) playMusic(songs[index - 1]);
    });

    document.getElementById("next").addEventListener("click", () => {
        let index = songs.indexOf(currentSong);
        if (index < songs.length - 1) playMusic(songs[index + 1]);
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        audio.volume = parseInt(e.target.value) / 100;
    });

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
            audio.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
            audio.volume = 0.10;
            document.querySelector(".range input").value = 10;
        }
    });
}

main();
