<template>
  <div>
      <div v-if="videoURL === ''">
          <v-img :src="imageURL"/>
      </div>
      <div v-else>
        <video ref="vid" id="myVideo" controls type="video/mp4" width="800" :src = "videoURL">
          Sorry, your browser doesn't support embedded videos.
        </video>
      </div>
	</div>
</template>

<script>
import { async } from 'q';
const fb = require("../firebaseConfig.js");

export default {
  name: "VideoCard",
  props: {
    name: {
      type: String,
      default: ""
    },
    imageURL: {
      type: String,
      default: ""
    }
  },
	data() {
		return {
      videoURL: ''
		};
  },

   methods: {
    changeRate(rate) {
    this.$refs.vid.playbackRate = rate;
    },
    updateVideo: async function () {
     
      var childRef = fb.storageRef.child(this.getVideoName(this.name));
      await childRef.getDownloadURL()
              .then(async fileURL => {
                this.videoURL =  fileURL.toString();
                ///console.log(this.videoURL);
              }).catch(function(error) {
                // Handle any errors
              });
    },
    getVideoName: function(name) {
        let folder = "videos/";
        let extension = ".mp4";
        let videoName =  this.name.substring(0, this.name.length - 4);
        let videoAddress ="";
        videoAddress = videoAddress.concat(folder, videoName, extension);
        console.log(videoAddress);
        return videoAddress;
    }
  },
  async created () {
    await this.updateVideo();
    if(this.videoURL != "")
      this.changeRate(0.3);
    //console.log(this.videoURL);
  },
  mounted () {
    //this.test();
  }
};

</script>
