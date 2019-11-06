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
      <v-toolbar-items>
        <v-btn text
          v-for="(item, i) in nav"
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
            <v-list>
              <v-list-item
                v-for="(item, i) in nav"
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
export default {
  data () {
    return {
      dialog: false,
      nav: [
        {
          text: 'Home',
          route: '/',
          active: true
        },
        {
          text: 'Login',
          route: '/login',
          active: false
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
        }
      ]
    }
  }
}
</script>

