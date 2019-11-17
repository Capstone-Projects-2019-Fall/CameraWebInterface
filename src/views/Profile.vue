<template>
  <div class="container">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Profile</v-card-title>
          <v-card-text>
            <div class="container">
              <v-row>
                <v-col sm="2">
                  <v-card-text>Email:</v-card-text>
                </v-col>
                <v-col sm="8">
                  <v-text-field
                    v-model="input.email"
                    :label="user.data.email"
                    required
                    :disabled="disableEditEmail"
                    dense
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-btn small left color="primary" @click="editEmail">Edit</v-btn>
                </v-col>
              </v-row>
              <!-- <v-row>
                <v-col sm="12">
                  <v-text-field
                    v-model="input.password"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required]"
                    :type="show ? 'text' : 'password'"
                    label="Password"
                    @click:append="show = !show"
                    required
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>-->
              <v-row>
                <v-col offset-sm="8">
                  <v-btn small left color="primary" @click="updateEmail">Submit</v-btn>
                </v-col>
              </v-row>
              <div v-if="error" class="alert alert-danger">{{error}}</div>
            </div>
          </v-card-text>
        </v-card>
        <br />
        <v-card>
          <v-card-title>Cameras</v-card-title>
          <!-- <v-btn small left color="primary" @click="getCameraIds">Submit</v-btn> -->
          <v-card-text>
            <v-row v-for="(camera, index) in cameras" :key="index">
              <v-col sm="2">
                <v-card-text>Camera:</v-card-text>
              </v-col>
              <v-col sm="8">
                <v-text-field :label="camera" :disabled="true" dense></v-text-field>
              </v-col>
              <v-col>
                <v-btn small left color="primary" @click="deleteCamera(index)">Delete</v-btn>
              </v-col>
            </v-row>
            <v-row v-if="addCameraClicked">
              <v-col sm="2">
                <v-card-text>Camera:</v-card-text>
              </v-col>
              <v-col sm="8">
                <v-text-field v-model="input.cameraId" label="Camera Id" dense></v-text-field>
              </v-col>
              <v-col>
                <v-btn small left color="primary" @click="addCamera">Add</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col offset-sm="8">
                <v-btn small left color="primary" @click="addCameraClicked = !addCameraClicked">Add Camera</v-btn>
              </v-col>
            </v-row>
            <div v-if="error2" class="alert alert-danger">{{error2}}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "../store";
const fb = require("../firebaseConfig.js");

export default {
  data() {
    return {
      disableEditEmail: true,
      addCameraClicked: false,
      input: {
        email: "",
        cameraId: ""
      },
      cameras: [],
      error: null,
      error2: null
    };
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getCameraIds();
    });
  },
  methods: {
    editEmail() {
      this.disableEditEmail = !this.disableEditEmail;
    },
    updateEmail() {
      var fbUser = fb.auth.currentUser;
      var newEmail = this.input.email;

      fbUser
        .updateEmail(this.input.email)
        .then(() => {
          // Update successful.
          // Now update the record in the database
          // Create a reference to the db doc.
          var docRef = fb.db.collection("users").doc(this.user.data.uid);

          fb.db
            .runTransaction(function(transaction) {
              return transaction.get(docRef).then(function(doc) {
                if (!doc.exists) {
                  throw "Document does not exist!";
                }

                transaction.update(docRef, { email: newEmail });
                return newEmail;
              });
            })
            .then(function(newEmail) {
              console.log("email changed in db to ", newEmail);
            })
            .catch(function(err) {
              console.error(err);
            });

          console.log("email change succeeded");
          store.dispatch("fetchUser", fbUser);

          this.disableEditEmail = !this.disableEditEmail;
          this.error = "Email successfully changed!";
        })
        .catch(err => {
          console.log("email change failed");
          this.error = err.message;
        });
    },
    async getCameraIds() {
      var docRef = fb.db.collection("users").doc(this.user.data.uid);
      var temp = [];

      await docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            // console.log(doc.data().cameraIds);
            temp = doc.data().cameraIds;
            // console.log(temp);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });

      this.cameras = temp;
      // console.log(this.cameras);
    },
    addCamera() {
      var docRef = fb.db.collection("users").doc(this.user.data.uid);
      var temp = this.cameras;
      var tempId = this.input.cameraId;
      fb.db
        .runTransaction(transaction => {
          return transaction.get(docRef).then(function(doc) {
            if (!doc.exists) {
              throw "Document does not exist!";
            }
            temp.push(tempId);
            transaction.update(docRef, { cameraIds: temp });
          });
        })
        .then(() => {
          this.addCameraClicked = false;
          this.input.cameraId = "";
          console.log("Camera successfully added");
          this.error2 = "Camera successfully added!";
        })
        .catch(err => {
          console.error(err);
          this.error2 = err.message;
        });
    },
    deleteCamera(index) {
      var docRef = fb.db.collection("users").doc(this.user.data.uid);
      var temp = this.cameras;
      fb.db
        .runTransaction(transaction => {
          return transaction.get(docRef).then(function(doc) {
            if (!doc.exists) {
              throw "Document does not exist!";
            }
            temp.splice(index, 1);
            transaction.update(docRef, { cameraIds: temp });
          });
        })
        .then(() => {
          console.log("Camera successfully deleted");
          this.error2 = "Camera successfully deleted!";
        })
        .catch(err => {
          console.error(err);
          this.error2 = err.message;
        });
    }
  }
};
</script>