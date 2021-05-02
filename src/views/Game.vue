<template>
        <v-container>
<h1 style="text-align: center" class="white--text"> Stage: {{ stage }}</h1>
        <game-main @nextStage="updateStage" />
      </v-container>
</template>

<script>
import GameMain from '../components/GameMain'

export default {
  components: {
    GameMain
  },
    methods: {
    updateStage (nr) {
      this.stage = nr;
    }
  },

  
  data() {
    return {
      stage: 0,
    };
  },
}
</script>

<style>

</style>
