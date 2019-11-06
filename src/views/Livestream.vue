<template>
  <v-app>
    <v-card class="mx-auto">
      <v-card-title>
        <v-select :items="items" label="Select Camera" dense outlined></v-select>
      </v-card-title>

      <v-card-title class="justify-center">
        <v-card height="600px" width="600px">
          <video id="piVideo" autoplay muted playsinline></video>
          <!-- <v-img src="../assets/mspi.png"
          ></v-img>-->
        </v-card>
      </v-card-title>
      <v-card-actions class="justify-center">
        <v-btn small color="primary">Start Video Stream</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      items: ["Test"],
      clientId: "TestClinet1",
      cameraId: "Pi1",
      hasLocalDesc: false,
      hasRemoteDesc: false,
      servers: {
        iceServers: [
          {
            urls: "stun:stun.services.mozilla.com"
          },
          {
            urls: "stun:stun.l.google.com:19302"
          },
          {
            urls: "turn:numb.viagenie.ca",
            credential: "charlietheunicorn",
            username: "mspi.temple@gmail.com"
          }
        ]
      },
      pc: "",
      dbCollection: "webrtctest"
    };
  },
  created: function() {
    pc = new RTCPeerConnection(this.servers);
    pc.oniceconnectionstatechange = function() {
      if (pc.iceConnectionState == "disconnected") {
        hasLocalDesc = false;
        hasRemoteDesc = false;

        console.log("Disconnected");
      }
    };

    //Send local ice candidates
    pc.onicecandidate = event =>
      event.candidate
        ? sendMessage("iceCandidate", event.candidate)
        : console.log("Sent All Ice");
    //If WebRTC detects a stream added on other side, set video to that stream
    pc.onaddstream = event => (piVideo.srcObject = event.stream);

    if (hasUserMedia()) {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      //enabling video and audio channels
      navigator.getUserMedia(
        {
          video: false,
          audio: true
        },
        function(stream) {
          // myVideo.srcObject = stream;
          // pc.addStream(stream);
        },
        function(err) {}
      );
    } else {
      alert("WebRTC is not supported");
    }
  },
  methods: {
    hasUserMedia: function() {
      //check if the browser supports the WebRTC
      return !!(
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      );
    }
  }
};
</script>