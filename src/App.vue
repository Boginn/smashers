<template>
  <v-app>
    <v-app-bar
      app
      dark
    >
    <v-toolbar-title>SMASHERS!"#%</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>

        <game-main />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import GameMain from './views/GameMain'

export default {
  name: 'App',

  components: {
    GameMain
  },

  data: () => ({
    //
  }),
};
</script>




