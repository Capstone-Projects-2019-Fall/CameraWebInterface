<template>
  <v-footer
    color="cyan darken-1"
    padless
  >
    <v-card-text class="py-2 white--text text-center">
        {{ new Date().getFullYear() }} — <strong>MSPi</strong>
      </v-card-text>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      links: [
        'Home',
        'About Us',
        'Team',
        'Services',
        'Blog',
        'Contact Us',
      ],
    }),
  }
</script>