console.log("Created by Naman")
//Created by Naman
//function to fetch songs folders
async function getFolders(){
    let f = await fetch(`songs`)
    let g = await f.text()
    let div = document.createElement("div")
    div.innerHTML = g
    let h = div.querySelectorAll("a[href]")
    let folders = []
    for (let i = 0; i < h.length; i++) {
        const e = h[i];
        if(!e.href.endsWith(`.htaccess`) && e.href.includes("songs")) 
            folders.push(e.href)
    }
    return folders
}

//function to fetch the songs
async function getSongs(folder){
    let a = await fetch(folder)
    let b = await a.text()
    let div = document.createElement("div")
    div.innerHTML = b
    let c = div.querySelectorAll("a")
    let songs = []
    for (const i of c) {
        if(i.href.endsWith(".mp3")) songs.push(i.href)
    }
    return songs
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function main(){
    let folders = await getFolders()

    for (const i of folders) {
        let j = await fetch(i+"info.json")
        let k = await j.json()
        let l = i+"cover.jpeg"
        let card = `<div class="card">
                        <img src="${l}" alt="card image">
                        <div class="player flex"><img src="images/player.svg" alt="player"></div>
                        <div class="font1 name">${k.name}</div>
                        <div class="font2 description">${k.description}</div>
                    </div>`
        document.querySelector(".container").innerHTML = document.querySelector(".container").innerHTML + card
    }

    let currentfolder = 0
    let songs = await getSongs(folders[0])
    let track = new Audio(songs[0]) //stores current song
    track.volume = 0.5
    let current = 0         //stores id of currently playing song from array "songs"
    document.querySelector(".info").innerHTML = songs[current].split("_")[1].replaceAll("%20"," ")

    for (const e of songs) {
        let n = e.split(folders[currentfolder])[1].replaceAll("%20"," ");
        console.log(n)
        let nam = n.split("_");
        nam[1] = nam[1].split(".")[0];
        let li = `<li class="flex">
                            <img src="images/music.svg" alt="music">
                            <div class="song-info">
                                <div class="name font1">${nam[1]}</div>
                                <div class="artist font2">${nam[0]}</div>
                            </div>
                            <img src="images/play.svg" alt="play">
                        </li>`
        document.querySelector("ul.flex").innerHTML = document.querySelector("ul.flex").innerHTML + li
    }

    //Playlist Change
    let fs = document.querySelector(".container").getElementsByClassName("card")
    for (let i = 0; i < fs.length; i++) {
        const e = fs[i];
        e.addEventListener("click",async ()=>{
            currentfolder = i
            songs = await getSongs(folders[i])
            track.src = songs[0]
            current = 0
            document.querySelector(".info").innerHTML = songs[current].split("_")[1].replaceAll("%20"," ")

            document.querySelector("ul.flex").innerHTML = ""
            for (const e of songs) {
                let n = e.split(folders[currentfolder])[1].replaceAll("%20"," ")
                let nam = n.split("_")
                nam[1] = nam[1].replace(".mp3","")
                let li = `<li class="flex">
                                    <img src="images/music.svg" alt="music">
                                    <div class="song-info">
                                        <div class="name font1">${nam[1]}</div>
                                        <div class="artist font2">${nam[0]}</div>
                                    </div>
                                    <img src="images/play.svg" alt="play">
                                </li>`
                document.querySelector("ul.flex").innerHTML = document.querySelector("ul.flex").innerHTML + li
            }

            track.play()
            document.getElementById("pause/play").querySelector("img").src = "images/pause.svg"
        })
    }


    //Event listener to play songs on click
    let lis = document.querySelector(".song-lib").getElementsByTagName("li")
    for (let i = 0; i < lis.length; i++) {
        lis[i].addEventListener("click",()=>{
            track.src = songs[i]
            current = i
            track.play()
            document.querySelector(".info").innerHTML = songs[current].split("_")[1].replaceAll("%20"," ")
            document.getElementById("pause/play").querySelector("img").src = "images/pause.svg"
        })
    }
    //Event listener for pause/play
    document.getElementById("pause/play").addEventListener("click",()=>{
        if(track.paused){
            track.play()
            document.getElementById("pause/play").querySelector("img").src = "images/pause.svg"
        }
        else{
            track.pause()
            document.getElementById("pause/play").querySelector("img").src = "images/play.svg"
        }
    })

    //Listen for timeupdate
    track.addEventListener("timeupdate",()=>{
        document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(track.currentTime)}/${secondsToMinutesSeconds(track.duration)}`
        document.querySelector(".circle").style.left = (track.currentTime/track.duration)*100 + "%"
    })

    //Seeking in seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + "%"
        track.currentTime = track.duration*(e.offsetX/e.target.getBoundingClientRect().width)
    })

    //Menu event
    document.querySelector(".menu").addEventListener("click",()=>{
        document.querySelector(".left").style.transform = "translate(0)"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.transform = "translate(-100%)"
    })

    //Previous and Next buttons
    document.getElementById("previous").addEventListener("click",()=>{
        if(current != 0){
            current--;
            track.src = songs[current]
            track.play()
            document.querySelector(".info").innerHTML = songs[current].split("_")[1].replaceAll("%20"," ")
            document.getElementById("pause/play").querySelector("img").src = "images/pause.svg"
        }
    })
    document.getElementById("next").addEventListener("click",()=>{
        if(songs[current+1]!=undefined){
            current++;
            track.src = songs[current]
            track.play()
            document.querySelector(".info").innerHTML = songs[current].split("_")[1].replaceAll("%20"," ")
            document.getElementById("pause/play").querySelector("img").src = "images/pause.svg"
        }
    })

    //Volume control
    document.querySelector(".volumebar").addEventListener("change",(e)=>{
        track.volume = e.target.value/100
        if(e.target.value == 0){
            document.querySelector(".volume>img").src = "images/mute.svg"
        }
        else{
            document.querySelector(".volume>img").src = "images/volume.svg"
        }
    })
    //Mute
    document.querySelector(".volume>img").addEventListener("click",()=>{
        if(track.volume == 0){
            track.volume = 0.5
            document.querySelector(".volume>img").src = "images/volume.svg"
            document.querySelector(".volumebar").value = 50
        }
        else{
            track.volume = 0
            document.querySelector(".volume>img").src = "images/mute.svg"
            document.querySelector(".volumebar").value = 0
        }
    })

    //Next song auto play
    track.addEventListener("ended",()=>{
        if(songs[current+1] == undefined){
            document.getElementById("pause/play").querySelector("img").src = "images/play.svg"
        }
        else{
            current++
            track.src = songs[current]
            track.play()
            document.querySelector(".info").innerHTML = songs[current].split("_")[1].replaceAll("%20"," ")
        }
    })
}
main()