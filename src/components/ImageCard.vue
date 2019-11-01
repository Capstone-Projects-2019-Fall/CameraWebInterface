<template>
  <v-card tile max-width="200px">
    <v-img :src="image" max-width="200px"></v-img>

    <v-card-subtitle>{{date}}</v-card-subtitle>
  </v-card>
</template>

<script>
export default {
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
    }
  }
};
</script>

<style>
</style>