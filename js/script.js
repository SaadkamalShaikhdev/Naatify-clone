console.log("Checking");
  let currentAudio= new Audio();
  let audio;
  let audios =[];
  let currfolder;
  const previous =document.getElementById("previous");
  const play =document.getElementById("play");
  const next =document.getElementById("next");

 function formatTime(seconds) {
  try {
    // Check if input is a valid number
    if (isNaN(seconds) || seconds == null) return "00:00";

    // Make sure seconds is a whole number
    seconds = Math.floor(seconds);

    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;

    // Pad with leading zeros
    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedSeconds = String(secs).padStart(2, "0");

    // Final check before returning
    if (isNaN(formattedMinutes) || isNaN(formattedSeconds)) return "00:00";

    return `${formattedMinutes}:${formattedSeconds}`;
  } catch (e) {
    return "00:00";
  }
}


async function getAudios(folder) {
    let a = await fetch(`${folder}/`)
    currfolder =folder;
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response
    let as = div.getElementsByTagName("a");
    // console.log(as);
  audios =[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        // console.log(element);
        // console.log(folder);
        
        if (element.href.endsWith(".mp3")) {
            
            // console.log(element);

            // audios.push(element.href.split("/%5Caudio%5C")[1])

            let check=folder.replaceAll("/","%5C") + "%5C"

            audios.push(element.href.split(`${check}`)[1]) 

        }
    }
     let audioul= document.querySelector(".library-list").getElementsByTagName("ul")[0]
    audioul.innerHTML =""
   for (const element of audios) {
     
    audioul.innerHTML =audioul.innerHTML + ` <li>
        <img class="invert" src="image/music-note-03-stroke-rounded.svg" alt="">
        <div class="info">
            <div class="audioname"> ${element.replaceAll("%20"," ").split(" - ")[0]}</div>
            <div class="artist name">${element.replaceAll("%20"," ").split(" - ")[1].replace(".mp3","")}</div>
        </div>
        <div class="playnow">
            <span>Play now</span>
        <img class="invert" src="image/ci-play.svg" alt=""></div>
    </li>`
   }
  Array.from(document.querySelector(".library-list").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click", element=>{
        // console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playAudio(e.querySelector(".info").firstElementChild.innerHTML,e.querySelector(".info").lastElementChild.innerHTML)
    })

  })

}
const playAudio=(track,info,pause =false)=>{
  console.log(track,info);
  
    let artist =info.replaceAll(" ","%20")
    // console.log(info);
    
    let newtrack=`${currfolder}/${track}%20-%20${artist}.mp3`.replaceAll(" ","")
currentAudio.src =newtrack
if(!pause){
    currentAudio.play()
    play.src ="image/pause-stroke-rounded.svg" 
}
document.querySelector(".audioinfo").innerHTML = track
document.querySelector(".audiotime").innerHTML = "00:00 / 00:00"
}
async function displayalbums() {
   let a = await fetch(`/audio/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response
    let anchor =div.getElementsByTagName("a")
    let cardContainer =document.querySelector(".cardContainer")
    let array =Array.from(anchor)
      // console.log(e.href);
for (let index = 0; index < array.length; index++) {
  const e = array[index];
  

      if(e.href.includes("%5Caudio%5")){
       let folder =e.href.split("%5C").slice(-1)[0].slice(0,-1);
      let a = await fetch(`/audio/${folder}/info.json`)
      let response = await a.json();
        console.log(response);
        cardContainer.innerHTML = cardContainer.innerHTML +`<div data-folder="${folder}" class="card">
                        <img src="/audio/${folder}/cover.jpeg" alt="" >
                        <div class="play"><img src="image/play-solid-full.svg" alt=""></div>
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        
      }
    }
    Array.from(document.getElementsByClassName("card")).forEach((e)=>{
    e.addEventListener("click",async item=>{
    
     console.log(item.currentTarget.dataset.folder);
     
    await getAudios(`/audio/${item.currentTarget.dataset.folder}`);
      //  console.log(audios);
        playAudio(audios[0].replaceAll("%20"," ").split(" - ")[0],audios[0].replaceAll("%20"," ").split(" - ")[1].replace(".mp3",""))
       
    })
  })
    
}
async function main() {
  
   await getAudios("/audio/cs");
    playAudio(audios[0].replaceAll("%20"," ").split(" - ")[0],audios[0].replaceAll("%20"," ").split(" - ")[1].replace(".mp3",""),true)
    // displayalbum
displayalbums()

  
    // click play icon to play
  play.addEventListener("click",()=>{
if(currentAudio.paused){
    currentAudio.play()
    play.src ="image/pause-stroke-rounded.svg"   
}
else{
    currentAudio.pause()
    play.src ="image/ci-play.svg"
}
  })
  currentAudio.addEventListener("timeupdate",()=>{
    document.querySelector(".audiotime").innerHTML =`${formatTime(currentAudio.currentTime)}/${formatTime(currentAudio.duration)}`
    document.querySelector(".circle").style.left =((currentAudio.currentTime / currentAudio.duration)*100 ) -1 +"%"
  })
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percan = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left =percan +"%";
    currentAudio.currentTime = ((currentAudio.duration)*percan) /100
  })
  document.querySelector(".hamburger").addEventListener("click",()=>{
    if(document.querySelector(".sidebar").style.display ==="flex"){
        document.querySelector(".sidebar").style.display ="none";
        document.querySelector(".hamburger img").src ="image/hamburger.svg"
    }
    else{   
        document.querySelector(".sidebar").style.display ="flex";
        document.querySelector(".hamburger img").src ="image/cancel-01-stroke-rounded.svg"
        
    }
  })
  document.querySelector(".library-hidden").addEventListener("click",()=>{
    document.querySelector(".left").style.left ="0%"
  })
  document.querySelector(".cancel").addEventListener("click",()=>{
     document.querySelector(".left").style.left ="-110%"
  })
  // previous button
  previous.addEventListener("click",()=>{
     let index =audios.indexOf(currentAudio.src.split("/").slice(-1)[0])
       if((index-1) >= 0) {
      playAudio(audios[index-1].replaceAll("%20"," ").split(" - ")[0],audios[index-1].replaceAll("%20"," ").split(" - ")[1].replace(".mp3",""))
  
    }
  })
  // next button
  next.addEventListener("click",()=>{
    let index =audios.indexOf(currentAudio.src.split("/").slice(-1)[0])
    if(index+1 < audios.length){
      playAudio(audios[index+1].replaceAll("%20"," ").split(" - ")[0],audios[index+1].replaceAll("%20"," ").split(" - ")[1].replace(".mp3",""))
      }
  })
  //Volume bar
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentAudio.volume =parseInt(e.target.value)/100
    
    if(document.querySelector(".volume>img").src == "http://127.0.0.1:3000/image/volume-off-stroke-rounded.svg"){
document.querySelector(".volume>img").src ="http://127.0.0.1:3000/image/volume-high-stroke-rounded.svg"
    }
    
  })
  // click at volume icon to mute
document.querySelector(".volume>img").addEventListener("click",e=>{
  // console.log(e.target);
  if (e.target.src.includes("volume-high-stroke-rounded.svg")){
   e.target.src ="http://127.0.0.1:3000/image/volume-off-stroke-rounded.svg";
   currentAudio.volume =0
   document.querySelector(".range").getElementsByTagName("input")[0].value =0;
    console.log(e.target.src);
  }
  else{
    e.target.src ="http://127.0.0.1:3000/image/volume-high-stroke-rounded.svg";
currentAudio.volume = .1;
 document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }
  
})
}
main()
console.log(audio);
