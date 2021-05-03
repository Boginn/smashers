<template>
  <v-container class="body-bg">
    <v-card>
      <v-card-text
        class="d-flex justify-center text-bg white--text"
        :class="textColor"
        style="min-height: 70px"
      >
        <h3 v-html="text" v-if="text"></h3>
        <h3 v-if="text == '' && outOfCombat">{{ defaultMessage }}</h3>
      </v-card-text>
    </v-card>
    <br />

    <v-card max-height="750" class="combat-log">
      <div v-if="combatLog && !outOfCombat" class="combatlog-bg white--text">
        <div
          id="log-entry"
          v-for="(entry, i) in combatLog.slice().reverse()"
          v-bind:key="i"
        >
          <span v-html="entry"></span>
        </div>
      </div>

      <v-container v-if="outOfCombat" class="body-bg">
                  <v-row>
          <v-btn
            block
            outlined
            @click="
              $emit('continue');
              isShop = false;
            "
            elevation="4"
            medium
            class="white--text"
            >Next Stage</v-btn
          >
        </v-row>
<v-row> <br></v-row>

        <v-row v-if="isShop">
          <game-shop
            @boughtItem="boughtItem"
            @boughtWeapon="boughtWeapon"
            @boughtArmor="boughtArmor"
            :toonGold="$parent.toon.gold"
            @displayText="shopText"
          ></game-shop>
        </v-row>

        <v-row v-if="!isShop">
          <v-btn
            block
            outlined
            @click="isShop = true"
            elevation="4"
            medium
            class="white--text"
            >Shop</v-btn
          >
        </v-row>
        <v-row> <br></v-row>
        <v-row v-if="bossCondition">
          <v-btn
            block
            outlined
            @click="
              $emit('bossStage');
              isShop = false;
            "
            elevation="4"
            medium
            class="white--text"
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
    textColor: String,
    text: String,
    combatLog: Array,
    outOfCombat: Boolean,
    bossCondition: Boolean,
  },
  data() {
    return {
      isShop: false,
      defaultMessage: 'Shop, continue... or explore?',
    };
  },
  methods: {
    boughtWeapon(w) {
      let okay = true;
      this.$parent.inventory.forEach((weapon) => {
        if (weapon.name == w.name) {
          this.text = "Out of stock!";
          okay = false;
          return;
        }
      });
      if (okay) {
        this.$parent.inventory.push(w);
        this.$parent.toon.gold -= w.cost;
        this.$parent.displayText = `Bought ${w.name} for ${w.cost}g`;
        this.$emit('spentGold', w.cost);
      }
    },
    boughtArmor(a) {
      this.$parent.toon.equip = a;
      this.$parent.toon.gold -= a.cost;
      this.$parent.displayText = `Bought ${a.name} for ${a.cost}g`;
      this.$emit('spentGold', a.cost);
    },
    boughtItem(i) {
      if (i.name == "Some Health") {
        let roll = Math.floor(
          this.$parent.rollDamage(this.$parent.toon.vigor * 1.5)
        );
        this.$parent.toon.hp += roll;
        this.$parent.toon.gold -= i.cost;
        this.$parent.displayText = `Healed for ${roll}!`;
        this.$emit('spentGold', i.cost);
      } else if (i.name == "Ring of Sacrifice") {
          this.$parent.toon.sacrifice = true;
          this.$parent.toon.gold -= i.cost;
          this.$parent.displayText = `Equipped the ${i.name}!`;
          this.$emit('spentGold', i.cost);
      } else if (i.name == "Bloodlust") {
          this.$parent.toon.lust = true;
          this.$parent.toon.gold -= i.cost;
          this.$parent.displayText = `Filled with ${i.name} for one round!`;
          this.$emit('spentGold', i.cost);
      }
    },
    shopText(text) {
      this.text = text;
    },
  },
};
</script>

<style scoped>
.combat-log {
  overflow: hidden;
}
.combatlog-bg {
  /* background-color: rgb(22, 92, 138); */
    background: linear-gradient(90deg, rgba(32, 48, 87, 0.95) 0%, rgba(8, 55, 63, 0.95) 24%, rgba(6, 78, 44, 0.76) 80%);

}
#log-entry {
  padding: 3px;
  padding-right: 10px;
  text-align: end;

  border: 1px dotted black;
}
.text-bg {
  background-color: rgba(102, 128, 163, 0.774);
}
  .defend-bg {
    background-color: rgba(49, 91, 146, 0.877);
  }
  .attack-bg {
    background-color: rgba(168, 103, 50, 0.95);
  }
</style>
