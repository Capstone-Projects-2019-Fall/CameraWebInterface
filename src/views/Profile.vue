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
          <!-- <v-btn small left color="primary" @click="getUserCameraIds">Submit</v-btn> -->
          <v-card-text>
            <v-row v-for="(camera, index) in userCameras" :key="index">
              <v-col sm="2">
                <v-card-text>Camera:</v-card-text>
              </v-col>
              <v-col sm="8">
                <v-text-field :label="camera" :disabled="true" dense></v-text-field>
              </v-col>
              <v-col>
                <v-btn small left color="primary" @click="deleteUserCamera(index)">Delete</v-btn>
              </v-col>
            </v-row>
            <v-row v-if="addCameraClicked">
              <v-col sm="2">
                <v-card-text>Camera:</v-card-text>
              </v-col>
              <v-col sm="8">
                <v-text-field 
                  v-model="input.cameraId" 
                  :rules="[rules.cameraId]"
                  label="Camera Id" dense></v-text-field>
              </v-col>
              <v-col>
                <v-btn small left color="primary" @click="addUserCamera">Add</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col offset-sm="8">
                <v-btn
                  small
                  left
                  color="primary"
                  @click="addCameraClicked = !addCameraClicked"
                >Add Camera</v-btn>
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
      rules: {
        cameraId: value => {
          if(value.length < 5 || !(/^\d+$/.test(value))) {
            return "Camera Id must be at least 5 digits";
          }
          return true;
        }
      },
      userCameras: [],
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
      this.getUserCameraIds();
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
          // Update the record in the database
          // Create a reference to the db doc.
          var docRef = fb.db.collection("users").doc(this.user.data.uid);

          fb.db
            .runTransaction(function(transaction) {
              return transaction.get(docRef).then(function(doc) {
                if (!doc.exists) {
                  throw "Updating email. User document does not exist.";
                }

                transaction.update(docRef, { email: newEmail });
                return newEmail;
              });
            })
            .then(function(newEmail) {
              console.log("Updating email. Email changed in db to ", newEmail);
            })
            .catch(function(err) {
              console.error(err);
            });

          console.log("Updating email. Email change succeeded");

          store.dispatch("fetchUser", fbUser);

          this.disableEditEmail = !this.disableEditEmail;
          this.error = "Email successfully changed!";
        })
        .catch(err => {
          console.log("Updating email. Email change failed");
          this.error = err.message;
        });
    },
    async getUserCameraIds() {
      var docRef = fb.db.collection("users").doc(this.user.data.uid);
      var temp = [];

      await docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            // console.log(doc.data().cameraIds);
            temp = doc.data().cameraIds;
          } else {
            // doc.data() will be undefined in this case
            console.log("Getting camera ids. No such document!");
          }
        })
        .catch(function(error) {
          console.log("Getting camera ids. Error getting document:", error);
        });

      this.userCameras = temp;
    },
    addUserCamera() {
      var userId = this.user.data.uid;
      var temp = this.userCameras;
      var cameraIdToAdd = this.input.cameraId;

      var userDocRef = fb.db.collection("users").doc(userId);
      var cameraDocRef = fb.db.collection("cameras").doc(cameraIdToAdd);

      cameraDocRef
        .get()
        .then(doc => {
          if (doc.exists) {
            if (doc.data().user !== "") {
              
              // this.error2 = "This camera is already registered to an account.";
              throw "This camera is already registered to an account.";

            } else if (doc.data().user === "") {
              //set uid
              //add camera to user account
              fb.db
                .runTransaction(transaction => {
                  return transaction.get(cameraDocRef).then(function(doc) {
                    if (!doc.exists) {
                      throw "Adding camera. Document does not exist!";
                    }
                    transaction.update(cameraDocRef, { user: userId });
                  });
                })
                .then(() => {
                  console.log("Adding camera. Camera successfully reassigned to user.");
                })
                .catch(err => {
                  console.error(err);
                  this.error2 = err.message;
                });
            }
          } else {
            // doc.data() will be undefined in this case
            // Add a new document in collection "cameras"
            fb.db
              .collection("cameras")
              .doc(cameraIdToAdd)
              .set({
                active: false,
                ready: false,
                user: userId
              })
              .then(function() {
                console.log("Adding camera. Camera document successfully written!");
              })
              .catch(function(error) {
                console.error("Adding camera. Error writing camera document: ", error);
                this.error2 = error.message;
              });
          }
          fb.db
            .runTransaction(transaction => {
              return transaction.get(userDocRef).then(function(doc) {
                if (!doc.exists) {
                  throw "Adding camera. Document does not exist!";
                }
                temp.push(cameraIdToAdd);
                transaction.update(userDocRef, { cameraIds: temp });
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
        })
        .catch(error => {
          console.log("Adding camera. Error getting camera document:", error);
          this.error2 = error;
        });
    },
    deleteUserCamera(index) {
      
      var temp = this.userCameras;
      var cameraIdToDelete = temp[index];

      var userDocRef = fb.db.collection("users").doc(this.user.data.uid);
      var cameraDocRef = fb.db.collection("cameras").doc(cameraIdToDelete);

      fb.db
        .runTransaction(transaction => {
          return transaction.get(cameraDocRef).then(function(doc) {
            if (!doc.exists) {
              throw "Deleting camera. Document does not exist!";
            }
            transaction.update(cameraDocRef, { user: "" });
          });
        })
        .then(() => {
          console.log("Deleting camera. Camera successfully reassigned from user");
          fb.db
            .runTransaction(transaction => {
              return transaction.get(userDocRef).then(function(doc) {
                if (!doc.exists) {
                  throw "Deleting camera. Document does not exist!";
                }
                temp.splice(index, 1);
                transaction.update(userDocRef, { cameraIds: temp });
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
        })
        .catch(err => {
          console.error(err);
          this.error2 = err.message;
        });
    }
  }
};
</script>