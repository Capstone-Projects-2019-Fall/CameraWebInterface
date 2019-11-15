import Vue from "vue";
import Vuex from "vuex";
const db = require("firebaseConfig.js").db;

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null,
      cameras: null
    }
  },
  getters: {
    user(state){
      return state.user;
    },
    cameras(state){
      return state.user.data.cameraIds;
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;

      await db.collection("users")
        .where("iserId", "==", state.user.data.uid)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            state.user.cameras = doc.data().cameraIds;
          });
        })
        .catch(function(error) {
          console.log("Error getting user: ", error);
        });
    }
  },
  actions: {
    fetchUser({ commit }, user) {
      // console.log(user);
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email
        });
      } else {
        commit("SET_USER", null);
      }
    }
  }
});