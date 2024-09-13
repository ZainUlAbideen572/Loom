setTimeout(() => {
    if (db) {
        // videos retrieval
        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();  //Event driven
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.video);
                let url = URL.createObjectURL(videoObj.data);
                mediaElem.innerHTML = `
                <div class="media">
                    <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;

                galleryCont.appendChild(mediaElem);

                // Listeners
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            })
        }

        // images retrieval
        let imageDBTransaction = db.transaction("image", "readonly");
        // accessing the indexeddb with mode
        let imageStore = imageDBTransaction.objectStore("image");
        // accessing the object store in indexeddb 
        let imageRequest = imageStore.getAll();  //Event driven
        // imagestore.getAll() it will give us all the images.
        imageRequest.onsuccess = (e) => {
            // imageRequest.onsuccess ison success event this will be performed.
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.image);
                let url = imageObj.data;

                mediaElem.innerHTML = `
                <div class="media">
                    <img src="${url}" />
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;
                galleryCont.appendChild(mediaElem);

                // Listeners
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            })
        }
    }
}, 100)


function deleteListener(e){
    let id=e.target.parentElement.getAttribute('id')
    let type=id.slice(0,3)
    if(type === 'vid'){
        let videoDBTransaction=db.transaction('video','readwrite')
        let videoStore=videoDBTransaction.objectStore('video')
        videoStore.delete(id)
    }else if(type === 'img'){
        let imageDBTransaction=db.transaction('image','readwrite')
        let imageStore=imageDBTransaction.objectStore('image')
        imageStore.delete(id)
    }
    e.target.parentElement.remove()
}


function downloadListener(e){
    let id=e.target.parentElement.getAttribute('id')
    let type=id.slice(0,3)
    if(type === 'vid'){
        let videoTransaction=db.transaction('video','readwrite')
        let videoStore=videoTransaction.objectStore('video')
        let videoRequest = videoStore.get(id)
        videoRequest.onsuccess=()=>{
          let videoResult=videoRequest.result
          let url=URL.createObjectURL(videoResult.data)
          
          let a=document.createElement('a')
          a.href=url
          a.download='stream.mp4'
          a.click()
        }
    }else if(type === 'img'){
        let imageTransaction=db.transaction('image','readwrite')
        let imageStore=imageTransaction.objectStore('image')
        let imageRequest = imageStore.get(id)
        imageRequest.onsuccess=()=>{
          let imageResult=imageRequest.result
          let url=imageResult.data
          
          let a=document.createElement('a')
          a.href=url
          a.download='zayan'
          a.click()
        }
    }
}