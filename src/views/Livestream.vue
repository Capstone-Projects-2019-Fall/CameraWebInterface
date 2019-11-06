<template>
  <v-app>
    <v-card class="mx-auto">
      <v-card-title>
        <!-- <v-select :items="items" label="Select Camera" dense outlined></v-select> -->
      </v-card-title>

      <v-card-title class="justify-center">
        <v-card height="600px" width="600px">
          <video id="piVideo" autoplay muted playsinline></video>
          <!-- <v-img src="../assets/mspi.png"
          ></v-img>-->
        </v-card>
      </v-card-title>
      <v-card-actions class="justify-center">
        <v-btn small color="primary" :click="connectToPi()">Start Video Stream</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
const db = require("../firebaseConfig.js").db;

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
    this.pc = new RTCPeerConnection(this.servers);
    this.pc.oniceconnectionstatechange = function() {
      if (this.pc.iceConnectionState == "disconnected") {
        this.hasLocalDesc = false;
        this.hasRemoteDesc = false;

        console.log("Disconnected");
      }
    };

    //Send local ice candidates
    this.pc.onicecandidate = event =>
      event.candidate
        ? sendMessage("iceCandidate", event.candidate)
        : console.log("Sent All Ice");
  },
  mounted: function() {
    if (this.hasUserMedia()) {
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

    //If WebRTC detects a stream added on other side, set video to that stream
    this.pc.onaddstream = event => (piVideo.srcObject = event.stream);
  },
  methods: {
    hasUserMedia: function() {
      //check if the browser supports the WebRTC
      return !!(
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      );
    },
    sendMessage: function(type, data, options = {}) {
      let d = JSON.stringify(data);
      db.collection(this.dbCollection).add({
        sender: this.clientId,
        what: type,
        data: d,
        options: options
      });
    },
    connectToPi: async function() {
      if (!this.hasLocalDesc) {
        await this.pc
          .createOffer()
          .then(offer => this.pc.setLocalDescription(offer))
          .then(() => this.sendMessage("offer", this.pc.localDescription));
        console.log("Sent offer:" + this.pc.localDescription);
        this.hasLocalDesc = true;
      }
    },
    deleteRecord: function(id) {
      //Delete signal so we don't process it again
      db.collection(this.dbCollection)
        .doc(id)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    convertToRTCSessionDescriptionInit: function(data) {
      let cache = {
        type: data.type,
        sdp: data.sdp
      };
      return cache;
    },
    listenIce: function() {
      db.collection(this.dbCollection)
        .where("sender", "==", this.cameraId)
        .onSnapshot(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            let type = doc.data().what;
            let data = JSON.parse(doc.data().data);
            console.log(data);
            if (type == "iceCandidate") {
              //iceCandidates allow NAT Traversal so the PCs can find each other
              this.pc.addIceCandidate(new RTCIceCandidate(data));
              this.deleteRecord(doc.id);
              console.log("Recieved Ice");
            }
            //console.log(`${doc.id} => ${doc.data().what}`);
          });
        });
    }
  }
};
</script>