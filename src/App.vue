<template>
  <v-app>
    <v-app-bar app dark color="teal">
      <v-toolbar-title>SMASHERS!"#% </v-toolbar-title>
      <v-spacer></v-spacer>
      <h1 v-if="!characterSelect" style="text-align: center" class="white--text fontshadow"> Stage: {{ stage }}</h1>
      <v-spacer></v-spacer>
      <router-link to="/#"><v-tab class="white--text">New Game</v-tab></router-link>
      <router-link to="/Help"><v-tab class="white--text">Help</v-tab></router-link>
    </v-app-bar>
    <v-main class="body-bg">
      <router-view></router-view>

      <v-container>
        <win v-if="gameWon" :toon="pickedCharacter"/>
        <welcome v-if="characterSelect && !gameWon" @begin="selectCharacter" />
        <game-main
          v-if="!characterSelect && !gameWon"
          @nextStage="updateStage"
          :gameWon="gameWon"
          :toon="pickedCharacter"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Welcome from "./views/Welcome.vue";
import GameMain from "./components/GameMain";
import Win from "./views/Win";

export default {
  name: "App",

  components: {
    Welcome,
    GameMain,
    Win
  },
  computed: {},

  methods: {
    updateStage(nr) {
      this.stage = nr;
    },
    selectCharacter(selection) {
      this.characterSelect = false;
      this.pickedCharacter = selection;
    },
  },

  data: () => ({
    stage: 0,
    characterSelect: true,
    pickedCharacter: null,
    gameWon: false,
  }),
};
</script>

<style>
.body-bg {
  background-color: rgb(44, 68, 99);
  background: rgb(44, 68, 99);
}

.highlight-bg {
  background-color: rgba(89, 113, 145, 0.849);
}

.panel-bg {
  background-color: rgba(28, 58, 97, 0.849);
  background: rgba(28, 58, 97, 0.849);
}
.white--text {
  color: grey;
}
</style>
