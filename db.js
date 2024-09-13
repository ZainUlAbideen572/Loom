let db;
let openRequest=indexedDB.open('Loom_Database')
openRequest.addEventListener('success',()=>{
    // console.log('success')
    db=openRequest.result
})
openRequest.addEventListener('error',()=>{
    // console.log('error')
})
openRequest.addEventListener('upgradeneeded',()=>{
    // console.log('upgraded')
   db=openRequest.result
   db.createObjectStore('video',{keyPath:'video'})
   db.createObjectStore('image',{keyPath:'image'})
})
// indexeddb is object oriented database 
// like wise in mongo in db there will be collections in indexeddb there will be like objects .
// we need to create object store for storing our data in indexeddb 
// keypath is unique identifier in objectstore.
// we need to createObjectstore only in upgrade event handler the structural change or schema changes should happen only in upgrade tarnsaction.