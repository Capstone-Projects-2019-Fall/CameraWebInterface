<template>
  <div>
      <div v-if="videoURL === ''">
          <v-img :src="imageURL"/>
      </div>
      <div v-else>
        <video v-if="isMobile" ref="vid" id="myVideo" controls type="video/mp4" width="200" :src = "videoURL">
          Sorry, your browser doesn't support embedded videos.
        </video>
          <video v-else ref="vid" id="myVideo" controls type="video/mp4" width="800" :src = "videoURL">
          Sorry, your browser doesn't support embedded videos.
        </video>
      </div>
	</div>
</template>

<script>
import { async } from 'q';
const fb = require("../firebaseConfig.js");
import { mapGetters } from "vuex";
import store from "../store";

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
      videoURL: '',
      isMobile: false
		};
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  methods: {
    onResize () {
      this.isMobile = window.innerWidth < 600
        },
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
        let folder = this.user.data.uid+"/videos/";
        let extension = ".mp4";
        let videoName =  this.name.substring(0, this.name.length - 4);
        let videoAddress ="";
        videoAddress = videoAddress.concat(folder, videoName, extension);
        console.log(videoAddress);
        return videoAddress;
    }
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  async created () {
    await this.updateVideo();
    if(this.videoURL != "")
      this.changeRate(0.3);
    //console.log(this.videoURL);
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  }
  
};

</script>
