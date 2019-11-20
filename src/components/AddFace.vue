<template>
    <v-card>
        <v-card-title>Add New - Enter Name</v-card-title>
        <v-text-field 
            v-model="input.name"
            :rules="['Required']">
                Name
              </v-text-field>

        <v-tabs
            v-model="tab"
            background-color="deep-purple accent-4"
            centered
            dark
            icons-and-text
        >
            <v-tabs-slider></v-tabs-slider>

            <v-tab href="#tab-1">
                Upload
                <v-icon>mdi-phone</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
                Take a picture
                <v-icon>mdi-heart</v-icon>
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <v-tab-item :value="'tab-1'">
                <v-card flat>
                    <v-row >
                        Upload an image:
                    </v-row>
                    <v-row>
                        <input type="file" @change="previewImage" accept="image/jpeg" >
                    </v-row>
                    <v-row>
                        <v-progress-linear
                            v-model="uploadValue"
                            color="indigo darken-2"
                        ></v-progress-linear>
                    </v-row>
                    <v-row v-if="imageData!=null">
                        <img class="preview" :src="picture">
                        <br>
                    </v-row>
                </v-card>
            </v-tab-item>
            <v-tab-item :value="'tab-2'">
                <v-card flat>
                   <div><video ref="video" id="video" width="640" height="480" autoplay></video></div>
        <div><button id="snap" v-on:click="capture()">Snap Photo</button></div>
        <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
        <ul>
           
        </ul>
                </v-card>
            </v-tab-item>

        </v-tabs-items>

        <v-card-actions>
            <v-btn small left color="primary" :disabled="!input.name" @click.prevent="onUpload">Add</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapGetters } from "vuex";
import store from "../store";

export default {
    name: "AddFace",
    data: function() {	  
        return{
            tab: null,
            imageData: null,
            picture: null,
            uploadValue: 0,
            input: {
                name: "",
            },
                video: {},
                canvas: {},
                captures: []
        }
    },
     computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
    },
mounted() {
    this.video = this.$refs.video;
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            this.video.src = window.URL.createObjectURL(stream);
            this.video.play();
        });
    }
},
    methods: {
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
            this.dialog = false;
            this.input.name="";
            });
            }
            );
        },
        capture() {
        this.canvas = this.$refs.canvas;
        var context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, 640, 480);
        this.captures.push(canvas.toDataURL("image/png"));
    }

    }
}
</script>