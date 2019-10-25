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
    <v-row>
      <v-col sm="4"></v-col>
      <v-col>
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <div class="container">
              <v-row>
                <v-col sm="12">
                  <v-text-field
                    v-model="input.username"
                    :rules="[rules.required]"
                    label="Username"
                    required
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col sm="12">
                  <v-text-field
                    v-model="input.password"
                    :append-icon="show ? 'visibility' : 'visibility_off'"
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
                  <v-btn small left color="primary" :click="login">Submit</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="4"></v-col>
    </v-row>
  </div>
</template>

<script>
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
      }
    };
  },
  methods: {
    login() {}
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