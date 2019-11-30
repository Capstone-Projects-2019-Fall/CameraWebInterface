<template>
    <v-card>
        <v-card-title primary-title class="justify-center">Add New</v-card-title>
        
        <v-tabs
            v-model="tab"
            background-color="cyan darken-1"
            centered
            dark
            icons-and-text
        >
            <v-tabs-slider></v-tabs-slider>

            <v-tab grow href="#tab-2">
                Take a picture
                <v-icon>mdi-camera</v-icon>
            </v-tab>

            <v-tab grow href="#tab-1">
                Upload
                <v-icon>mdi-cloud-upload</v-icon>
            </v-tab>
        </v-tabs>

        <v-tabs-items sm="12" v-model="tab">
            <v-tab-item :value="'tab-1'">
                <v-card  >
                    <v-row>
                        <v-col sm="4">
                            <v-text-field 
                                v-model="input.name"
                                :rules="['Required']"
                                label="Enter Name">
                                Name
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col sm="2">
                          <p>  Upload an image: </p>
                        </v-col>
                           <v-col sm="2">

                        <input type="file" ref="imageUpload" @change="previewImage" accept="image/jpeg" >

                         </v-col>
                    </v-row>
                    <v-row>
                        <v-col sm="12">
                            <v-progress-linear
                                v-model="uploadValue"
                                color="cyan darken-2"
                            ></v-progress-linear>
                         </v-col>
                    </v-row>
                  
                    <v-card-actions>
                        <v-btn small left color="primary" :disabled="isDisabledFile" @click.prevent="onUploadFile">Add</v-btn>
                    </v-card-actions>
                </v-card>
            </v-tab-item>
            <v-tab-item :value="'tab-2'">
                <v-card >
                     <v-row>
                       
                        <v-col sm="4"> 
                            <v-text-field 
                                v-model="input.name"
                                :rules="['Required']"
                                label="Enter Name">
                                Name
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                   
                       <v-btn small left color="primary" @click="getVideoFeed">Open Camera</v-btn>
                       <v-btn small left color="primary" id="snap" v-on:click="capture()">Snap Photo</v-btn>
                    </v-row>
                    <v-row v-if="isMobile"> <!-- for mobile !-->
                        <v-row><video ref="video" id="video" width="320" height="240" autoplay></video></v-row>
                        <v-row><canvas ref="canvas" id="canvas" width="320" height="240"></canvas></v-row>
                   </v-row>  
                   <v-row v-else> <!-- for desktop !-->
                        <v-row><video ref="video" id="video" width="640" height="480" autoplay></video></v-row>
                        <v-row><canvas ref="canvas" id="canvas" width="640" height="480"></canvas></v-row>
                   </v-row>
                    
       
        <v-card-actions>
            <v-btn small left color="primary" :disabled="isDisabledWebcam" @click.prevent="onUploadWebcam">Add</v-btn>
        </v-card-actions>
                </v-card>
            </v-tab-item>

        </v-tabs-items>

        
    </v-card>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapGetters } from "vuex";
import store from "../store";
import firebase from 'firebase';


export default {
    name: "AddFace",
    data: function() {	  
        return{
            tab: null,
            imageData: null,
            picture: null,
            uploadValue: 0,
            input: {
                name: null
            },

            video: {
                src: ""
            },

            canvas: {},
            captures: "",
            stream: null,
            isMobile: false
        }
    },
     computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    }),
    isDisabledFile(){
        return !this.input.name || !this.imageData
    },
    isDisabledWebcam(){
        return !this.input.name || !this.captures
    },
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
    },
    methods: {
        onResize () {
            this.isMobile = window.innerWidth < 600
        },

        previewImage(event) {
        this.uploadValue=0;
        this.picture=null;
        this.imageData = event.target.files[0];
        },

        getVideoFeed(){
            this.video = this.$refs.video;
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                this.stream=navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                    try {
                        video.srcObject = stream;
                    } catch (error) {
                        this.video.src = window.URL.createObjectURL(stream);
                    }
           
                });
            }
        },
        async onUploadWebcam(){
            this.picture=null;
            var filesArray =fb.db.collection("users").doc(this.user.data.uid);
            var childRef = fb.storageRef.child(this.user.data.uid+"/training/"+this.input.name+".jpg").putString(this.captures.split(',')[1], "base64", {contentType:"image/jpg"});
            await childRef.on(`state_changed`,snapshot=>{
            this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            }, error=>{console.log(error.message)},
            ()=>{this.uploadValue=100;
                childRef.snapshot.ref.getDownloadURL().then((url)=>{

                filesArray.update({
                familiarFaces: firebase.firestore.FieldValue.arrayUnion(this.input.name+".jpg")
                });
                this.input.name=null;
                this.$refs.video.srcObject = null;
                   this.canvas = this.$refs.canvas;
                    const context = this.canvas.getContext('2d');
                    context.clearRect(0, 0, 640, 480);

                this.$emit('addedImage');
                });
            }
            );
            
        },
        async onUploadFile(){
            this.picture=null;
            var filesArray = fb.db.collection("users").doc(this.user.data.uid);

            var childRef = fb.storageRef.child(this.user.data.uid+"/training/"+this.input.name+".jpg").put(this.imageData);
            await childRef.on(`state_changed`,snapshot=>{
            this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            }, error=>{console.log(error.message)},
            ()=>{this.uploadValue=100;
                childRef.snapshot.ref.getDownloadURL().then((url)=>{

                    filesArray.update({
                        familiarFaces: firebase.firestore.FieldValue.arrayUnion(this.input.name+".jpg")
                    });
                    this.input.name=null;
                    this.picture=null;
                    this.$refs.imageUpload.value = null;
                    this.$emit('addedImage');

            });
            }
            );
            
        },
        capture() {
            this.canvas = this.$refs.canvas;
            if(this.isMobile)
                var context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, 320, 240);
            else
                var context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, 640, 480);

            this.captures = (canvas.toDataURL("image/jpeg", 0.8));
        }

    }
}
</script>