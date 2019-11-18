<template>
  <v-app>
    <v-row>
      <v-col>
        <v-container >
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
            max-width="600">
            <v-card>
              <v-card-title>Add New - Enter Name</v-card-title>
              <v-text-field 
                v-model="input.name"
                 :rules="['Required']">
                Name
              </v-text-field>
              <v-card class="mx-auto">
              <div >
                 
                <p>Upload an image:</p>
                  <input type="file" @change="previewImage" accept="image/jpeg" >
              </div>
                 <div>
      
               <v-progress-linear
                  v-model="uploadValue"
                  color="indigo darken-2"
                  ></v-progress-linear>
        
                </div>
                <div v-if="imageData!=null">
                <img class="preview" :src="picture">
                  <br>
                </div>
                    </v-card> 
                  <v-card-actions>
                  <v-btn small left color="primary" :disabled="!input.name" @click.prevent="onUpload">Add</v-btn>
                  </v-card-actions>
                  </v-card>
            </v-dialog>

        
         
        </v-container>
      </v-col>
      

    </v-row>



  </v-app>
</template>


<script>
import { async } from 'q';
const fb = require("../firebaseConfig.js");
import { mapGetters } from "vuex";
import store from "../store";
import FaceCard from "../components/FaceCard"

export default {
  name: 'Upload',
  components: {  FaceCard },
  data: function() {	  
    return{
      items: [],
      imageData: null,
      picture: null,
      uploadValue: 0,
      input: {
        name: "",
       },
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
    onChildClick(value){
      console.log(value);
      console.log("child was clicked");
    },
    previewImage(event) {
      this.uploadValue=0;
      this.picture=null;
      this.imageData = event.target.files[0];
    },

    onUpload(){
      this.picture=null;
      var childRef = fb.storageRef.child(this.user.data.uid+"/training/"+this.input.name+".jpg").put(this.imageData);
      childRef.on(`state_changed`,snapshot=>{
        this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error=>{console.log(error.message)},
      ()=>{this.uploadValue=100;
        childRef.snapshot.ref.getDownloadURL().then((url)=>{
          this.picture =url;
          this.updateList();
          this.dialog = false;
        });
      }
      );
 
   
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