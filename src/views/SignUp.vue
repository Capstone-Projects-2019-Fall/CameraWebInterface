<template>
  <div class="container">
    <v-row>
      <v-col sm="4"></v-col>
      <v-col>
        <v-card>
          <v-card-title>Sign Up</v-card-title>
          <v-card-text>
            <div class="container">
              <v-row>
                <v-col sm="12">
                  <v-text-field
                    v-model="input.email"
                    :rules="[rules.required]"
                    label="Email"
                    required
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
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
              </v-row>
              <v-row>
                <v-col offset-sm="8">
                  <v-btn small left color="primary" @click="createUser">Submit</v-btn>
                </v-col>
              </v-row>
              <div v-if="error" class="alert alert-danger">{{error}}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="4"></v-col>
    </v-row>
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");

export default {
  name: "SignUp",
  data() {
    return {
      show: false,
      input: {
        username: "",
        password: ""
      },
      rules: {
        required: value => !!value || "Required."
      },
      error: null
    };
  },
  methods: {
    createUser() {
      // console.log('log in button clicked');
      // console.log('email provided: ' + this.input.email);
      fb.auth
        .createUserWithEmailAndPassword(this.input.email, this.input.password)
        .then(data => {
          // console.log(data.user.uid);

          // Add a new document in collection "users"
          fb.db
            .collection("users")
            .doc(data.user.uid)
            .set({
              email: data.user.email,
              cameraIds: []
            })
            .then(function() {
              console.log("User document successfully written!");
            })
            .catch(function(error) {
              console.error("Error writing user document: ", error);
            });

          this.$router.replace({ name: "profile" });
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  }
};
</script>

<style scoped>
/* #login {
  width: 500px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: auto;
  margin-top: 200px;
  padding: 20px;
}
input {
  border: 1px solid #cccccc;
  padding-left: 3px;
  margin-bottom: 5px;
}
button {
  border: 1px solid #cccccc;
  padding-left: 3px;
  padding-right: 3px;
} */
</style>