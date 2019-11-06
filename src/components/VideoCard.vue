<template>
  <div>
        <video controls width="800">

          <source v-bind:src="videoURL"
            type="video/mp4">
         
         Sorry, your browser doesn't support embedded videos.
        </video>
	</div>
</template>

<script>
import { async } from 'q';

const fb = require("../firebaseConfig.js");

export default {
	name: "VideoCard",
	data() {
		return {
      videoURL: ''
		};
  },

   methods: {
    updateVideo: async function () {
      var childRef = fb.storageRef.child("videos/2019-11-05 19:41:24.735057.mp4");
      await childRef.getDownloadURL()
              .then(async fileURL => {
                this.videoURL =  fileURL.toString();
                console.log(this.videoURL);
              })
    }
  },
  async created () {
    await this.updateVideo();
    console.log(this.videoURL);
  }
};

</script>
