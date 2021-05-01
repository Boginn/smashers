<template>
  <v-container>
<v-card min-height="75" >
      <v-card-text class="d-flex justify-center" :class="bgMessage">
        <h1 v-if="text">{{ text }}</h1>
      </v-card-text>
</v-card>

    <v-card max-height="450" class="combat-log">


      <div v-if="combatLog && !outOfCombat" >
        <ul
          v-for="(e, i) in combatLog.slice().reverse()"
          v-bind:key="i"
          
        >
          <li>{{ e }}</li>
        </ul>
      </div>

    <v-container v-if='outOfCombat'>
        <v-row>
            <game-shop @boughtWeapon="boughtWeapon" @boughtArmor="boughtArmor"></game-shop>
        </v-row>
        <v-row>
            <v-btn block color="primary" elevation="4" medium>Continue</v-btn>
        </v-row>
    </v-container>


    </v-card>


  </v-container>
</template>

<script>
import GameShop from './GameShop.vue';

export default {
    components: {
GameShop,
    },
  props: {
    bgMessage: String,
    text: String,
    combatLog: Array,
    outOfCombat: Boolean,
  },
  methods: {
      boughtWeapon(w) {
          this.$parent.inventory.push(w);
          },
      boughtArmor(a) {
          this.$parent.equip = a;

      },
  }
};
</script>

<style>
.combat-log {
  overflow: hidden;
}
</style>
