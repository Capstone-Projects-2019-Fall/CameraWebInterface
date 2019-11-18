<template>
  <div id="navbar">

    <!-- Desktop navigation bar -->
    <v-toolbar class="cyan darken-1 hidden-xs-only">
      <v-toolbar-title class="font-weight-black">  <v-img
      src="../assets/mspi.png"
      aspect-ratio="1"
      max-height="30px"
      contain
      ></v-img>MSPi</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="user.loggedIn"> <!-- if user is logged in !-->
        <v-btn text
          v-for="(item, i) in navLoggedIn"
            :key="i"
            :to = "item.route"
            > {{item.text}} </v-btn>
        
        <v-btn text v-if="user.loggedIn" @click="signOut">Sign Out</v-btn>
      </v-toolbar-items>

       <v-toolbar-items v-else> <!-- if user is not logged in !-->
        <v-btn text
          v-for="(item, i) in navLoggedOut"
            :key="i"
            :to = "item.route"
            > {{item.text}} </v-btn>
        </v-toolbar-items>
    </v-toolbar>
    

    <!-- Mobile navigation bar -->
     <v-toolbar class="hidden-sm-and-up cyan darken-1">
        <v-toolbar-title class="font-weight-black">  <v-img
      src="../assets/mspi.png"
      aspect-ratio="1"
      max-height="30px"
      contain
      ></v-img>MSPi</v-toolbar-title>
        <v-spacer></v-spacer>
          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn
                dark
                icon
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
              <v-list v-if="user.loggedIn">
              <v-list-item
                v-for="(item, i) in navLoggedIn"
                :key="i"
                :to="item.route"
              >
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>

             <v-list v-else>
              <v-list-item
                v-for="(item, i) in navLoggedOut"
                :key="i"
                :to="item.route"
              >
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
            
          </v-menu>

      </v-toolbar>
      
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const fb = require("../firebaseConfig.js");

export default {
  data () {
    return {
      dialog: false,
      navLoggedIn: [
        {
          text: 'Home',
          route: '/',
          active: true
        },
        {
          text: 'Live Video Stream',
          route: '/livestream',
          active: false
        },
        {
          text: 'Notifications',
          route: '/notifications',
          active: false
        },
         {
          text: 'Training',
          route: '/training',
          active: false
        },
        {
          text: 'Profile',
          route: '/profile',
          active: false
        },

      ],
      navLoggedOut: [
          {
          text: 'Home',
          route: '/',
          active: true
        },
        {
          text: 'Login',
          route: '/login',
          active: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
// map `this.user` to `this.$store.getters.user`
      user: "user"
    })
  },
  methods: {
    signOut() {
      fb.auth
        .signOut()
        .then(() => {
          this.$router.replace({
            name: "home"
          });
        });
    }
  }
}
</script>

