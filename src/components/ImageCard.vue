<template>
  <v-card tile max-width="200px">
    <v-img :src="image" max-width="200px" @click.stop="dialog = true"
></v-img>
    <v-card-subtitle>{{date}}</v-card-subtitle>

    <v-dialog
        v-model="dialog"
        max-width="800"
      >
        <v-card>
          <v-card-title class="headline">{{date}}</v-card-title>

         <VideoCard :name = "name" :imageURL = "image"/>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import VideoCard from "../components/VideoCard.vue"
export default {
  components: {
    VideoCard
  },
  props: {
    image: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: "Subtitle"
    },
    title: {
      type: String,
      default: "Title"
    },
      name: {
      type: String,
      default: ""
    }


  },
  data () {
    return {
      dialog: false
      
    }
  },

};
</script>

<style>
</style>