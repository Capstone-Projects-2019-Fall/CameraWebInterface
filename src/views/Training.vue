<template>
  <v-app>
    <v-row>
    
        <v-container>
          <v-row>
           <v-col>
              <v-btn small left color="primary" @click="dialog=true">Add New</v-btn>
            </v-col>
          </v-row>
             
          <v-row align="start" align-content="center" justify="center">
            <v-col v-for="item in items" :key="item.name">
             <FaceCard :imageURL="item.url" :image="item.name" :imagePath="item.path" v-on:deletedImage="updateList()"></FaceCard>
             </v-col>
          </v-row>

          <v-dialog
            v-model="dialog"
            max-width="6550px">
            <AddFace v-on:addedImage="onClickAdd()" />
            </v-dialog>
                 
        </v-container>
     
      

    </v-row>



  </v-app>
</template>


<script>

import { async } from 'q';
const fb = require("../firebaseConfig.js");
import { mapGetters } from "vuex";
import store from "../store";
import FaceCard from "../components/FaceCard"
import AddFace from "../components/AddFace"

export default {
  name: 'Upload',
  components: {  FaceCard, AddFace },
  data: function() {	  
    return{
      items: [],
     
      dialog:false,
      disabled: null,
      childMsg: ""
     
	  }
  },
    computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  },
  mounted: function() {
    this.$nextTick(function() {
      this.updateList();
    });
  },
  methods:{
    onClickAdd(){
      this.dialog = false;
      this.updateList();
    },

    async updateList(){
      this.items = [];
      var childRef = fb.storageRef.child(this.user.data.uid+"/training/");
      console.log(childRef);
       await childRef.listAll().then(result => {
           result.items.forEach(async folderRef => {
           let item = {};
           await folderRef
              .getDownloadURL()
              .then(imageURL => {
                item.url = imageURL.toString();
              })
              .catch(function(error) {
                // Handle any errors
              });
           await folderRef
              .getMetadata()
              .then(function(metadata) {
                item.name = metadata.name.toString();
                item.path = metadata.fullPath.toString();
              })
              .catch(function(error) {
              // Uh-oh, an error occurred!
            });
            
            this.items.push(item);
          });
      
       });
      }
  }
}
</script>



<style scoped="">
img.preview {
    width: 200px;
}

</style>