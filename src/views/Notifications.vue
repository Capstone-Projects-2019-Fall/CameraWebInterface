<template>
  <v-container class="notification">
    <v-row>
      <v-col align="center">
        <h1>Notifications</h1>
      </v-col>
    </v-row>
    <v-row align-content="center" justify="center">
      <v-col v-for="image in sortedImages" :key="image.date">
        <ImageCard :image="image.url" :date="image.date" :name="image.name"></ImageCard>
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
  computed: {
    sortedImages: function() {
        this.images.sort( ( b, a) => {
            return new Date(a.date) - new Date(b.date);
        });
        return this.images;
    }
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
                image.date = new Date(metadata.timeCreated).toString();
                image.name = metadata.name.toString();
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