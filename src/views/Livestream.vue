<template>
  <v-app>
    <v-card  
    class="mx-auto"
    >
        <v-card-title>
          <v-select
            :items="items"
            label="Select Camera"
            dense
            outlined
          ></v-select>
        </v-card-title>

        <v-card-title class="justify-center">
          <v-card height="600px" width="600px">
            <v-img src="../assets/mspi.png"
            ></v-img>
          </v-card>
        </v-card-title>
      <v-card-actions class="justify-center">
        <v-btn small color="primary">Start Video Stream</v-btn>
      </v-card-actions>
  
    </v-card>
  </v-app>
</template>

<script>
export default {
   data() {
    return {
      items: ["Test"]
    }
  } ,
  methods: {
    
  }
}
</script>