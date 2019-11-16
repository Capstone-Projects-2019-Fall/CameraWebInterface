<template>
  <v-app>
    <v-card class="mx-auto">
      <v-card-title>
        <v-select
          v-model="cameraId"
          :items="$store.getters.cameraIds"
          menu-props="auto"
          label="Select Camera"
          hide-details
          prepend-icon="mdi-camera"
          single-line
        ></v-select>
      </v-card-title>

      <v-card-title class="justify-center">
        <v-card width="600px">
          <video id="piVideo" class="livestream" autoplay muted playsinline></video>
          <!-- <v-img src="../assets/mspi.png"
          ></v-img>-->
        </v-card>
      </v-card-title>
      <v-card-subtitle>
        <v-text-field type="password" v-model="password"></v-text-field>
      </v-card-subtitle>
      <v-card-actions class="justify-center">
        <v-btn
          v-if="!isStreaming"
          small
          color="primary"
          @click="listenPi(); loading = true;"
          :loading="loading"
          :disabled="(loading || passlock)"
        >Start Video Stream</v-btn>
        <v-btn v-else small color="error" @click="hangup()">Hang Up</v-btn>
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
import store from "../store";

//TODO: Implement lock mechanism so one account on multiple pcs can't access

export default {
  data() {
    return {
      loading: false,
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
      dbCollection: "webrtctest",
      isStreaming: false,
      password: "",
      passlock: true,
      audioStream: null
    };
  },
  created: function() {
    this.cleanUp();
  },
  mounted: function() {
    this.pc = new RTCPeerConnection(this.servers);
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
          this.audioStream = stream;
          this.pc.addStream(stream);
        },
        function(err) {}
      );
    } else {
      alert("WebRTC is not supported");
    }

    this.setListeners();
  },
  beforeDestroy: function() {
    //Remove all remaining traces of this client sending signal
    //Only works if view is destroyed, which doesn't include webpage exit
    this.hangup();
  },
  methods: {
    hangup: async function() {
      if (document.getElementById("piVideo") !== null) {
        document.getElementById("piVideo").srcObject = null;
      }
      await this.cleanUp();

      this.pc = new RTCPeerConnection(this.servers);
      this.setListeners();

      if (this.audioStream !== null) {
        this.pc.addStream(this.audioStream);
      }

      if (this.cameraListener !== null) {
        console.log("Turning off camera listener");
        await this.cameraListener();
      }
      if (this.iceListener !== null) {
        console.log("Turning off ice listener");
        await this.iceListener();
      }

      await this.sendMessage("hangup");

      this.hasLocalDesc = false;
      this.hasRemoteDesc = false;

      this.isStreaming = false;
    },
    setListeners: function() {
      this.pc.oniceconnectionstatechange = () => {
        if (this.pc.iceConnectionState == "disconnected") {
          // this.hasLocalDesc = false;
          // this.hasRemoteDesc = false;
          // this.hangup();
          console.log("Disconnected");
        }
      };
      //Send local ice candidates
      this.pc.onicecandidate = event =>
        event.candidate
          ? this.sendMessage("iceCandidate", event.candidate)
          : console.log("Sent All Ice");

      //If WebRTC detects a stream added on other side, set video to that stream
      this.pc.onaddstream = event => {
        console.log("Stream added");
        document.getElementById("piVideo").srcObject = event.stream;
        this.isStreaming = true;
        this.loading = false;
      };
    },
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
    cleanUp: async function() {
      await db
        .collection(this.dbCollection)
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
    listenPi: function() {
      console.log("ListenPi function fired");

      //Checking if the camera is unlock in database (valid to be used for webrtc)
      db.collection(this.dbCollection)
        .where("sender", "==", this.cameraId)
        .where("what", "==", "unlock")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (doc.exists) {
              //alert("Doc exists");
              this.deleteRecord(doc.id);
              this.sendMessage("lock", this.cameraId);
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
              alert("Camera currently not online");
              this.loading = false;
              return;
            }
          });
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });

      this.cameraListener = db
        .collection(this.dbCollection)
        .where("sender", "==", this.cameraId)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.getCalls(doc);
          });
        });
    },
    getCalls: async function(doc) {
      let type = doc.data().what;
      let data = JSON.parse(doc.data().data);
      //console.log(data);
      //Searches for offer from camera
      if (type == "offer" && !this.hasLocalDesc && !this.hasRemoteDesc) {
        data.type = type;
        data = this.convertToRTCSessionDescriptionInit(data);
        console.log(data);
        //If recieving an offer, set it as remote "address" for WebRTC and send an answer
        await this.pc
          .setRemoteDescription(new RTCSessionDescription(data))
          .then(() => this.pc.createAnswer())
          //Set local "address" as the answer we just created
          .then(answer => this.pc.setLocalDescription(answer))
          .then(() => this.sendMessage("answer", this.pc.localDescription))
          .then(() => {
            this.hasLocalDesc = true;
            this.hasRemoteDesc = true;
          })
          .then(() => this.deleteRecord(doc.id))
          .then(() => this.listenIce());
        console.log("Recieved offer, sent answer");
      }
      //console.log(`${doc.id} => ${doc.data().what}`);
    }
  },
  watch: {
    password: function() {
      var MD5 = function(d){var result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
      console.log(MD5(this.password));
      if (MD5(this.password) == "bf779e0933a882808585d19455cd7937") {
        this.passlock = false;
      } else {
        this.passlock = true;
      }
    }
  }
};
</script>