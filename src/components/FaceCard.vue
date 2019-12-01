<template>
  <v-card height="300px" width="300px" >
      <v-card-subtitle align="center" justify="center" class="cyan darken-1 font-weight-black">{{image}} </v-card-subtitle>
      <v-row align="center" justify="center">
       <v-card-actions>
        <v-btn  small color="error" @click="deleteImage">Delete</v-btn>
       </v-card-actions>
      </v-row>
      <v-row align="center" justify="center">
      <v-img max-width="200px" max-height="200px" :src="imageURL"></v-img>
      </v-row>

  </v-card>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapGetters } from "vuex";
import store from "../store";
import firebase from 'firebase';

export default {
  
    name: "FaceCard",
    props: {
        image: {
        type: String,
        default: ""
        },
        imageURL: {
            type: String,
            default: ""
        },
        imagePath: {
            type: String,
            default: ""
        }
    },
    computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  },
    methods: {
        async deleteImage(event){
          // Create a reference to the file to delete
        var desertRef = fb.storageRef.child(this.imagePath);
        var filesArray = fb.db.collection("users").doc(this.user.data.uid);

        // Delete the file
        await desertRef.delete().then(function() {
            console.log(this.image);
           
            // File deleted successfully
        }).catch(function(error) {
            // Uh-oh, an error occurred!
        });  
        await filesArray.update({
                familiarFaces: firebase.firestore.FieldValue.arrayRemove(this.image)
        });
        this.$emit('deletedImage');
        }
        
        
    }
   

};

</script>