<template>
  <v-card height="300px" width="300px">
      <v-card-subtitle>{{image}}</v-card-subtitle>
      <v-img max-width="200px" max-height="200px" :src="imageURL"></v-img>
      <v-card-actions>
        <v-btn small color="error" @click="deleteImage">Delete</v-btn>
       </v-card-actions>
  </v-card>
</template>

<script>
const fb = require("../firebaseConfig.js");
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

    methods: {
        async deleteImage(event){
          // Create a reference to the file to delete
        var desertRef = fb.storageRef.child(this.imagePath);

        // Delete the file
        await desertRef.delete().then(function() {
            
            // File deleted successfully
        }).catch(function(error) {
            // Uh-oh, an error occurred!
        });  
        this.$emit('deletedImage');
        }
        
        
    }
   

};

</script>