<template>
  <v-container class="body-bg">
    <v-card >
      <v-card-text
        class="d-flex justify-center text-bg white--text"
        :class="bgMessage"
        style="min-height: 70px"
      >
        <h3 v-if="text">{{ text }} </h3>
      </v-card-text>
    </v-card>
    <br />

    <v-card max-height="450" class="combat-log">
      <div v-if="combatLog && !outOfCombat" class="combatlog-bg white--text">
        <div
          id="log-entry"
          v-for="(e, i) in combatLog.slice().reverse()"
          v-bind:key="i"
        >
          <span>{{ e }}</span>
        </div>
      </div>

      <v-container v-if="outOfCombat" class="body-bg">
        <v-row v-if="isShop">
          <game-shop
            @boughtHealth="boughtHealth"
            @boughtWeapon="boughtWeapon"
            @boughtArmor="boughtArmor"
            :toonGold="$parent.toon.gold"
            @displayText="shopText"
          ></game-shop>
        </v-row>

        <v-row v-if="!isShop">
          <v-btn
            block
            @click="isShop = true"
            color="primary"
            elevation="4"
            medium
            >Shop</v-btn
          >
        </v-row>

        <v-row>
          <v-btn
            block
            @click="
              $emit('continue');
              isShop = false;
            "
            color="primary"
            elevation="4"
            medium
            >Continue</v-btn
          >
        </v-row>

        <v-row v-if="bossCondition">
          <v-btn
            block
            @click="
              $emit('bossStage');
              isShop = false;
            "
            color="primary"
            elevation="4"
            medium
            >... an opportunity?</v-btn
          >
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import GameShop from "./GameShop.vue";

export default {
  components: {
    GameShop,
  },
  props: {
    bgMessage: String,
    text: String,
    combatLog: Array,
    outOfCombat: Boolean,
    bossCondition: Boolean,
  },
  data() {
    return {
      isShop: false,
    };
  },
  methods: {
    boughtWeapon(w) {
        let okay = true;
        this.$parent.inventory.forEach(weapon => {
            if(weapon.name == w.name) {
                this.text = 'Out of stock!';
                okay = false;
                return;
            }
        });
        if(okay) {

            this.$parent.inventory.push(w);
      this.$parent.toon.gold -= w.cost;
      this.$parent.displayText = `Bought ${w.name} for ${w.cost}g`;
        }
    },
    boughtArmor(a) {
        
      this.$parent.equip = a;
      this.$parent.toon.gold -= a.cost;
      this.$parent.displayText = `Bought ${a.name} for ${a.cost}g`;
    },
    boughtHealth(cost) {

        let roll = Math.floor(this.$parent.rollDamage(this.$parent.toon.vigor*0.75));
        this.$parent.toon.hp+=roll;
        this.$parent.toon.gold -= cost;
      this.$parent.displayText = `Healed for ${roll}!`;
    },
    shopText(text) {
      this.text = text;
    },
  },
};
</script>

<style>
.combat-log {
  overflow: hidden;
}
#log-entry {
  padding: 3px;

  border: 1px dotted black;
}
</style>
