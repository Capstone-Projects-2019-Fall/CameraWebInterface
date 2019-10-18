<template>
  <div class="notifications">
    <h1>This is notifications page</h1>
    <v-btn v-on:click="listImages">Click Me</v-btn>
    <v-img v-for="image in images" :key="image" :src="image.url" max-width="200"></v-img>
  </div>
</template>

<script>
 const fb = require('../firebaseConfig.js')
 /*fb.usersCollection.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data().what}`);
            });
        })
 */      

// this works
var childRef = fb.storageRef.child('images');
var images =[];
// Now we get the references of these images
childRef.listAll().then(function(result) {
  result.items.forEach(function(imageRef) {
      imageRef.getDownloadURL().then(function(url) {
        images.push({url: url});
      }).catch(function(error) {
    // Handle any errors
      });
  });
}).catch(function(error) {
  // Handle any errors
});

function displayImage(imageRef, array) {
  imageRef.getDownloadURL().then(function(url) {
    images.push({url: url});
    document.querySelector("v-img").src = url;
  }).catch(function(error) {
    // Handle any errors
  });
}
  //   console.log(images);

// end of this works
/*var url = fb.storageRef.child('2019-10-17 07:25:24.278527.jpg').getDownloadURL().then(function(url){
  document.querySelector('img').src = url;
}).catch(function(error){

})
*/

export default {
  data: function()  {
    return {
        images: [
         /* {url: "https://firebasestorage.googleapis.com/v0/b/mspi-a4b75.appspot.com/o/images%2Fimage5.jpg?alt=media&token=77065547-cd3b-4ebc-b0cf-1a77b5fb0849"},

          {url: "https://firebasestorage.googleapis.com/v0/b/mspi-a4b75.appspot.com/o/images%2Fiamge3.jpg?alt=media&token=481e28a5-851a-4239-81f8-a7a076edaefa"},

          {url: "https://firebasestorage.googleapis.com/v0/b/mspi-a4b75.appspot.com/o/images%2Fimage4.jpg?alt=media&token=88cdeab5-7ea6-4f6d-b60c-89969eb83bb5"},

          {url: "https://firebasestorage.googleapis.com/v0/b/mspi-a4b75.appspot.com/o/images%2Fimage2.jpg?alt=media&token=8de8ea51-c041-435e-8b23-b6eb8f66b76d"},

          {url: "https://firebasestorage.googleapis.com/v0/b/mspi-a4b75.appspot.com/o/images%2Fimage1.jpg?alt=media&token=fe4e279e-642d-444e-b66b-d74874e0f035"}
        */
        ]
    }
  },
  methods: {

 /*fb.usersCollection.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data().what}`);
            });
        })
 */      



    insertImage: function(){
        this.images.push( {url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"} );
    },
    listImages: function(){
      var array = [];
      console.log("called id");
      var childRef = fb.storageRef.child('images');
      childRef.listAll().then((result) => {
      // console.log("first loop");
      result.items.forEach((imageRef) => {
      //  console.log("second loop");
      //  console.log(imageRef);
        imageRef.getDownloadURL().then((imageURL) => {
        this.images.push( {url: imageURL.toString()} );
      //  console.log("pushing images");
      //  console.log(imageURL);   
        
      }).catch(function(error) {
    // Handle any errors 
      });
  });
  
  this.images = array;
  console.log(this.images);
}).catch(function(error) {
  // Handle any errors
});
    }
  }
} 
</script> 