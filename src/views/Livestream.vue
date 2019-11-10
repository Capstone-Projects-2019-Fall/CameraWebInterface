<template>
  <v-app>
    <v-card class="mx-auto">
      <v-card-title>
        <!-- <v-select :items="items" label="Select Camera" dense outlined></v-select> -->
      </v-card-title>

      <v-card-title class="justify-center">
        <v-card width="600px">
          <video id="piVideo" class="livestream" autoplay muted playsinline></video>
          <!-- <v-img src="../assets/mspi.png"
          ></v-img>-->
        </v-card>
      </v-card-title>
      <v-card-actions class="justify-center">
        <!-- <v-btn small color="primary" :click="connectToPi()">Start Video Stream</v-btn> -->
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<style>
.livestream {
  min-width: 100%;
  max-width: 100%;
}
</style>

<script>
const db = require("../firebaseConfig.js").db;

//TODO: Implement lock mechanism so one account on multiple pcs can't access

export default {
  data() {
    return {
      items: ["Test"],
      clientId: "TestClient1",
      cameraId: "Pi1",
      hasLocalDesc: false,
      hasRemoteDesc: false,
      servers: {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302"
          },
          {
            urls: "stun:stun.services.mozilla.com"
          },
          {
            urls: "turn:numb.viagenie.ca",
            credential: "charlietheunicorn",
            username: "mspi.temple@gmail.com"
          }
        ]
      },
      pc: null,
      cameraListener: null,
      iceListener: null,
      dbCollection: "webrtctest"
    };
  },
  created: function() {
    this.cleanUp();
    this.pc = new RTCPeerConnection(this.servers);
    this.pc.oniceconnectionstatechange = () => {
      if (this.pc.iceConnectionState == "disconnected") {
        this.hasLocalDesc = false;
        this.hasRemoteDesc = false;

        console.log("Disconnected");
      }
    };

    //Send local ice candidates
    this.pc.onicecandidate = event =>
      event.candidate
        ? this.sendMessage("iceCandidate", event.candidate)
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
        stream => {
          // myVideo.srcObject = stream;
          this.pc.addStream(stream);
        },
        function(err) {}
      );
    } else {
      alert("WebRTC is not supported");
    }

    //If WebRTC detects a stream added on other side, set video to that stream
    this.pc.onaddstream = event =>
      (document.getElementById("piVideo").srcObject = event.stream);
    this.listen();
  },
  beforeDestroy: function() {
    //Remove all remaining traces of this client sending signal
    //Only works if view is destroyed, which doesn't include webpage exit
    this.cleanUp();
    //this.$emit('hangup');
    if (this.cameraListener !== null) {
      this.cameraListener();
    }
    if (this.iceListener !== null) {
      this.iceListener();
    }

    this.sendMessage("hangup");
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
    sendMessage: function(type, data = "", options = {}) {
      let d = JSON.stringify(data);
      db.collection(this.dbCollection).add({
        sender: this.clientId,
        what: type,
        data: d,
        options: options
      });
    },
    cleanUp: function() {
      db.collection(this.dbCollection)
        .where("sender", "==", this.clientId)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          });
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
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
      console.log(this.pc.connectionState);
      console.log("Listening for ice");
      this.iceListener = db
        .collection(this.dbCollection)
        .where("sender", "==", this.cameraId)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
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
    },
    listen: function() {
      this.cameraListener = db
        .collection(this.dbCollection)
        .where("sender", "==", this.cameraId)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.getCalls(doc);
          });
        });
    },
    getCalls: function(doc) {
      let type = doc.data().what;
      let data = JSON.parse(doc.data().data);
      //console.log(data);
      //Searches for offer from camera
      if (type == "offer" && !this.hasLocalDesc && !this.hasRemoteDesc) {
        data.type = type;
        data = this.convertToRTCSessionDescriptionInit(data);
        console.log(data);
        //If recieving an offer, set it as remote "address" for WebRTC and send an answer
        this.pc
          .setRemoteDescription(new RTCSessionDescription(data))
          .then(() => this.pc.createAnswer())
          //Set local "address" as the answer we just created
          .then(answer => this.pc.setLocalDescription(answer))
          .then(() => this.sendMessage("answer", this.pc.localDescription));
        this.deleteRecord(doc.id);
        this.hasLocalDesc = true;
        this.hasRemoteDesc = true;
        console.log("Recieved offer, sent answer");
        this.listenIce();
      }
      //console.log(`${doc.id} => ${doc.data().what}`);
    }
  }
};
</script>