let video=document.querySelector('video')
let recordcont=document.querySelector('.record-cont')
let recordbtn=document.querySelector('.record-btn')
let timer = document.querySelector(".timer");
let capturecont=document.querySelector('.capture-cont')
let gallery=document.querySelector('.gallery')

let recordFlag=false
let constraints={
video:true,
audio:false
}
let recorder;
let chunks=[]
let transparent='transparent'
// navigator gives us browser info

navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    // stream is what we are streaming
    video.srcObject=stream
    recorder=new MediaRecorder(stream)
    // to record it we use mediarecorder
    // chunks:it is the data we get in small pieces
    
    recorder.addEventListener('start',()=>{
        chunks=[]
    })
    recorder.addEventListener('dataavailable',(e)=>{
        chunks.push(e.data)
    })
    recorder.addEventListener('stop',(e)=>{
        let blob = new Blob(chunks, { type: "video/mp4" });
        if(db){
            let videoid=shortid()
            let transaction=db.transaction('video','readwrite')
            // transaction is simply modification on data base
            let store=transaction.objectStore('video')
            // after making transaction we are accessing object store
            let blobdata={
                video:`vid${videoid}`,
                data:blob
            }
            store.add(blobdata)
            // method to add data
        }
        // let url=URL.createObjectURL(blob)
        // let a=document.createElement('a')
        // a.href=url
        // a.download='stream/mp4'
        // a.click();

    })

})
recordcont.addEventListener("click",(e)=>{
    if(!recorder){
        return
    }
    recordFlag=!recordFlag
    if(recordFlag){
        recorder.start()
        recordbtn.classList.add('scale-record')
        startTimer()
    }else{
        recorder.stop()
        recordbtn.classList.remove('scale-record')
        stopTimer()
    }
})
capturecont.addEventListener('click',(e)=>{
    let canvas=document.createElement('canvas')
    // canvas is api which allows us to draw graphics ,manipulate images.
    // canvas.width will be set in pixels
    // in order to get the canvas tool we use getContext('2d')

    canvas.width=video.videoWidth
    canvas.height=video.videoHeight
    let ctx=canvas.getContext('2d')
    // video is collection of frames 
    // to draw image from video using  canvas  we use ctx.drawImage and provide dimensions
   
    ctx.drawImage(video,0,0,canvas.width,canvas.height)
    ctx.fillStyle=transparent
    ctx.fillRect(0,0,canvas.width,canvas.height)
   
    let a = document.createElement('a')
    let url=canvas.toDataURL()
    // to dataurl is data url in the form of image format
    a.href=url
    if(db){
        if(db){
            let imageid=shortid()
            let transaction=db.transaction('image','readwrite')
            let store=transaction.objectStore('image')
            let blobdata={
                image:`img${imageid}`,
                data:url
            }
            store.add(blobdata)
        }
    }
 
})


let timerID;
let counter = 0; 
function startTimer() {
    timer.style.display = "block";
    // timer.show.display for visibilty
    function displayTimer() {
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600; 
        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60; // remaining value

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }

    timerID = setInterval(displayTimer, 1000);
}
function stopTimer() {
    clearInterval(timerID);
    // timer.innerText = "00:00:00";
    timer.style.display = "none";
}
let allFilters=document.querySelectorAll('.filter')
let filterLayer=document.querySelector('.filter-layer')
allFilters.forEach((ele)=>{
    ele.addEventListener('click',(e)=>{
        transparent=getComputedStyle(ele).getPropertyValue("background-color")
        // for accessing the style use getComputedStyle method.
        filterLayer.style.backgroundColor=transparent
        // for settng the style we use style property
    })
})
gallery.addEventListener('click',(e)=>{
    location.assign('./gallery.html')
})