<template>
  <v-app>
    <v-app-bar
      app
      dark
      prominent
    >
    
    <v-toolbar-title class="ml-15">SMASHERS!"#% 
     <div class="subheading">Stage: {{stage}}</div>
     </v-toolbar-title>
     


    </v-app-bar>
    <v-main class='body-bg'>
      <v-container>

        <game-main @nextStage="updateStage" />
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
  methods: {
    updateStage (nr) {
      this.stage = nr;
    }
  },

  data: () => ({
    stage: 0,
  }),
};
</script>

<style>

.body-bg {
  background-color: rgb(44, 68, 99);
  background: rgb(44, 68, 99);
  }
.combatlog-bg {
  background-color: rgb(22, 92, 138);
}
.toon-bg {
  background-color: rgb(0, 110, 86)
}

.monster-bg {
  background-color: rgba(0, 73, 182, 0.925);
  background: rgba(0, 73, 182, 0.925);
}

.text-bg {
  background-color: rgba(102, 128, 163, 0.774);
}
  .defend-bg {
    background-color: rgba(49, 91, 146, 0.877);
  }
  .attack-bg {
    background-color: rgba(105, 15, 15, 0.884);
  }

    .highlight-bg {
  background-color: rgba(89, 113, 145, 0.849);
}
</style>


