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
      <v-col v-for="image in images" :key="image.url">
        <ImageCard :image="image['url']" :date="image['date']"></ImageCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const fb = require("../firebaseConfig.js");
import ImageCard from "../components/ImageCard";

export default {
  components: { ImageCard },
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
            let image = {};
            imageRef
              .getDownloadURL()
              .then(imageURL => {
                image.url = imageURL.toString();
              })
              .catch(function(error) {
                // Handle any errors
              });
            imageRef
              .getMetadata()
              .then(function(metadata) {
                image.date = metadata.timeCreated.toString();
              })
              .catch(function(error) {
              // Uh-oh, an error occurred!
            });
            this.images.push(image);
          });
        })
        .catch(function(error) {
          // Handle any errors
        });
    }
  }
};
</script> 