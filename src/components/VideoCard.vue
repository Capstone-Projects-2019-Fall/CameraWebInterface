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
//import videojs from 'video.js';
const fb = require("../firebaseConfig.js");

export default {
	name: "VideoCard",
	data() {
		return {
      videoURL: 'https://firebasestorage.googleapis.com/v0/b/mspi-a4b75.appspot.com/o/videos%2F2019-11-04%2021%3A14%3A24.592645.mp4?alt=media&token=64eeb249-2b27-4e65-9129-1ceeb9606dd3'
		};
  },
   methods: {
    updateVideo: function () {
      var childRef = fb.storageRef.child("videos/2019-11-04 21:37:41.753790.h264");
      console.log(childRef.getDownloadURL().toString());
      return this.videoURL  = childRef.getDownloadURL().toString();
    }
  },
 
};

</script>
