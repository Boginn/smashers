<template>
  <v-app>
    <v-app-bar
      app
      dark
      color="secondary"
    >
    
    <v-toolbar-title>SMASHERS!"#%
     </v-toolbar-title>
      <v-spacer></v-spacer>
          <!-- <router-link to="/Game"><v-tab>New Game</v-tab></router-link> -->


    </v-app-bar>
    <v-main class='body-bg'>
<router-view></router-view>


<v-container>

<welcome v-if="characterSelect" @begin="selectCharacter"/>
<game-main v-if="!characterSelect" @nextStage="updateStage" :toon="pickedCharacter"/>
</v-container>




    </v-main>
  
  </v-app>

</template>

<script>
import Welcome from './views/Welcome.vue';
import GameMain from './components/GameMain'

export default {
  name: 'App',

  components: {
    Welcome,
    GameMain
  },
  computed: {
    
  },

      methods: {
    updateStage (nr) {
      this.stage = nr;
    },
        selectCharacter(selection) {
this.characterSelect = false;
    this.pickedCharacter = selection;
    }

  },


  data: () => ({
    stage: 0,
    characterSelect: true,
    pickedCharacter: null,
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
</style>


