<template>
  <!-- <div id="login">
    <h1>Login</h1>
    <input type="text" name="username" v-model="input.username" placeholder="Username" />
    <br>
    <input type="password" name="password" v-model="input.password" placeholder="Password" />
    <br>
    <button class="cyan darken-1" type="button" v-on:click="login()">Login</button>
  </div>-->
  <div class="container">
    <v-row justify="center">
      <v-spacer></v-spacer>
      <v-col cols="auto" sm="12" md="6" lg="4">
        <v-card>
          <v-card-title>Login</v-card-title>
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
                <v-col offset="0">
                  <v-btn small left color="primary" @click="toSignUp">Sign Up</v-btn>
                </v-col>
                <v-col offset-sm="4">
                  <v-btn small left color="primary" @click="login">Submit</v-btn>
                </v-col>
              </v-row>
              <div v-if="error" class="alert alert-danger">{{error}}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");

export default {
  name: "Login",
  data() {
    return {
      show: false,
      input: {
        username: "",
        password: ""
      },
      rules: {
        required: value => !!value || "Required.",
        emailMatch: () => "The email and password you entered don't match"
      },
      error: null
    };
  },
  methods: {
    login() {
      // console.log('log in button clicked');
      // console.log('email provided: ' + this.input.email);
      fb.auth
        .signInWithEmailAndPassword(this.input.email, this.input.password)
        .then(data => {
          this.$router.replace({ name: "profile" });
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    toSignUp() {
      this.$router.replace({ name: "signup" });
    }
  }
};
</script>

<style scoped>
#login {
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
}
</style>