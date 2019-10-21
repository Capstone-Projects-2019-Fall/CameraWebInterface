<template>
  <v-container class="notification">
    <v-row>
      <v-col align="center">
        <h1>This is notifications page</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn v-on:click="listImages">Click Me</v-btn>
      </v-col>
    </v-row>
    <v-row align-content="center" justify="center">
      <v-img v-for="image in images" :key="image" :src="image.url" max-width="200"></v-img>
    </v-row>
  </v-container>
</template>

<script>
const fb = require("../firebaseConfig.js");

export default {
  data: function() {
    return {
      images: []
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      this.listImages();
    });
  },
  methods: {
    listImages: function() {
      var childRef = fb.storageRef.child("images");
      childRef
        .listAll()
        .then(result => {
          result.items.forEach(imageRef => {
            imageRef
              .getDownloadURL()
              .then(imageURL => {
                this.images.push({ url: imageURL.toString() });
              })
              .catch(function(error) {
                // Handle any errors
              });
          });
        })
        .catch(function(error) {
          // Handle any errors
        });
    }
  }
};
</script> 