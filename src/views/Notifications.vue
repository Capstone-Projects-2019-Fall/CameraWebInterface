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
      <v-col v-for="image in images" :key="image.date">
        <ImageCard :image="image.url" :date="image.date"></ImageCard>
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
    listImages: async function() {
      this.images = [];
      var childRef = fb.storageRef.child("images");
      await childRef
        .listAll()
        .then(result => {
          result.items.forEach(async imageRef => {
            let image = {};
            await imageRef
              .getDownloadURL()
              .then(imageURL => {
                image.url = imageURL.toString();
              })
              .catch(function(error) {
                // Handle any errors
              });
            await imageRef
              .getMetadata()
              .then(function(metadata) {
                image.date = new Date(metadata.timeCreated.toString());
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