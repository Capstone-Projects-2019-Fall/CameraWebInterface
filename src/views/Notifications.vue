<template>
  <div class="notifications">
    <h1>This is notifications page</h1>
    <v-btn v-on:click="listImages">Click Me</v-btn>
    <v-img v-for="image in images" :key="image" :src="image.url" max-width="200"></v-img>
  </div>
</template>

<script>
const fb = require('../firebaseConfig.js')
 
export default {
  data: function()  {
    return {
        images: []
    }
  },
  methods: {
    listImages: function(){
      var childRef = fb.storageRef.child('images');
      childRef.listAll().then((result) => {
        result.items.forEach((imageRef) => {
          imageRef.getDownloadURL().then((imageURL) => {
            this.images.push( {url: imageURL.toString()} );
          }).catch(function(error) {
            // Handle any errors 
          });
        });
      }).catch(function(error) {
          // Handle any errors
      });
    }
  }
} 
</script> 