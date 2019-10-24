<template>
  <div id="login">
    <h1>Login</h1>
    <input type="text" name="username" v-model="input.username" placeholder="Username" />
    <br>
    <input type="password" name="password" v-model="input.password" placeholder="Password" />
    <br>
    <button class="cyan darken-1" type="button" v-on:click="login()">Login</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      input: {
        username: "",
        password: ""
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